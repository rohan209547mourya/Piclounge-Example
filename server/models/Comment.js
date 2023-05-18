const mongoose = require('mongoose');
const Joi = require('joi');


const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    ]
});


const Comment = mongoose.model('Comment', commentSchema);

function validateComment(comment) {
        
    const schema = Joi.object({
        comment: Joi.string().min(1).max(1024).required(),
    });

    return schema.validate(comment);
}


module.exports = {
    Comment,
    validateComment
}
        
