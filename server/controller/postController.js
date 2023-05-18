const { Post, validatePost } = require('../models/Post')
const { User } = require('../models/User')


// get all posts
const getAllPosts = async (req, res, next) => {
    let currentUser = req.user;

    currentUser = await User.findById(currentUser._id);

    const following = Array.isArray(currentUser.following) ? currentUser.following : [];

    const total = await Post.countDocuments({
        $or: [
            { user: currentUser._id },
            { user: { $in: following } },
            { user: { $nin: [...following, currentUser._id] } },
        ]
    });

    const posts = await Post.find({
            $or: [
                { user: currentUser._id },
                { user: { $in: following } },
                { user: { $nin: [...following, currentUser._id] } },
            ]
        })
        .populate('user', 'username name followers profileImage')
        .sort({ createdAt: -1 })

    const postsWithFollowStatus = posts.map(post => {
        let isFollowed = currentUser.following?.includes(post.user._id);
        if (isFollowed === undefined) isFollowed = false;
        return { ...post.toObject(), isFollowed };
    });


    return res.status(200).json({
        success: true,
        data: postsWithFollowStatus,
    });
}



// create new post
const createNewPost = async (req, res, next) => {
    const currentUser = req.user;
    const requestBody = req.body;

    const { error } = validatePost(requestBody);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            status: 400
        })
    }

    const user = await User.findById(currentUser._id);

    if (!user) {
        return res.status(400).json({
            message: "User not found",
            status: 400
        });
    }

    const post = new Post({
        user: user,
        caption: requestBody.caption,
        image: requestBody.image,
    });

    await post.save();

    user.posts.push(post);
    await user.save();


    return res.status(201).json({
        message: "Post created successfully",
        status: 201,
    })
}

// like a post
const likePost = async (req, res, next) => {
    const currentUser = req.user;

    console.log(currentUser, req.params.id);

    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({
            message: "Post not found",
            status: 404
        })
    }

    const user = await User.findById(currentUser._id);
    if(!user) {
        return res.status(404).json({
            message: "User not found",
            status: 404
        })
    }

    const isLiked = post.likes.includes(user._id);

    if(isLiked) {
        post.likes.pull(user);
        user.likedPosts.pull(post);

        
        await post.save();
        await user.save();

        return res.status(200).json({
            message: "Post liked removed successfully",
            status:200,
            data: {
                post
            }
        })
    }
    else {
        post.likes.push(user);
        user.likedPosts.push(post);
    }

    await post.save();
    await user.save();

    return res.status(200).json({
        message: "Post liked successfully",
        status:200,
        data: {
            post
        }
    })
}


// get all post by user id
const getAllPostsByUserId = async (req, res, next) => {
    try {
        
    
        const userId = req.params.id;

        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({
                message: "User not found",
                status: 404
            })
        }

        const posts = await Post.find({ user: userId }).populate('user', 'username name followers profileImage').sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Posts fetched successfully",
            status: 200,
            data: {
                posts
            }
        })
    } catch (error) {
            
    }
}

// get post by post id
const getPostByPostId = async (req, res, next) => {
    try {
        
    
        const postId = req.params.postId;

        const post = await Post.findById(postId).populate('user', 'username name followers profileImage');

        if(!post) {
            return res.status(404).json({
                message: "Post not found",
                status: 404
            })
        }

        return res.status(200).json({
            message: "Post fetched successfully",
            status: 200,
            data: {
                post
            }
        })
    } catch (error) {
            
    }

}


module.exports = {
    likePost,
    getAllPosts,
    createNewPost,
    getAllPostsByUserId,
    getPostByPostId
}