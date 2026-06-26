const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

//Register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "User already exist." });
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt)
        //jwt token authentication
        //otp sending verified email
        //welcome mail
        const user = await User.create({ name, email, password: hashedpassword });
        console.log("User saved:", user);
        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const message = `
                Welcome to our site shopnest ,${name} !
                Thankyou for registration with us . We are excited to go forward with you.
                Your OTP for shopnest registration is : ${otp}            
            `;

            await sendEmail(email, 'Welcome to Shopnest - Your OTP for Registration', message);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                message: "User registered successfully.Please Check your Email for OTP ."
            });
        } else {
            res.status(400).json({ message: "Invalid User data." });
        }


    } catch (error) {
        res.status(500).json({ message: "Server Error." });
    }
};

//Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                token: generateToken(user._id)
            })
        } else {
            res.status(400).json({ message: "Invalid Email or password" })
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

//get User
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUsers
}