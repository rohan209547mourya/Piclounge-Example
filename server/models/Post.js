const mongoose = require('mongoose');
const Joi = require('joi');

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

const Post = mongoose.model('Post', postSchema);

function validatePost(post) {
    
    const schema = Joi.object({
        caption: Joi.string().min(1).max(1024).required(),
        image: Joi.string().required(),
    });

    return schema.validate(post);
}


module.exports = {
    Post,
    validatePost
}
