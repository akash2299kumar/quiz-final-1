const mongoose = require('mongoose')

const OptionSchema = new mongoose.Schema({
    text: { type: String },
    imageUrl: { type: String },
    selectedCount: { 
        type: Number, 
        default: 0 
    }
});

const QuestionSchema = new mongoose.Schema({
    questionText: { 
        type: String, 
        required: true 
    },
    questionType: { 
        type: String, 
        enum: ['text', 'image', 'text-image'], 
        default: 'text' 
    },
    options: [OptionSchema],
    correctOption: { 
        type: Number,
        default: null, 
        required: false 
    },
    timer: { 
        type: Number, 
        enum: [5, 10, 0],
        default: 0
    },
    attempts: { 
        type: Number, 
        default: 0 
    },
    correctCount: { 
        type: Number, 
        default: 0 
    },
    incorrectCount: { 
        type: Number, 
        default: 0 
    },
})

const QuizSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    quizType: {
        type: String,
        enum: ['qna','poll']
    },
    quizImpressions: { 
        type: Number, 
        default: 0 
    },
    createdAt: { 
        type: String,
    },
    questions: { 
      type: [QuestionSchema], 
      default: [] 
    },
    userId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
})

module.exports = mongoose.model('Quiz', QuizSchema)
