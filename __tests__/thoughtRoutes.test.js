const request = require("supertest");
const {app, db} = require("../server");

describe('Thought Route Test Suite', () => {
    const newThought = {
        thoughtText: 'lorem ipsum dolar sit amet',
        username: 'jesttesting',
        userId: "5edff358a0fcb779aa7b118b"
    };

    let dbThought = {};
    let dbReaction = {};

    test('missing routes respond with 400 Error', async () => {
        const res = await request(app).get('/api/thoughts/chickens');
        expect(res.statusCode).toEqual(400);
    });

        
    describe('/api/thoughts', () => {

        test('POST - Create Thought', async () => {
            // route request
            const res = await request(app)
                .post('/api/thoughts')
                .send(newThought);

            // update dbThought for further testing
            dbThought = res.body;

            // response
            expect(res.statusCode).toEqual(200);
            expect(res.type).toEqual('application/json');

            // id
            expect(dbThought._id);
            // thoughtText
            expect(dbThought.thoughtText).toEqual(newThought.thoughtText);
            // username
            expect(dbThought.username).toEqual(newThought.username);
            // userId
            expect(dbThought.userId).toEqual(newThought.userId);
            // reactions
            expect(dbThought.reactions).toEqual([]);
            // reactionCount
            expect(dbThought.reactionCount).toEqual(0);
            // __v
            expect(dbThought.__v).toEqual(0);
        });

        test('GET - All Thoughts', async () => {
            const res = await request(app).get('/api/thoughts');
            // first item has id
            expect(res.body[0]._id);
            // last item has id
            expect(res.body[res.body.length - 1]._id);
        });
    });

    describe('/api/thoughts/<thoughtId>', () => {
        test('GET - Thought', async () => {
            // route request
            const res = await request(app)
                .get(`/api/thoughts/${dbThought._id}`);

            // response
            expect(res.statusCode).toEqual(200);
            expect(res.type).toEqual('application/json');

            // id
            expect(res.body._id);
            // thoughtText
            expect(res.body.thoughtText).toEqual(dbThought.thoughtText);
            // username
            expect(res.body.username).toEqual(dbThought.username);
            // userId
            expect(res.body.userId).toEqual(dbThought.userId);
            // reactions
            expect(res.body.reactions).toEqual(dbThought.reactions);
            // reactionCount
            expect(res.body.reactionCount).toEqual(dbThought.reactionCount);
            // __v
            expect(res.body.__v).toEqual(dbThought.__v);
        });

        test('PUT - Update Thought', async () => {
            // route request
            const res = await request(app)
                .put(`/api/thoughts/${dbThought._id}`)
                .send({thoughtText: 'updated lorem ipsum dolar sit amet'});

            // response
            expect(res.statusCode).toEqual(200);
            expect(res.type).toEqual('application/json');

            // email
            expect(res.body.thoughtText).toEqual('updated lorem ipsum dolar sit amet');

        });

        test('DELETE - Delete Thought', async () => {
            // route request
            const res = await request(app)
                .delete(`/api/thoughts/${dbThought._id}`);

            // response
            expect(res.statusCode).toEqual(200);
            expect(res.type).toEqual('application/json');

            // id
            expect(res.body._id).toEqual(dbThought._id);
        });
    });

    describe('/api/thoughts/<thoughtId>/reactions/<reactionId>', () => {

        // add reaction
        test('POST - Add Reaction', async () => {
            const newReaction = {
                reactionBody: 'lorem ipsum dolar sit amet',
                username: 'jesttestingfriend',
                userId: "5edff358a0fcb779aa7b118b"
            };
            // create thought
            const newThoughtRes = await request(app)
                    .post('/api/thoughts')
                    .send(newThought);
            dbThought = newThoughtRes.body;

            // initial test thought has no reactions
            expect(dbThought.reactions.length).toEqual(0);

            // route request
            const addReactionRes = await request(app)
                .post(`/api/thoughts/${dbThought._id}/reactions`)
                .send(newReaction);
            
            // update dbThought
            dbThought = addReactionRes.body;
            dbReaction = addReactionRes.body.reactions[0];

            // updated thought has reactions
            expect(addReactionRes.body.reactions.length).toEqual(1);

            // updated thoughts's reaction is our reacion
            expect(addReactionRes.body.reactions[0].reactionId).toEqual(dbReaction.reactionId);
        });
        

        // remove friend
        test('DELETE - Remove Reaction', async () => {

            // initial test thought has reactions
            expect(dbThought.reactions.length).toBeGreaterThan(0);

            // route request
            const deleteThoughtRes = await request(app)
                .delete(`/api/thoughts/${dbThought._id}/reactions/${dbReaction.reactionId}`);

            // friend has been removed
            expect(deleteThoughtRes.body.reactions.length).toEqual(0);

            // clean up remaing user route testing data
            await request(app)
                .delete(`/api/thoughts/${dbThought._id}`);
            });
    });

    // after all tests disconnect from mongoose and close application
    afterAll( async () => {
        (await db).disconnect();
        app.close();
    })
});