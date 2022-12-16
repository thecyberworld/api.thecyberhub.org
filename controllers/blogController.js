const asyncHandler = require('express-async-handler')

const Blog = require('../models/blogModel')
const User = require('../models/userModel')

// @desc    Get blogs
// @route   GET /api/blogs
// @access  Private
const getBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({user: req?.user?.id})
    res?.status(200).json(blogs)
})

// @desc    Set blogs
// @route   POST /api/blogs
// @access  Private
const setBlog = asyncHandler(async (req, res) => {
    if (!req?.body.title || !req?.body.image || !req?.body.content || !req?.body.tags) {
        res?.status(400)
        throw new Error('Please add all field')
    }

    const blog = await Blog.create({
        title: req.body.title,
        image: req.body.image,
        content: req.body.content,
        tags: req.body.tags,
        username: req.user.username,
        user: req.user.id,
    })
    res?.status(200).json(blog)
})

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req?.params.id)
    if (!blog) {
        res?.status(400)
        throw new Error('Blog not found to update')
    }

    const user = await User.findById(req?.user?.id)

    // Check for user
    if (!user) {
        res?.status(401)
        throw new Error('User not found')
    }

    // Make use the logged-in user matches the blog user
    if (blog.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorize')
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req?.params.id, req?.body, {
        new: true
    })

    res?.status(200).json(updatedBlog)
})

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req?.params.id)
    if (!blog) {
        res?.status(400)
        throw new Error('Blog not found to delete')
    }

    const user = await User.findById(req?.user?.id)

    // Check for user
    if (!user) {
        res?.status(401)
        throw new Error('User not found')
    }

    // Make use the logged-in user matches the blog user
    if (blog.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorize')
    }

    // const deleteBlog = await Blog.findByIdAndDelete(req?.params.id, req?.body)
    await blog.remove()
    res?.status(200).json({id: req?.params.id})
})

module.exports = {
    getBlogs, setBlog, updateBlog, deleteBlog
}
