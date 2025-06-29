export interface Card {
    id: string,
    attack: number,
    health: number,
}

export interface CardWithPosition extends Card {
    position: number
}

export interface AppState {
    fieldId: number
    boardId: number
    opponent: Card[]
    player: Card[]
}

export interface Action {
    from: CardWithPosition,
    to: CardWithPosition,
}

export const DefaultAppState = {
    fieldId: 0,
    boardId: 0,
    opponent: [],
    player: [],
}

export const ItemTypes = {
    CARD: 'card'
}