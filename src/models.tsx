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
    fieldId: 38,
    boardId: 34,
    opponent: [],
    player: [],
}

export const ItemTypes = {
    CARD: 'card'
}