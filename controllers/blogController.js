const asyncHandler = require('express-async-handler');
const Blog = require('../models/blogModel');
const User = require('../models/userModel');


// @desc    Get blog
// @route   GET /api/v1/blogs/all
// @access  Public
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get blog
// @route   GET /api/v1/blogs
// @access  Private
const getBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({user: req.user._id});
    res.status(200).json(blogs);
})

// @desc    Set blog
// @route   POST /api/v1/blogs
// @access  Public
const setBlog = asyncHandler(async (req, res) => {
    if (!req.body.title) {
        res.status(400)
        throw new Error('Please add all fields')
    }
    const blog = await Blog.create({
        title: req.body.title,
        content: req.body.content,
        coverImage: req.body.coverImage,
        tags: req.body.tags,
        user: req.user._id,
        username: req.user.username
    })
    res.status(200).json(blog);
})

// @desc    Update blog
// @route   PUT /api/v1/blogs/:id
// @access  Public
const updateBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        res.status(404);
        throw new Error('Blog not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged-in user matches the blog user
    if (blog.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to update blog');
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedBlog);
})

// @desc    Delete blog
// @route   DELETE /api/v1/blogs/:id
// @access  Private
const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        res.status(404);
        throw new Error('Blog not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged-in user matches the blog user
    if (blog.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to update blog');
    }

    await blog.remove()
    res.status(200).json({id: req.params.id});
})


module.exports = {
    getAllBlogs,
    getBlogs,
    setBlog,
    updateBlog,
    deleteBlog
}