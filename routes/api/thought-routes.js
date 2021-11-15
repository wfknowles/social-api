const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    destroyThought,
    addReaction,
    removeReaction
} = require('../../controllers/thought-controller');

// /api/thoughts
router.route('/')
    .get(getAllThoughts)
    .post(createThought);

// /api/thoughts/<thoughtId>
router.route('/:thoughtId')
    .get(getThoughtById)
    .put(updateThought)
    .delete(destroyThought);

// /api/thoughts/<thoughtId>/reactions
    router.route('/:thoughtId/reactions')
    .post(addReaction);

// /api/thoughts/<thoughtId>/reactions/<reactionId>
router.route('/:thoughtId/reactions/:reactionId')
    .delete(removeReaction);

module.exports = router;