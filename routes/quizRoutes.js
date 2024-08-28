// const express = require('express')
// const router = express.Router()
// const quizController = require('../controllers/quizController')
// const authMiddleware = require('../middleware/authMiddleware')

// router.post('/create', authMiddleware, quizController.createQuiz)
// router.get('/all', authMiddleware, quizController.getAllQuizzes)
// router.get('/each/:quizId', quizController.getQuizById)
// router.delete('/delete/:quizId', authMiddleware, quizController.deleteQuizById)
// router.get('/getanalytics/:quizId', authMiddleware, quizController.getQuizAnalytics)
// router.put('/edit/:quizId', authMiddleware, quizController.updateQuiz)
// router.post('/:id/attempt', quizController.attemptQuiz)
// router.get('/all/trending', authMiddleware, quizController.getTrendingQuizzes)

// module.exports = router


const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/middleware');

// Route to create a new quiz
router.post('/create', authMiddleware, quizController.addNewQuiz);

// Route to get all quizzes of the authenticated user
router.get('/all', authMiddleware, quizController.fetchAllQuizzes);

// Route to get a specific quiz by its ID
router.get('/each/:quizId', quizController.fetchQuizDetails);

// Route to delete a specific quiz by its ID
router.delete('/delete/:quizId', authMiddleware, quizController.removeQuizById);

// Route to get analytics of a specific quiz by its ID
router.get('/getanalytics/:quizId', authMiddleware, quizController.fetchQuizAnalytics);

// Route to update a specific quiz by its ID
router.put('/edit/:quizId', authMiddleware, quizController.modifyQuiz);

// Route to attempt a quiz by its ID
router.post('/:id/attempt', quizController.submitQuizAttempt);

// Route to get trending quizzes of the authenticated user
router.get('/all/trending', authMiddleware, quizController.fetchPopularQuizzes);

module.exports = router;
