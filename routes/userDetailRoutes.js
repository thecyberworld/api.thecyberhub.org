const express = require('express')
const router = express.Router()
const {
    getUserDetails,
    setUserDetail,
    updateUserDetail,
} = require('../controllers/userDetailController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getUserDetails).post(protect, setUserDetail)
router.route('/:id').put(protect, updateUserDetail)

module.exports = router
