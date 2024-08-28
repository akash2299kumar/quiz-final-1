const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

// Function to register a new user
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ msg: "Passwords do not match" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        return res.status(201).json({ newUser });
    } catch (err) {
        return next(err);
    }
};

// Function to log in a user
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ msg: 'Incorrect email or password' });
        }
        const user_Id = user._id;
        const token = jwt.sign({ user_Id: user._id }, process.env.JWT_SECRET);
        return res.status(200).json({ msg: 'Logged in successfully', token, user_Id });
    } catch (err) {
        return next(err);
    }
};

// Function to retrieve user details by ID
const getUserDetailsById = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const { totalQuizzes, totalQuestions, totalImpressions } = user;
        return res.status(200).json({ msg: 'User found', quizzes: totalQuizzes, questions: totalQuestions, impressions: totalImpressions });
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserDetailsById
};

