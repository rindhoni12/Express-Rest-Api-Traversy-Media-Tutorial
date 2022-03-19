import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import asyncHandler from "express-async-handler"
import User from "../models/user.model.js"

// @desc    Register new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    // cek kelengkapan inputan
    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    //cek apakah user exists
    const userExists = await User.findOne({ email }) //await karena menggunakan perintah monggoose

    if (userExists) {
        res.status(400)
        throw new Error('User already exist bro!')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10) //untuk beri salt, 10 adalah nilai default gatau kenapa
    const hashedPassword = await bcrypt.hash(password, salt) //proses hash password, var pertama password dr body, var kedua salt atau tambahan dari salt genSalt

    //create USer
    const user = await User.create({
        name, //dari form body
        email, //dari form body
        password: hashedPassword //dari form body tapi nilainya diganti sama nilai hashed password
    })

    if (user) {
        res.status(201).json({ //201 artinya status OK dan juga sesuatu created
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Check user email 
    const user = await User.findOne({ email })

    // bcrypt.compare var pertama adalah password dari form body, var user.password adalah pass dr const user diatas yg sudah diambil
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid email or password')
    }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private (JWT required)
export const getMe = asyncHandler(async (req, res) => {
    const { _id, name, email } = await User.findById(req.user.id) 
    //kenapa ada req.user karena param tersebut didapat dari middleware protect, nilai req.user bisa diakses di semua function yg routenya ada middleware protect

    res.status(200).json({
        id: _id, // id adalah var yg dikasih ke FE, _id adalah var yg didapat dari DB Mongo
        name,
        email,
    })
})

//Generate JWT
const generateToken = (id) => {
    //var pertama adalah data yang mau disertakan di JWT bisa cuman id ataupun bisa juga role dll, var kedua secret jwt, var ketiga waktu token berlaku sampai kapannya disitu 30d artinya 30 days
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}