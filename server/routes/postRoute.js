const express = require('express');
const router = express.Router();

const {
    createNewPost,
    getAllPosts,
    likePost,
    getAllPostsByUserId,
    getPostByPostId
} = require('../controller/postController')

const authorize = require('../middleware/authoriztion')


router.post('/create', authorize("user"), createNewPost);
router.get('/all', authorize("user"), getAllPosts);
router.put('/like/:id', authorize("user"), likePost);
router.get('/:id', authorize("user"), getAllPostsByUserId);
router.get('/:postId/1', getPostByPostId)

module.exports = router;
