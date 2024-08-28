// const mongoose = require('mongoose')

// const OptionSchema = new mongoose.Schema({
//     text: { type: String },
//     imageUrl: { type: String },
//     selectedCount: { 
//         type: Number, 
//         default: 0 
//     }
// });

// const QuestionSchema = new mongoose.Schema({
//     questionText: { 
//         type: String, 
//         required: true 
//     },
//     questionType: { 
//         type: String, 
//         enum: ['text', 'image', 'text-image'], 
//         default: 'text' 
//     },
//     options: [OptionSchema],
//     correctOption: { 
//         type: Number,
//         default: null, 
//         required: false 
//     },
//     timer: { 
//         type: Number, 
//         enum: [5, 10, 0],
//         default: 0
//     },
//     attempts: { 
//         type: Number, 
//         default: 0 
//     },
//     correctCount: { 
//         type: Number, 
//         default: 0 
//     },
//     incorrectCount: { 
//         type: Number, 
//         default: 0 
//     },
// })

// const QuizSchema = new mongoose.Schema({
//     title: { 
//         type: String, 
//         required: true 
//     },
//     quizType: {
//         type: String,
//         enum: ['qna','poll']
//     },
//     quizImpressions: { 
//         type: Number, 
//         default: 0 
//     },
//     createdAt: { 
//         type: String,
//     },
//     questions: { 
//       type: [QuestionSchema], 
//       default: [] 
//     },
//     userId: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//         }
//     ],
// })

// module.exports = mongoose.model('Quiz', QuizSchema)

const mongoose = require('mongoose');

// Schema for quiz options
const AnswerOptionSchema = new mongoose.Schema({
    description: { type: String },
    imageLink: { type: String },
    chosenCount: { 
        type: Number, 
        default: 0 
    }
});

// Schema for individual questions
const QuizQuestionSchema = new mongoose.Schema({
    content: { 
        type: String, 
        required: true 
    },
    contentType: { 
        type: String, 
        enum: ['text', 'image', 'text-image'], 
        default: 'text' 
    },
    answerChoices: [AnswerOptionSchema],
    correctChoice: { 
        type: Number,
        default: null, 
        required: false 
    },
    timeLimit: { 
        type: Number, 
        enum: [5, 10, 0],
        default: 0
    },
    totalAttempts: { 
        type: Number, 
        default: 0 
    },
    rightAnswers: { 
        type: Number, 
        default: 0 
    },
    wrongAnswers: { 
        type: Number, 
        default: 0 
    },
});

// Schema for the entire quiz
const QuestionnaireSchema = new mongoose.Schema({
    heading: { 
        type: String, 
        required: true 
    },
    typeOfQuiz: {
        type: String,
        enum: ['qna', 'poll']
    },
    viewCount: { 
        type: Number, 
        default: 0 
    },
    dateCreated: { 
        type: String,
    },
    queries: { 
        type: [QuizQuestionSchema], 
        default: [] 
    },
    creatorId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
});

module.exports = mongoose.model('Questionnaire', QuestionnaireSchema);


