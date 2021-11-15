const { Schema, model, Types } = require('mongoose');
const {dateFormat} = require('../utils/dateFormat');

/* 
Thought
    thoughtText: String, Required, Must be between 1 and 280 characters
    createdAt: Date, Set default value to the current timestamp, Use a getter method to format the timestamp on query
    username (The user that created this thought): String, Required
    reactions (These are like replies): Array of nested documents created with the reactionSchema
        virtuals -
            reactionCount: length of the thought's reactions array

Reaction
    reactionId: Use Mongoose's ObjectId data type, Default value is set to a new ObjectId
    reactionBody: String, Required, 280 character maximum
    username: String, Required
    createdAt: Date, Set default value to the current timestamp, Use a getter method to format the timestamp on query
        virtuals -
            This will not be a model, but rather will be used as the reaction field's subdocument schema in the Thought model.
*/
const ReactionSchema = new Schema({
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            trim: true
        },
        userId: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
    toJSON: {
        getters: true
    },
    _id: false,
    id: false
});

const ThoughtSchema = new Schema(
{
    thoughtText: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: String,
        required: true,
        trim: true
    },
    reactions: [ReactionSchema],

},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
}
);

// get total count of friends
ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;
