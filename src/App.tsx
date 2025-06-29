import './App.css'
import {useEffect, useState} from "react";
import {type Action, type AppState, DefaultAppState} from "./models.tsx";
import BoardComp from "./Board.tsx";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import { getOrSetSessionCookie, fetchInitialState, sendActionToServer } from "./api";

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

    // Initialize session key on component mount
    useEffect(() => {
        const key = getOrSetSessionCookie();
        setSessionKey(key);
    }, [])
    // Initialize state by fetching from backend when sessionKey is available
    useEffect(() => {
        const initializeState = async () => {
            if (sessionKey) {
                const initialState = await fetchInitialState(sessionKey);
                setState(initialState);
            }
        };

        initializeState();
    }, [sessionKey])
    const [lastAction, setLastAction] = useState<Action | null>(null)

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
    return (
        <>
            <img src={fields[state.fieldId]} className="field" alt="field"/>
            <img src={boards[state.boardId]} className="board" alt="board"/>
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
