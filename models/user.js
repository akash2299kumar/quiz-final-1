const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true    
    },
    password: {
        type: String,
        required: true
    },
    totalQuizzes: { 
        type: Number, 
        default: 0 
    },
    totalQuestions: { 
        type: Number, 
        default: 0 
    },
    totalImpressions: { 
        type: Number, 
        default: 0 
    },
    quizId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        }
    ],
    questionId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }
    ],
})

module.exports = mongoose.model('User', UserSchema)


