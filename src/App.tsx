import './App.css'


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
    console.log(fields)
    const random = Math.floor(Math.random() * 41)
    const random2 = Math.floor(Math.random() * 51)
    return (
        <>
            <img src={fields[random]} className="field" alt="field"/>
            <img src={boards[random2]} className="board" alt="board"/>
        </>
    )
}

export default App
