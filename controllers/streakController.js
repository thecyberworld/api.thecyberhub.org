const asyncHandler = require('express-async-handler')

const Streak = require('../models/streakModel')

// @desc    Get streaks
// @route   GET /api/streaks
// @access  Private
const getStreaks = asyncHandler(async (req, res) => {
    const streaks = await Streak.find()
    res?.status(200).json(streaks)
})

// @desc    Set streaks
// @route   POST /api/streaks
// @access  Private
const setStreak = asyncHandler(async (req, res) => {
    if (!req?.body.number) {
        res?.status(400)
        throw new Error('Please add a number field')
    }

    const streak = await Streak.create({
        number: req.body.number
    })
    res?.status(200).json(streak)
})

// @desc    Update streak
// @route   PUT /api/streaks/:id
// @access  Private
const updateStreak = asyncHandler(async (req, res) => {
    const streak = await Streak.findById(req?.params.id)
    if(!streak) {
        res?.status(400)
        throw new Error('Streak not found to update')
    }

    const updatedStreak = await Streak.findByIdAndUpdate(req?.params.id, req?.body, {
        new: true
    })

    res?.status(200).json(updatedStreak)
})

// @desc    Delete streak
// @route   DELETE /api/streaks/:id
// @access  Private
const deleteStreak = asyncHandler(async (req, res) => {
    const streak = await Streak.findById(req?.params.id)
    if(!streak) {
        res?.status(400)
        throw new Error('Streak not found to delete')
    }
    // const deleteStreak = await Streak.findByIdAndDelete(req?.params.id, req?.body)
    await streak.remove()
    res?.status(200).json({id: req?.params.id})
})

module.exports = {
    getStreaks, setStreak, updateStreak, deleteStreak
}
