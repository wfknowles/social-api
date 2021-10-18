const request = require("supertest");
const {app, db} = require("../server");


describe('User Routes', () => {
    
    test('GET /api/users', () => {
        request(app)
            .get('/api/users')
            .expect('Content-Type', /json/)
            .expect(200);
    });

    afterAll( async () => {
        (await db).disconnect();
        app.close();
    })
});

