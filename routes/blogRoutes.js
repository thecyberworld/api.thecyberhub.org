const express = require('express');
const router = express.Router();
const {
    getAllBlogs, getBlogs, setBlog, updateBlog, deleteBlog
} = require('../controllers/blogController');

const {protect} = require('../middleware/authMiddleware');

router.route('/all').get(getAllBlogs)
router.route('/').get(protect, getBlogs).post(protect, setBlog);
router.route('/:id').delete(protect, deleteBlog).put(protect, updateBlog);

module.exports = router;
