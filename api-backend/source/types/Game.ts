interface BasicPayload{
    username: string
}

export interface Paddle extends BasicPayload{
    position_x: number,
    position_y: number,
    motion: number
}

export interface Bounce extends BasicPayload{
    left: boolean,
    random: number
}

export interface Goal extends BasicPayload{
    left: boolean,
}