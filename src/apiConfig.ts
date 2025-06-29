/**
 * Configuration for API endpoints
 * 
 * This file provides the base URL for API requests based on the environment:
 * - In development: Uses the proxy configured in vite.config.ts
 * - In production: Uses the environment variable or falls back to a relative path
 */

// Get the API base URL from environment variables or use a default
const getApiBaseUrl = (): string => {
  // For production builds, use the environment variable if available
  if (import.meta.env.PROD) {
    // If VITE_API_BASE_URL is defined, use it
    if (import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL;
    }
    
    // If no environment variable is set, use a relative path
    // This assumes the backend is served from the same domain
    return '';
  }
  
  // In development, use an empty string to leverage the proxy in vite.config.ts
  return '';
};

// Export the API base URL
export const API_BASE_URL = getApiBaseUrl();

// Function to get the full URL for an API endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};