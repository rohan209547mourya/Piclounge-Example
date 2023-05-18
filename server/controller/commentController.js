const { options } = require('joi');
const {
    Comment, validateComment
} = require('../models/Comment');
const { Post } = require('../models/Post');
const { User } = require('../models/User');


const createNewComment = async (req, res, next) => {
    try {
        
        const requestBody = req.body;
        const { error } = validateComment(requestBody);

        if(error) {
            return res.status(400).json({
                message: error.details[0].message,
                status: 400
            })
        }

        const currentUser = await User.findOne({ email: req.user.email });

        if(!currentUser) {
            console.log("first");
            return res.status(404).json({
                message: "User not found!",
                status: 404,
            })
        }

        const post = await Post.findById(req.params.id);

        if(!post) {
            console.log("second");
            return res.status(404).json({
                message: "Post not found!",
                status: 404
            })
        }

        const comment = new Comment({
            comment: requestBody.comment,
            user: currentUser
        });


        (await comment.save()).populate('user', 'name username profileImage');

        post.comments.push(comment);

        await post.save();


        return res.status(200).json({
            message: "Comment Created!",
            status: 200,
            data: {
                comment: comment
            }
        })

    } catch (err) {
        return res.status(500).json({
            message: "Internal server error!",
            status: 500
        })
    }
}

// get comments by post id
const getCommentByPostId = async (req, res, next) => {

    const post = await Post.findById(req.params.id)
                    .populate(
                        {
                            path: 'comments',
                            populate: {
                                path: 'user',
                                select: 'name username profileImage'
                            },
                            options: {
                                sort: { createdAt: -1 }
                            }
                        },
                    )

    if(!post) {   
        return res.status(404).json({
            message: "Post not found!",
            status: 404
        })
    }

    return res.status(200).json({
        message: "Comments found!",
        status: 200,
        data: {
            comments: post.comments
        }
    });

}




module.exports = { 
    createNewComment,
    getCommentByPostId
}