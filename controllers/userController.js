const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, username, email, password, picture, userType} = req?.body
    if (!name || !username || !email || !password) {
        res?.status(400)
        throw new Error('Please add all fields')
    }
    // Check if user exists
    const usernameExists = await User.findOne({username})
    const emailExists = await User.findOne({email})

    if (usernameExists) {
        res?.status(400)
        throw new Error('Username is already in use')
    }
    if (emailExists) {
        res?.status(400)
        throw new Error('Email is already Exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        picture,
        userType: "user",
    })

    if (user) {
        res?.status(201).json({
            _id: user?.id,
            name: user?.name,
            username: user?.username,
            email: user?.email,
            picture: user?.picture,
            userType: user?.userType,
            token: generateToken(user?._id)
        })
    } else {
        res?.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const {username, password} = req?.body

    // Check for username
    const user = await User.findOne({username})
    if (user && (await bcrypt.compare(password, user?.password))) {
        res?.json({
            _id: user?.id,
            name: user?.name,
            username: user?.username,
            email: user?.email,
            picture: user?.picture,
            userType: user?.userType,
            token: generateToken(user?._id)
        })
    } else {
        res?.status(400)
        throw new Error('Invalid credentials data')
    }
})

// @desc    Get user data
// @route   GET /api/users/user
// @access  Private
const getUser = asyncHandler(async (req, res) => {
    res?.status(200).json(req?.user)

    // const {_id, name, username, email, password,
    //     // level, role, cyberLevel, taskCompleted, streak
    // } = await User.findById(req?.user?.id)
    //
    // res?.status(200).json({
    //     id: _id,
    //     name,
    //     username,
    //     email,
    //     // level,
    //     // role,
    //     // cyberLevel,
    //     // taskCompleted,
    //     // streak
    // })
})

// Update
// @desc    Update a user
// @route   PUT /api/users/user
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const { name, username, email, password, picture } = req.body;

    if (!Object.keys(req.body).length) {
        res.status(400);
        throw new Error("Please provide at least one field");
    }

    // Check if the provided username or email is already in use
    const usernameExists = await User.findOne({ username });
    if (usernameExists && usernameExists._id !== req.user.id) {
        res.status(400);
        throw new Error("Username is already in use");
    }

    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id !== req.user.id) {
        res.status(400);
        throw new Error("Email is already in use");
    }

    // Hash the password
    let hashedPassword;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
    }

    // Build update object
    const updateFields = { name, username, email, picture };
    if (hashedPassword) updateFields.password = hashedPassword;

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updateFields,
        { new: true }
    );

    if (updatedUser) {
        res.json({
            _id: updatedUser.id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            // picture: updatedUser.picture,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(400);
        throw new Error("Unable to update user");
    }
});

// @desc    Delete a user
// @route   DELETE /api/users/user
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.user.id);

    if (deletedUser) {
        res.json({
            message: "User deleted successfully",
        });
    } else {
        res.status(400);
        throw new Error("Unable to delete user");
    }
});


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser
}
