const { Thought } = require('../models');
/*
/api/thoughts
    GET to get all thoughts
    GET to get a single thought by its _id
    POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
        // example data
        {
        "thoughtText": "Here's a cool thought...",
        "username": "lernantino",
        "userId": "5edff358a0fcb779aa7b118b"
        }
    PUT to update a thought by its _id
    DELETE to remove a thought by its _id

/api/thoughts/:thoughtId/reactions
    POST to create a reaction stored in a single thought's reactions array field
    DELETE to pull and remove a reaction by the reaction's reactionId value
*/

const thoughtController = {
    
    // get all thoughts
    getAllThoughts(req, res){
        Thought.find({})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                res.status(400).json({message: 'No thoughts found', error: err});
            });
    },

    // get thought by id
    getThoughtById({ params }, res){
        Thought.findOne({ _id: params.thoughtId })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(400).json({message: 'No thought found with this id'});
                    return;
                }
                res.json(dbThoughtData)
            })
            .catch(err => {
                res.status(400).json({message: 'No thought found with this id', error: err});
            });
    },

    // create thought
    createThought({body}, res){
        // expects: { "thoughtText": "Lorem ipsum dolar sit...", "username": "johndoe", "userId": "5edff358a0fcb779aa7b118b"}
        Thought.create(body)
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                res.status(400).json({
                    message: 'Thought could not be created', 
                    body: body, 
                    error: err
                });
            });
    },

    // update thought
    updateThought({params, body}, res){
        Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(400).json({message: 'No thought found with this id'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                res.status(400).json({
                    message: 'Either no thought found or could not be updated', 
                    thoughtId: params.thoughtId, 
                    body: body,
                    error: err
                });
            });
    },

    // destroy thought
    destroyThought({params}, res){
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                res.status(400).json({
                    message: 'Either no thought found or could not be destroyed', 
                    thoughtId: params.thoughtId,
                    error: err
                });
            });
    },

    // add reaction
    addReaction({params, body}, res){
        console.log('addReaction', params, body);
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(400).json({message: 'No thought found with this id'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                res.status(400).json({
                    message: 'Reaction could not be added to thought', 
                    thoughtId: params.thoughtId,
                    body: body,
                    error: err
                });
            });
    },

    // remove reaction
    removeReaction({params}, res){
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                res.status(400).json({
                    message: 'Reaction could not be removed from thought', 
                    thoughtId: params.thoughtId,
                    reactionId: params.reactionId,
                    error: err
                });
            });
    }
}

module.exports = thoughtController;

