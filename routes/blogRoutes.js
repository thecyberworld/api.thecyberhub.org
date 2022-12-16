const express = require('express')
const router = express.Router()
const {
    getBlogs, setBlog, updateBlog, deleteBlog
} = require('../controllers/BlogController')
const {protect} = require("../middleware/authMiddleware");

router.route('/').get(protect, getBlogs).post(protect, setBlog)
router.route('/:id').put(protect, updateBlog).delete(protect, deleteBlog)

module.exports = router
