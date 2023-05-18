const {
    User, validateUser
} = require('../models/User');
const bcrypt = require('bcrypt');


// get logged in user
const getLoggedInUser = async (req, res, next) => {
    
    try {
        
        const user = await User.findOne({email: req.user.email});

        if(!user) return res.status(404).json({
            message: "User not found",
            status: 404
        })

        return res.status(200).json({
            message: "User found",
            status: 200,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    dateOfBirth: user.dateOfBirth,
                    profileImage: user.profileImage,
                    followers: user.followers,
                    following: user.following,
                    posts: user.posts,
                    likedPosts: user.likedPosts,
                }
            }
        })

    } catch (err) {
        
    }
}

// get user by id
const getUserById = async (req, res, next) => {


    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({
            message: "User not found",
            status: 404
        })

        return res.status(200).json({
            message: "User found",
            status: 200,
            data: {
                user: {
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    dateOfBirth: user.dateOfBirth,
                    profileImage: user.profileImage,
                    followers: user.followers,
                    following: user.following,
                    posts: user.posts,
                }
            }
        })

    } catch (err) {
        return res.status(404).json({
            message: err.message,
            status: 404
        })
    }
}

// change user profile image
const changeUserProfileImage = async (req, res, next) => {

    User.findByIdAndUpdate(req.user._id, {
        profileImage: req.body.profileImage
    }, {new: true}).then((user) => {
        return res.status(200).json({
            message: "User profile image updated successfully",
            status: 200,
            data: {
                user: {
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    dateOfBirth: user.dateOfBirth,
                    profileImage: user.profileImage,
                    followers: user.followers,
                    following: user.following,
                    posts: user.posts,
                }
            }
        })
    }
    ).catch((err) => {
        return res.status(400).json({
            message: err.message,
            status: 400
        })
    }
    )
}

// update user username
const updateUserUsername = async (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, {
        username: req.body.username
    }, {new: true}).then((user) => {

        return res.status(200).json({
            message: "User username updated successfully",
            status: 200,
            data: {
                user: {
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    dateOfBirth: user.dateOfBirth,
                    profileImage: user.profileImage,
                    followers: user.followers,
                    following: user.following,
                    posts: user.posts,
                }
            }
        })
    }

    ).catch((err) => {
        return res.status(400).json({
            message: err.message,
            status: 400
        })
    })
}

// update user password 
const updateUserPassword = async (req, res, next) => {

    const user = await User.findById(req.user._id);

    if(!user) return res.status(404).json({
        message: "User not found",
        status: 404
    })

    console.log(req.body.currentPassword, user.password);
    const isPasswordValid = await bcrypt.compare(req.body.currentPassword, user.password);

    if(!isPasswordValid) {
        return res.status(400).json({
            message: "Current password is incorrect",
            status: 400
        })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    if(user.password === hashedPassword) return res.status(400).json({
        message: "New password can't be same as current password",
        status: 400
    })


    user.password = hashedPassword;

    user.save().then((user) => {
        return res.status(200).json({
            message: "User password updated successfully",
            status: 200,
            data: {
                user: {
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    dateOfBirth: user.dateOfBirth,
                    profileImage: user.profileImage,
                    followers: user.followers,
                    following: user.following,
                    posts: user.posts,
                }
            }
        })
    }
    ).catch((err) => {
        return res.status(400).json({
            message: err.message,
            status: 400,
            data: null
        })
    })
}

// search users
const searchUsers = async (req, res, next) => {

    const users = await User.find({
        $or: [
            {name: { $regex: req.params.searchTerm, $options: 'i' }},
            {username: {$regex: req.params.searchTerm, $options: 'i'}}
        ]
    })
    .select('_id name username profileImage followers')
    .limit(10)


    if(!users && users.length === 0) {
        return res.status(404).json({
            message: "No users found",
            status: 404
        })
    } 

    return res.status(200).json({
        message: "Users found",
        status: 200,
        data: {
            users: users
        }
    })

}

const followUser = async (req, res, next) => {

    const currentUser = await User.findById(req.user._id);

    const userToFollow = await User.findById(req.params.id);

    if(!userToFollow) return res.status(404).json({
        message: "User not found",
        status: 404
    })

    const isUserAlreadyFollowed = userToFollow.followers.includes(currentUser._id);

    if(isUserAlreadyFollowed) return res.status(400).json({
        message: "User already followed",
        status: 400
    })

    userToFollow.followers.push(currentUser._id);
    await userToFollow.save();

    currentUser.following.push(userToFollow._id);
    await currentUser.save();

    return res.status(200).json({
        message: "User followed successfully",
        status: 200,
        data: {
            user: {
                name: userToFollow.name,
                email: userToFollow.email,
                username: userToFollow.username,
                dateOfBirth: userToFollow.dateOfBirth,
                profileImage: userToFollow.profileImage,
                followers: userToFollow.followers,
                following: userToFollow.following,
                posts: userToFollow.posts,
            }
        }
    })

}


const unfollowUser = async (req, res, next) => {
    
    const currentUser = await User.findById(req.user._id);

    const userToUnfollow = await User.findById(req.params.id);

    if(!userToUnfollow) return res.status(404).json({
        message: "User not found",
        status: 404
    })

    const isUserAlreadyFollowed = userToUnfollow.followers.includes(currentUser._id);

    if(!isUserAlreadyFollowed) return res.status(400).json({
        message: "User not followed",
        status: 400
    })

    userToUnfollow.followers.pull(currentUser._id);
    await userToUnfollow.save();

    currentUser.following.pull(userToUnfollow._id);
    await currentUser.save();

    return res.status(200).json({
        message: "User unfollowed successfully",
        status: 200,
        data: {
            user: {
                name: userToUnfollow.name,
                email: userToUnfollow.email,
                username: userToUnfollow.username,
                dateOfBirth: userToUnfollow.dateOfBirth,
                profileImage: userToUnfollow.profileImage,
                followers: userToUnfollow.followers,
                following: userToUnfollow.following,
                posts: userToUnfollow.posts,
            }
        }
    })
    
}

module.exports = {
    getLoggedInUser,
    getUserById,
    changeUserProfileImage,
    updateUserUsername,
    updateUserPassword,
    searchUsers,
    followUser,
    unfollowUser
}
