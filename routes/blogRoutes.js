const express = require('express');
const router = express.Router();
const {
    addComment, addReply,
    getAllBlogs, getBlogs, setBlog, updateBlog, deleteBlog
} = require('../controllers/blogController');

const {protect} = require('../middleware/authMiddleware');

router.route('/:id/comment').post(protect, addComment);
router.route('/:id/comments/:commentId/reply').post(protect, addReply);
router.route('/all').get(getAllBlogs)
router.route('/').get(protect, getBlogs).post(protect, setBlog);
router.route('/:id').delete(protect, deleteBlog).put(protect, updateBlog);

module.exports = router;
