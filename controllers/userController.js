const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, username, email, password,picture} = req?.body
    if (!name || !username || !email || !password) {
        res.status(400)
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
        throw new Error('Email is already in use Exists')
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
    })

    if (user) {
        res?.status(201).json({
            _id: user?.id,
            name: user?.name,
            username: user?.username,
            email: user?.email,
            picture: "",
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


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getUser
}
