import {generateAccessToken, getUserFromToken, registerUserToken, User} from './auth/auth'

let user: Array<User>;

test('generate a token expects a value with 128 chars', () =>{
    expect(generateAccessToken("hansgustav").length).toBeGreaterThan(0)
});

test('generates a token and adds it to a user array and validates its existance', () => {
    let user: string = "hans";
    let token = generateAccessToken(user);
    registerUserToken(user, token);
    let element: User = {username: user, token: token}

    expect(getUserFromToken(token)).toEqual(element)
});