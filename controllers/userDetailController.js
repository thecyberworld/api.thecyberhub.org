const asyncHandler = require('express-async-handler')

const UserDetail = require('../models/userDetailModel')
const User = require('../models/userModel')

// @desc    Get userDetails
// @route   GET /api/userDetails
// @access  Private
const getUserDetails = asyncHandler(async (req, res) => {
    const userDetails = await UserDetail.find({ user: req?.user?.id })
    res?.status(200).json(userDetails)
})

// @desc    Set userDetail
// @route   POST /api/userDetails
// @access  Private
const setUserDetail = asyncHandler(async (req, res) => {
    if (!req?.body.skillLevel || !req?.body.workRole || !req?.body.cyberLevel || !req?.body.taskCompleted || !req?.body.streak) {
        res?.status(400)
        throw new Error('Please add all field')
    }

    const userDetail = await UserDetail.create({
        user: req.user.id,
        username: req.user.username,

        skillLevel: req.body.skillLevel,
        workRole: req.body.workRole,
        cyberLevel: req.body.cyberLevel,
        taskCompleted: req.body.taskCompleted,
        streak: req.body.streak,
    })

    res.status(200).json(userDetail)
})

// @desc    Update userDetail
// @route   PUT /api/userDetails/:id
// @access  Private
const updateUserDetail = asyncHandler(async (req, res) => {
    const userDetail = await UserDetail.findById(req.params.id)

    if (!userDetail) {
        res.status(400)
        throw new Error('UserDetail not found')
    }

    // Check for user
    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged-in user matches the userDetail user
    if (userDetail.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedUserDetail = await UserDetail.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedUserDetail)
})

// @desc    Delete userDetail
// @route   DELETE /api/userDetails/:id
// @access  Private
// const deleteUserDetail = asyncHandler(async (req, res) => {
//     const userDetail = await UserDetail.findById(req.params.id)
//
//     if (!userDetail) {
//         res.status(400)
//         throw new Error('UserDetail not found')
//     }
//
//     // Check for user
//     if (!req.user) {
//         res.status(401)
//         throw new Error('User not found')
//     }
//
//     // Make sure the logged-in user matches the userDetail user
//     if (userDetail.user.toString() !== req.user.id) {
//         res.status(401)
//         throw new Error('User not authorized')
//     }
//
//     await userDetail.remove()
//
//     res.status(200).json({ id: req.params.id })
// })

module.exports = {
    getUserDetails,
    setUserDetail,
    updateUserDetail,
    // deleteUserDetail,
}
