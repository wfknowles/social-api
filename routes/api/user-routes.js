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

// /api/users
router.route('/')
    .get(getAllUsers)
    .post(createUser);

// /api/users/<userId>
router.route('/:userId')
    .get(getUserById)
    .put(updateUser)
    .delete(destroyUser);

// /api/users/<userId>/friends/<friendId>
router.route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(removeFriend);

// router.route('*', (req, res) => {
//     res.status(404).send();
// });

module.exports = router;