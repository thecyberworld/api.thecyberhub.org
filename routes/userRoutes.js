const express = require('express')
const router = express.Router()
const {registerUser, loginUser, getUser, updateUser, deleteUser} = require('../controllers/userController')
const {protect} = require("../middleware/authMiddleware");

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/user', protect, getUser)
router.put('/user', protect, updateUser)
router.delete('/user', protect, deleteUser)

module.exports = router
