

/**
 * Contains the information about a room, that is stored in the database
 */
export interface Raum{
    raum_id: number,
    titel: string,
    user_id1: number,
    user_id2: number,
    öffentlich: boolean,
    passwort: string,
    user1: string
    user2: string
}
