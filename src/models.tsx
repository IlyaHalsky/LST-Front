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
    username?: string
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
    username: '',
}

export const ItemTypes = {
    CARD: 'card'
}
