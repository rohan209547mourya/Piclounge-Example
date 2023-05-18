const express = require('express');
const router = express.Router();
const {
    getLoggedInUser,
    getUserById,
    changeUserProfileImage,
    updateUserUsername,
    updateUserPassword,
    searchUsers,
    followUser,
    unfollowUser
} = require('../controller/userController');
const authorize = require('../middleware/authoriztion')


router.get('/me', authorize("user") , getLoggedInUser);
router.get('/:id', getUserById);
router.put('/update/profile', authorize("user"), changeUserProfileImage);
router.put('/update/username', authorize("user"), updateUserUsername);
router.put('/update/password', authorize("user"), updateUserPassword);
router.get('/search/:searchTerm', authorize("user"), searchUsers);
router.put('/follow/:id', authorize("user"), followUser);
router.put('/unfollow/:id', authorize("user"), unfollowUser);



module.exports = router;