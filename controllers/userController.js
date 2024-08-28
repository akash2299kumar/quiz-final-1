const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

// Function to handle user registration
const registerUser = async (req, res, next) => {
    try {
        const { fullName, userEmail, userPassword, confirmPassword } = req.body;

        if (userPassword !== confirmPassword) {
            return res.status(400).json({ msg: "Passwords do not match" });
        }

        const existingUser = await UserModel.findOne({ email: userEmail });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);

        const newUser = new UserModel({
            name: fullName,
            email: userEmail,
            password: hashedPassword
        });

        await newUser.save();
        return res.status(201).json({ newUser });
    } catch (err) {
        return next(err);
    }
};

// Function to handle user login
const loginUser = async (req, res, next) => {
    const { userEmail, userPassword } = req.body;
    try {
        const foundUser = await UserModel.findOne({ email: userEmail });
        if (!foundUser || !(await bcrypt.compare(userPassword, foundUser.password))) {
            return res.status(401).json({ msg: 'Incorrect email or password' });
        }

        const userId = foundUser._id;
        const authToken = jwt.sign({ userId: foundUser._id }, process.env.JWT_SECRET);

        return res.status(200).json({ msg: 'User logged in successfully', token: authToken, userId });
    } catch (err) {
        return next(err);
    }
};

// Function to get user details by ID
const fetchUserById = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const totalQuizzes = foundUser.totalQuizzes;
        const totalQuestions = foundUser.totalQuestions;
        const totalImpressions = foundUser.totalImpressions;

        return res.status(200).json({ msg: 'User found', totalQuizzes, totalQuestions, totalImpressions });
    } catch (err) {
        return next(err);
    }
};

module.exports = { registerUser, loginUser, fetchUserById };
