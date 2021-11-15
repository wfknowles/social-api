const request = require("supertest");
const {app, db} = require("../server");


describe('User Route Test Suite', () => {
    const newUser = {
        username: 'jesttesting',
        email: 'jesttesting@example.com'
    };
    let dbUser = {};
    let dbFriend = {};

    test('missing routes respond with 400 Error', async () => {
        const res = await request(app).get('/api/users/chickens');
        expect(res.statusCode).toEqual(400);
    });

        
    describe('/api/users', () => {

        test('POST - Create User', async () => {
            // route request
            const res = await request(app)
                .post('/api/users')
                .send(newUser);

            // update dbUser for further testing
            dbUser = res.body;

            // response
            expect(res.statusCode).toEqual(200);
            expect(res.type).toEqual('application/json');

            // id
            expect(dbUser._id);
            // username
            expect(dbUser.username).toEqual(newUser.username);
            // email
            expect(dbUser.email).toEqual(newUser.email);
            // thoughts
            expect(dbUser.thoughts).toEqual([]);
            // friends
            expect(dbUser.friends).toEqual([]);
            // friendCount
            expect(dbUser.friendCount).toEqual(0);
            // __v
            expect(dbUser.__v).toEqual(0);
        });

        test('GET - All Users', async () => {
            const res = await request(app).get('/api/users');
            // first item has id
            expect(res.body[0]._id);
            // last item has id
            expect(res.body[res.body.length - 1]._id);
        });
    });

    describe('/api/users/<userId>', () => {
        test('GET - User', async () => {
            // route request
            const res = await request(app)
                .get(`/api/users/${dbUser._id}`);

            // response
            expect(res.statusCode).toEqual(200);
            expect(res.type).toEqual('application/json');

            // id
            expect(res.body._id).toEqual(dbUser._id);
            // username
            expect(res.body.username).toEqual(dbUser.username);
            // email
            expect(res.body.email).toEqual(dbUser.email);
            // thoughts
            expect(res.body.thoughts).toEqual(dbUser.thoughts);
            // friends
            expect(res.body.friends).toEqual(dbUser.friends);
            // friendCount
            expect(res.body.friendCount).toEqual(dbUser.friendCount);
            // __v
            expect(res.body.__v).toEqual(dbUser.__v);
        });

        test('PUT - Update User', async () => {
            // route request
            const res = await request(app)
                .put(`/api/users/${dbUser._id}`)
                .send({email: 'updatedjesttesting@example.com'});

            // response
            expect(res.statusCode).toEqual(200);
            expect(res.type).toEqual('application/json');

            // email
            expect(res.body.email).toEqual('updatedjesttesting@example.com');

        });

        test('DELETE - Delete User', async () => {
            // route request
            const res = await request(app)
                .delete(`/api/users/${dbUser._id}`);

            // response
            expect(res.statusCode).toEqual(200);
            expect(res.type).toEqual('application/json');

            // id
            expect(res.body._id).toEqual(dbUser._id);
        });
    });

    describe('/api/users/<userId>/friends/<friendId>', () => {

        // add friend
        test('POST - Add Friend', async () => {

            const newFriend = {
                username: 'jesttestingfriend',
                email: 'jesttestingfriend@example.com'
            };
            // create user
            const newUserRes = await request(app)
                    .post('/api/users')
                    .send(newUser);
            dbUser = newUserRes.body;

            // initial test user had no friends
            expect(dbUser.friends.length).toEqual(0);

            // create friend
            const newFriendRes = await request(app)
                    .post('/api/users')
                    .send(newFriend);
            dbFriend = newFriendRes.body;

            // route request
            const addFriendRes = await request(app)
                .post(`/api/users/${dbUser._id}/friends/${dbFriend._id}`)
                .send();

            // update dbUser
            dbUser = addFriendRes.body;

            // updated user has friends
            expect(addFriendRes.body.friends.length).toEqual(1);

            // updated user's friend is our test friend
            expect(addFriendRes.body.friends[0]).toEqual(dbFriend._id);
        });
        

        // remove friend
        test('DELETE - Remove Friend', async () => {

            // initial test user has friends
            expect(dbUser.friends.length).toBeGreaterThan(0);

            // route request
            const deleteFriendRes = await request(app)
                .delete(`/api/users/${dbUser._id}/friends/${dbFriend._id}`);

            // friend has been removed
            expect(deleteFriendRes.body.friends.length).toEqual(0);

            // clean up remaing user route testing data
            await request(app)
                .delete(`/api/users/${dbUser._id}`);
            await request(app)
                .delete(`/api/users/${dbFriend._id}`);
            });
    });

    // after all tests disconnect from mongoose and close application
    afterAll( async () => {
        (await db).disconnect();
        app.close();
    })
});