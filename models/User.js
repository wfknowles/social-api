const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

/* 
User
    username: String Unique Required Trimmed
    email String Required Unique - (look into Mongoose's matching validation)
    thoughts: Array of _id values referencing the Thought model
    friends: Array of _id values referencing the User model (self-reference)
        virtuals -
            friendCount: length of the user's friends array
*/

const UserSchema = new Schema(
{
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'Thought'
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    // prevent virtuals from creating duplicate of _id as `id`
    id: false
}
);

// get total count of friends
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = Pizza;
