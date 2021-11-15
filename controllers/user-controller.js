const { User } = require('../models');
/*
/api/users
    GET all users
    GET a single user by its _id and populated thought and friend data
    POST a new user:
        // example data
        {
        "username": "lernantino",
        "email": "lernantino@gmail.com"
        }
    PUT to update a user by its _id
    DELETE to remove user by its _id
    BONUS: Remove a user's associated thoughts when deleted.

/api/users/:userId/friends/:friendId
    POST to add a new friend to a user's friend list
    DELETE to remove a friend from a user's friend list
*/

const userController = {
    
    // get all users
    getAllUsers(req, res){
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                res.status(400).json({message: 'No users found', error: err});
            });
    },

    // get user by id
    getUserById({ params }, res){
        User.findOne({ _id: params.userId })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(400).json({message: 'No user found with this id'});
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => {
                res.status(400).json({message: 'No user found with this id', error: err});
            });
    },

    // create user 
    createUser({body}, res){
        // expects: { "username": "johndoe", "email": "johndoe@example.com" }
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => console.log(err));
    },

    // update user
    updateUser({params, body}, res){
        User.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(400).json({message: 'No user found with this id'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                res.status(400).json({message: 'No user found with this id', error: err});
            });
    },

    // destroy user
    destroyUser({params}, res){
        User.findOneAndDelete({ _id: params.userId })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                res.status(400).json({message: 'No user found with this id', error: err});
            });
    },

    // add friend
    addFriend({params}, res){
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(400).json({message: 'No user found with this id'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => console.log(err));
    },

    // remove friend
    removeFriend({params}, res){
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    }
}

module.exports = userController;

