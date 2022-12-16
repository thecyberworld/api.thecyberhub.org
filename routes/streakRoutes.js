const express = require('express')
const router = express.Router()
const {
    getStreaks, setStreak, updateStreak, deleteStreak
} = require('../controllers/streakController')

router.route('/').get(getStreaks).post(setStreak)
router.route('/:id').put(updateStreak).delete(deleteStreak)

module.exports = router
