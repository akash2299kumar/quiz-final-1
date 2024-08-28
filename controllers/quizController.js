const UserModel = require('../models/user');
const QuizModel = require('../models/quiz');

// Helper function to format the current date
const getFormattedDate = () => {
    const now = new Date();
    const day = now.getDate();
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
        "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    return `${day} ${month}, ${year}`;
};

const addNewQuiz = async (req, res, next) => {
    try {
        const { quizTitle, typeOfQuiz, quizQuestions } = req.body;

        const foundUser = await UserModel.findById(req.userId);
        if (!foundUser) return res.status(401).json({ message: 'User Not Found' });

        const newQuiz = new QuizModel({
            title: quizTitle,
            quizType: typeOfQuiz,
            createdAt: getFormattedDate(),
            questions: quizQuestions,
            userId: foundUser._id
        });

        const savedQuiz = await newQuiz.save();
        foundUser.quizList.push(savedQuiz._id);
        foundUser.quizCount++;
        foundUser.questionCount += quizQuestions.length;

        await foundUser.save();
        return res.status(200).json({ msg: 'Quiz Created Successfully', quizId: savedQuiz._id });
    } catch (err) {
        next(err);
    }
};

const fetchAllQuizzes = async (req, res, next) => {
    try {
        const foundUser = await UserModel.findById(req.userId);
        if (!foundUser) return res.status(401).json({ message: 'User Not Found' });

        const userQuizzes = await QuizModel.find({ userId: foundUser._id })
            .select('title impressions questions createdAt');

        return res.status(200).json(userQuizzes);
    } catch (err) {
        next(err);
    }
};

const fetchPopularQuizzes = async (req, res, next) => {
    try {
        const foundUser = await UserModel.findById(req.userId);
        if (!foundUser) return res.status(401).json({ message: 'User Not Found' });

        const popularQuizzes = await QuizModel.find({
            userId: foundUser._id,
            impressions: { $gt: 10 }
        });

        return res.status(200).json(popularQuizzes);
    } catch (err) {
        next(err);
    }
};

const fetchQuizDetails = async (req, res, next) => {
    try {
        const { quizId } = req.params;

        const quizDetails = await QuizModel.findById(quizId);
        if (!quizDetails) return res.status(404).json({ message: 'Quiz Not Found' });

        const associatedUser = await UserModel.findById(quizDetails.userId);
        if (!associatedUser) return res.status(401).json({ message: 'User Not Found' });

        quizDetails.impressions++;
        associatedUser.totalImpressions++;

        await quizDetails.save();
        await associatedUser.save();

        return res.status(200).json({ quiz: quizDetails });
    } catch (err) {
        next(err);
    }
};

const removeQuizById = async (req, res, next) => {
    try {
        const { quizId } = req.params;

        const foundUser = await UserModel.findById(req.userId);
        if (!foundUser) return res.status(401).json({ message: 'User Not Found' });

        const quizToDelete = await QuizModel.findById(quizId);
        if (!quizToDelete) return res.status(404).json({ message: 'Quiz Not Found' });

        const { questions, impressions } = quizToDelete;

        await quizToDelete.remove();

        foundUser.quizList = foundUser.quizList.filter(id => id.toString() !== quizId);
        foundUser.quizCount--;
        foundUser.questionCount -= questions.length;
        foundUser.totalImpressions -= impressions;

        await foundUser.save();

        const updatedQuizzes = await QuizModel.find({ userId: foundUser._id })
            .select('title impressions createdAt');

        return res.status(200).json({ msg: 'Quiz Deleted Successfully', quizzes: updatedQuizzes });
    } catch (err) {
        next(err);
    }
};

const fetchQuizAnalytics = async (req, res, next) => {
    try {
        const quizDetails = await QuizModel.findById(req.params.quizId);
        if (!quizDetails) return res.status(404).json({ message: 'Quiz Not Found' });

        const foundUser = await UserModel.findById(req.userId);
        if (!foundUser) return res.status(401).json({ message: 'User Not Found' });

        const analyticsData = quizDetails.questions.map((question) => {
            if (quizDetails.quizType === 'qna') {
                return {
                    attempts: question.attempts,
                    correctCount: question.correctCount,
                    incorrectCount: question.incorrectCount
                };
            } else if (quizDetails.quizType === 'poll') {
                return {
                    attempts: question.attempts,
                    options: question.options.map((option, index) => ({
                        index,
                        text: option.text,
                        imageUrl: option.imageUrl,
                        selectedCount: option.selectedCount,
                    }))
                };
            }
        });

        return res.status(200).json({
            createdAt: quizDetails.createdAt,
            title: quizDetails.title,
            analytics: analyticsData,
            totalImpressions: foundUser.totalImpressions,
            quizType: quizDetails.quizType
        });
    } catch (err) {
        next(err);
    }
};

const submitQuizAttempt = async (req, res, next) => {
    try {
        const { answers } = req.body;

        const quizDetails = await QuizModel.findById(req.params.id);
        if (!quizDetails) return res.status(404).json({ message: 'Quiz Not Found' });

        let correctAnswers = 0;
        let incorrectAnswers = 0;

        quizDetails.questions.forEach((question, index) => {
            if (quizDetails.quizType === 'qna') {
                if (question.correctOption == answers[index]) {
                    correctAnswers++;
                    question.correctCount++;
                } else {
                    incorrectAnswers++;
                    question.incorrectCount++;
                }
            } else if (quizDetails.quizType === 'poll') {
                question.options[answers[index]].selectedCount++;
            }
            question.attempts++;
        });

        await quizDetails.save();
        return res.status(200).json({ score: correctAnswers });
    } catch (err) {
        next(err);
    }
};

const modifyQuiz = async (req, res, next) => {
    try {
        const { quizId } = req.params;

        const foundUser = await UserModel.findById(req.userId);
        if (!foundUser) return res.status(401).json({ message: 'User Not Found' });

        const quizToUpdate = await QuizModel.findByIdAndUpdate(quizId, req.body, { new: true });
        if (!quizToUpdate) return res.status(404).json({ message: 'Quiz Not Found' });

        return res.status(200).json({ message: 'Quiz Updated Successfully', quiz: quizToUpdate });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addNewQuiz,
    fetchAllQuizzes,
    fetchPopularQuizzes,
    fetchQuizDetails,
    removeQuizById,
    fetchQuizAnalytics,
    submitQuizAttempt,
    modifyQuiz
};
