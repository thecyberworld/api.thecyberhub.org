const asyncHandler = require('express-async-handler');
const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
const Reply = require('../models/replyModel')

// @desc    Get blog
// @route   GET /api/v1/blogs/all
// @access  Public
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({message: error.message});
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


// @desc    Add a comment to a blog
// @route   POST /api/v1/blogs/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
    // Check for user
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'You must be logged in to add a comment'
        });
    }

    // Retrieve the blog
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        return res.status(404).json({
            success: false,
            error: 'Blog not found'
        });
    }

    // Create the comment in the Comment table
    const comment = await Comment.create({
        blogId: blog._id,
        user: req.user._id,
        username: req.user.username,
        comment: req.body.comment
    });

    // Add the comment to the blog's comments array
    blog.comments.push(comment.toObject());
    await blog.save();

    res.status(201).json({
        success: true,
        data: comment
    });

});

// @desc    Add a reply to a comment in a blog
// @route   POST /api/v1/blogs/:id/comments/:commentId/reply
// @access  Private
const addReply = asyncHandler(async (req, res) => {
    // Find the comment that the reply is being added to
    const comment = await Comment.findById(req.params.commentId);

    // Check if the comment exists
    if (!comment) {
        return res.status(404).json({
            success: false,
            message: 'Comment not found'
        });
    }

    // Create the reply
    const reply = {
        blogId: req.params.id,
        commentId: req.params.commentId,
        user: req.user._id,
        username: req.user.username,
        reply: req.body.reply
    };

    // Add the reply to the comment's replies array
    comment.replies.push(reply);
    await comment.save();

    res.status(201).json({
        success: true,
        data: reply
    });
});

module.exports = {
    addComment,
    addReply,
    getAllBlogs,
    getBlogs,
    setBlog,
    updateBlog,
    deleteBlog
}