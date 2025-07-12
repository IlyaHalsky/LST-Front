/**
 * API functions for communicating with the backend
 * 
 * This file contains all HTTP-related functions and session management
 * to keep the App component clean and focused on UI rendering.
 */

import {type Action, type AppState, DefaultAppState} from './models.tsx';
import { getApiUrl } from './apiConfig';

// Function to generate a random session key
export const generateSessionKey = (): string => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Function to get or set the lst_session cookie
export const getOrSetSessionCookie = (): string => {
    const cookieName = 'lst_session';
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const sessionCookie = cookies.find(cookie => cookie.startsWith(`${cookieName}=`));

    if (sessionCookie) {
        return sessionCookie.split('=')[1];
    } else {
        const sessionKey = generateSessionKey();
        // Set cookie with no expiration (lives forever)
        document.cookie = `${cookieName}=${sessionKey}; path=/; max-age=31536000000`;
        return sessionKey;
    }
};

// Function to get or set the username cookie
export const getOrSetUsernameCookie = (newUsername?: string): string => {
    const cookieName = 'lst_username';
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const usernameCookie = cookies.find(cookie => cookie.startsWith(`${cookieName}=`));

    if (newUsername !== undefined) {
        // Set the new username in the cookie
        document.cookie = `${cookieName}=${newUsername}; path=/; max-age=31536000000`;
        return newUsername;
    } else if (usernameCookie) {
        // Return existing username
        return usernameCookie.split('=')[1];
    } else {
        // No username cookie exists and no new username provided
        return '';
    }
};

// Function to hash an action with a session key for verification
export const hashAction = async (action: Action, sessionKey: string): Promise<string> => {
    const actionStr = JSON.stringify(action);
    const data = actionStr + sessionKey;
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', encodedData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};

// Function to fetch initial state from the backend
export const fetchInitialState = async (sessionKey: string): Promise<AppState> => {
    try {
        // Prepare payload with sessionKey
        const payload = {
            sessionKey
        };

        // Send request to backend/init endpoint
        const response = await fetch(getApiUrl('/init'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Parse response and return state
            const state = await response.json();

            // If server returned a username, save it to cookie
            if (state.username) {
                getOrSetUsernameCookie(state.username);
            } else {
                // If no username from server, try to get from cookie
                const cookieUsername = getOrSetUsernameCookie();
                if (cookieUsername) {
                    state.username = cookieUsername;
                }
            }

            return state;
        } else {
            console.error('Error initializing state from server:', response.status);
            // Return default state if server request fails
            const defaultState = { ...DefaultAppState };

            // Try to get username from cookie for default state
            const cookieUsername = getOrSetUsernameCookie();
            if (cookieUsername) {
                defaultState.username = cookieUsername;
            }

            return defaultState;
        }
    } catch (error) {
        console.error('Error fetching initial state:', error);
        // Return default state if request fails
        const defaultState = { ...DefaultAppState };

        // Try to get username from cookie for default state
        const cookieUsername = getOrSetUsernameCookie();
        if (cookieUsername) {
            defaultState.username = cookieUsername;
        }

        return defaultState;
    }
};

// Function to send an action to the server and get updated state
export const sendActionToServer = async (lastAction: Action, sessionKey: string): Promise<AppState | null> => {
    try {
        // Generate action key by hashing lastAction with sessionKey
        const actionKey = await hashAction(lastAction, sessionKey);

        // Prepare payload
        const payload = {
            lastAction,
            sessionKey,
            actionKey
        };

        // Send request to server using configured API URL
        const response = await fetch(getApiUrl('/action'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Parse response and return new state
            return await response.json();
        } else {
            console.error('Server returned an error:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error sending action to server:', error);
        return null;
    }
};

// Function to send username to the server
export const sendUsernameToServer = async (username: string, sessionKey: string): Promise<boolean> => {
    try {
        // Prepare payload
        const payload = {
            username,
            sessionKey
        };

        // Send request to server using configured API URL
        const response = await fetch(getApiUrl('/username'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Save username to cookie
            getOrSetUsernameCookie(username);
            return true;
        } else {
            console.error('Server returned an error when updating username:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Error sending username to server:', error);
        return false;
    }
};

// Function to send reset request to the server and get updated state
export const sendResetToServer = async (sessionKey: string): Promise<AppState | null> => {
    try {
        // Prepare payload
        const payload = {
            sessionKey
        };

        // Send request to server using configured API URL
        const response = await fetch(getApiUrl('/reset'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Parse response and return new state
            return await response.json();
        } else {
            console.error('Server returned an error during reset:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error sending reset request to server:', error);
        return null;
    }
};
