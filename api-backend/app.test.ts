import request from 'supertest'
import { describe, test, expect} from '@jest/globals'

describe('Index Route', () =>{
    test("Responds with 200 status code", async() =>{
        const response = await request(api).get('/home')
        expect(response.status).toEqual(200)
    })

    test("Responds with json content", async() =>{
        const response = await request(api).get('/home')
        expect(response.headers['content-type']).toMatch(/json/)
    })

    test("Returns with \'welcome home\' message", async() =>{
        const response = await request(api).get('/home')
        expect(response.body.message).toMatch(/welcome home/i)
    })
})
