const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/middleware')

router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.get('/get/:userId', authMiddleware, userController.getUserDetailsById)

module.exports = router
