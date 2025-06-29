import frame from "./assets/frame.png"
import {type Action, type Card, type CardWithPosition, ItemTypes} from "./models.tsx";
import {DragPreviewImage, useDrag, useDragLayer, useDrop} from "react-dnd";


function CardComp({card: {id, attack, health}, position, draggable, setLastAction}: {
    card: Card,
    position: number,
    draggable: boolean,
    highlight?: boolean,
    setLastAction?: (action: Action) => void
}) {
    const imageUrl = `https://art.hearthstonejson.com/v1/render/latest/enUS/512x/${id}.png`
    const [{isDragging}, drag, preview] = useDrag(() => ({
        type: ItemTypes.CARD,
        canDrag: draggable,
        item: {id, attack, health, position},
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    const [{isOver, canDrop}, drop] = useDrop(() => ({
        accept: ItemTypes.CARD,
        canDrop: () => !draggable,
        drop: (target: CardWithPosition) => setLastAction({from: target, to: {id, attack, health, position}}),
        collect: monitor => ({
            isOver: !!monitor.isOver() && monitor.canDrop(),
            canDrop: !monitor.isOver() && !!monitor.canDrop(),
        }),
    }))

    const {dragActive} = useDragLayer(
        monitor => ({
            dragActive: monitor.isDragging()
        })
    )

    const classNames = `frame ${isDragging ? 'dragging' : ''} ${(draggable && !dragActive) ? 'draggable' : ''} ${isOver ? 'over' : ''} ${canDrop ? 'canDrop' : ''}`
    return (
        <>
            <DragPreviewImage connect={preview} src={imageUrl}/>
            <div ref={(ref) => drag(drop(ref))} className="card">
                <img src={frame} className={classNames}/>
                <img src={imageUrl} className="cardArt"/>
                <span className="cardText attack" data-text={attack}>{attack}</span>
                <span className="cardText health" data-text={health}>{health}</span>
            </div>
        </>
    )
}

export default CardComp;