const mongoose = require('mongoose');
const Joi = require('joi');
const jsonwebtoken = require('jsonwebtoken');


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    profileImage: {
        type: String,
        default:'https://ik.imagekit.io/picloungestore/avatar.webp?updatedAt=1683395304506'
    },
    followers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    likedPosts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    oneTimePassword: {
        type: String,
    },
    role: {
        type: String,
        default: 'user'
    }

});

userSchema.methods.generateAuthToken = function() {
    const token = jsonwebtoken.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
        username: this.username,
        role: this.role
    }, process.env.JWT_SECRET_KEY || 'jwtPrivateKey')
    return token;
}


const User = mongoose.model('User', userSchema);

function validateUser(user) {

    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        dateOfBirth: Joi.date().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(50).required(),
        username: Joi.string().min(6).max(16).regex(/^[^\s@]+$/).required(),
    });
    
    return schema.validate(user);
}


module.exports = {
    User,
    validateUser
};
