/**
 * Represents all the information about a user. That is stored in the database
 */
export interface User{
    user_id: number;
    name: string;
    punktestand? : number;
}