import type {Action, Card} from "./models.tsx";
import CardComp from "./Card.tsx";

function BoardComp({opponent, player, setLastAction}: {
    opponent: Card[],
    player: Card[],
    setLastAction: (action: Action) => void
}) {
    const opponentCards = opponent.map((card, i) => (
        <CardComp key={`opponent-${i}`} card={card} position={i} draggable={false} setLastAction={setLastAction}/>));
    const playerCards = player.map((card, i) => (<CardComp key={`player-${i}`} card={card} position={i} draggable={true}/>));
    return <div className="playground">
        <div className="opponent">{opponentCards}</div>
        <div className="player"> {playerCards}</div>
    </div>
}

export default BoardComp;