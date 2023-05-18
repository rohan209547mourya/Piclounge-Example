const {
    createNewComment, getCommentByPostId
} = require('../controller/commentController');
const express = require('express');
const authorize = require('../middleware/authoriztion');
const router = express.Router();


router.post("/:id", authorize("user") ,createNewComment);
router.get("/:id" , getCommentByPostId);


module.exports = router;