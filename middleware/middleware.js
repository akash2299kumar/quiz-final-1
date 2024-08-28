// const User = require('../models/user')
// const jwt = require('jsonwebtoken')
// const dotenv = require('dotenv')
// dotenv.config()

// const authMiddleware = async (req, res, next) => {
//     const token = req.headers.token
//     if(!token){
//         return res.status(401).json({error: 'Access Denied'})
//     }
//     try{
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         const user = await User.findById(decoded.user_Id)
//         if(!user){
//             return res.status(401).json({error: 'Access Denied'})
//         }
//         req.user_Id = user._id
//         next()
//     }
//     catch(err){
//         return res.status(500).json({msg: 'Access Denied'})
//     }
// }

// module.exports = authMiddleware

const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware function to authenticate the user
const authenticateUser = async (req, res, next) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: 'Authorization Required' });
    }
    try {
        const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
        const foundUser = await UserModel.findById(decodedToken.userId);
        if (!foundUser) {
            return res.status(401).json({ error: 'Unauthorized Access' });
        }
        req.userId = foundUser._id;
        next();
    } catch (err) {
        return res.status(500).json({ msg: 'Unauthorized Access' });
    }
}

module.exports = authenticateUser;
