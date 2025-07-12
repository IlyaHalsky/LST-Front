import './App.css'
import {useEffect, useState} from "react";
import {type Action, type AppState, DefaultAppState} from "./models.tsx";
import BoardComp from "./Board.tsx";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import { getOrSetSessionCookie, fetchInitialState, sendActionToServer, sendUsernameToServer, getOrSetUsernameCookie, sendResetToServer } from "./api";
import resetIcon from './assets/reset.png';

const fields: string[] = Object.values(import.meta.glob('./assets/field/*.{png,PNG}', {
    eager: true,
    query: '?url',
    import: 'default'
}))
const boards: string[] = Object.values(import.meta.glob('./assets/board/*.{png,PNG}', {
    eager: true,
    query: '?url',
    import: 'default'
}))

function App() {
    const [state, setState] = useState<AppState>(DefaultAppState)
    const [sessionKey, setSessionKey] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [isPulsing, setIsPulsing] = useState<boolean>(false)

    // Initialize session key on component mount
    useEffect(() => {
        const key = getOrSetSessionCookie();
        setSessionKey(key);

        // Try to get username from cookie
        const savedUsername = getOrSetUsernameCookie();
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, [])

    // Initialize state by fetching from backend when sessionKey is available
    useEffect(() => {
        const initializeState = async () => {
            if (sessionKey) {
                const initialState = await fetchInitialState(sessionKey);
                setState(initialState);

                // Update username state if it's in the response
                if (initialState.username) {
                    setUsername(initialState.username);
                }
            }
        };

        initializeState();
    }, [sessionKey])

    const [lastAction, setLastAction] = useState<Action | null>(null)

    // Handle username change
    const handleUsernameBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const newUsername = e.target.value.trim();
        if (newUsername && sessionKey) {
            const success = await sendUsernameToServer(newUsername, sessionKey);
            if (success) {
                setUsername(newUsername);
            }
        }
    };

    // State to track if username input is in edit mode
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // Handle lastAction changes and communicate with server
    useEffect(() => {
        const processAction = async () => {
            if (lastAction && sessionKey) {
                const newState = await sendActionToServer(lastAction, sessionKey);
                if (newState) {
                    setState(newState);
                    // Clear lastAction after processing
                    setLastAction(null);
                }
            }
        };

        processAction();
    }, [lastAction, sessionKey]);

    // Handle reset button click
    const handleReset = async () => {
        // Set pulsing to true to trigger the animation
        setIsPulsing(true);

        if (sessionKey) {
            const newState = await sendResetToServer(sessionKey);
            if (newState) {
                setState(newState);
            }
        }
    };

    // Effect to reset the pulsing state after animation completes
    useEffect(() => {
        if (isPulsing) {
            const timer = setTimeout(() => {
                setIsPulsing(false);
            }, 500); // Match the animation duration (0.5s)

            return () => clearTimeout(timer);
        }
    }, [isPulsing]);
    return (
        <>
            <img src={fields[state.fieldId]} className="field" alt="field"/>
            <img src={boards[state.boardId]} className="board" alt="board"/>
            <div className="username-container">
                <input
                    type="text"
                    className={`username-input ${isEditing ? 'editing' : 'readonly'}`}
                    placeholder="Explorer"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setIsEditing(true)}
                    onBlur={(e) => {
                        handleUsernameBlur(e);
                        setIsEditing(false);
                    }}
                    readOnly={!isEditing}
                />
            </div>
            <button className={`reset-button ${isPulsing ? 'pulsing' : ''}`} onClick={handleReset}>
                <img src={resetIcon} alt="Reset Game" />
            </button>
            <DndProvider backend={HTML5Backend}>
                <BoardComp key={"board"} opponent={state.opponent} player={state.player} setLastAction={setLastAction}/>
            </DndProvider>
            <div className="legal-disclaimer">
                All game assets belong to Blizzard Entertainment, Inc.
            </div>
        </>
    )
}

export default App
