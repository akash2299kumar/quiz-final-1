const express = require('express')
const router = express.Router()
const quizController = require('../controllers/quizController')
const authMiddleware = require('../middleware/middleware')

router.post('/create', authMiddleware, quizController.addNewQuiz)
router.get('/all', authMiddleware, quizController.fetchAllUserQuizzes)
router.get('/each/:quizId', quizController.fetchQuizById)
router.delete('/delete/:quizId', authMiddleware, quizController.removeQuizById)
router.get('/getanalytics/:quizId', authMiddleware, quizController.fetchQuizAnalytics)
router.put('/edit/:quizId', authMiddleware, quizController.modifyQuiz)
router.post('/:id/attempt', quizController.submitQuizAttempt)
router.get('/all/trending', authMiddleware, quizController.fetchTrendingQuizzes)

module.exports = router


