interface BasicPayload{
    username: string
}

export interface Paddle extends BasicPayload{
    position_x: number,
    position_y: number,
    motion: number
}

export interface Bounce extends BasicPayload{
    stopped: boolean,
    direction_x: number,
    direction_y: number
}