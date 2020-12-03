const request = require('supertest');

const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../factories');

describe('Auth', () => {
    beforeEach(async () => {
        await truncate();
    });

    it('must authenticate', async () => {
        const user = await factory.create('User', {
            password: "secret"
        })

        const response = await request(app).post("/sessions")
            .send({
                email: user.email,
                password: "secret"
            });

        expect(response.status).toBe(200);
    });

    it('must not authenticate', async () => {
        const user = await factory.create('User', {
            password: "secret"
        })

        const response = await request(app).post("/sessions")
            .send({
                email: user.email,
                password: "wrong_password"
            });

        expect(response.status).toBe(401);
    });

    it('must return not found', async () => {
        await factory.create('User', {
            email: "user@email.com",
            password: "secret"
        })

        const response = await request(app).post("/sessions")
            .send({
                email: "wrong@email.com",
                password: "secret"
            });

        expect(response.status).toBe(400);
    });

    it('must return token', async () => {
        const user = await factory.create('User')

        const response = await request(app).post("/sessions")
            .send({
                email: user.email,
                password: user.password
            });

        expect(response.body).toHaveProperty("token");
    });

    it('must access private routes', async () => {
        const user = await factory.create('User')

        const response = await request(app).get("/files")
            .set('Authorization', `Bearer ${user.generateToken()}`)

        expect(response.status).toBe(200);
    });

    it('must not access private routes without token', async () => {
        const user = await factory.create('User')

        const response = await request(app).get("/files")

        expect(response.status).toBe(401);
    });

    it('must not access private routes with invalid token', async () => {
        const user = await factory.create('User')

        const response = await request(app).get("/files")
            .set('Authorization', `Bearer someinvalidtoken`)

        expect(response.status).toBe(401);
    });
});
