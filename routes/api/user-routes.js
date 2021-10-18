const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    destroyUser,
    addFriend,
    removeFriend
} = require('../../controllers/user-controller');

// GET /api/users
router.route('/').get(getAllUsers);

// POST /api/users
router.route('/').post(createUser);

// GET /api/users/<userId>
router.route('/:userId').get(getUserById);

// PUT /api/users/<userId>
router.route('/:userId').put(updateUser);

// DELETE /api/users/<userId>
router.route('/:userId').delete(destroyUser);

// POST /api/users/<userId>/friends/<friendId>
router.route('/:userId/friends/:friendId').post(addFriend);

// DELETE /api/users/<userId>/friends/<friendId>
router.route('/:userId/friends/:friendId').delete(removeFriend);


module.exports = router;