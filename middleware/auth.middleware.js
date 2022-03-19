import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js"

export const protect = asyncHandler(async (req, res, next) => {
    let token //mendeklarasi variabel bernama token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //Get token dari header
            token = req.headers.authorization.split(' ')[1]
            // Header bentuknya "Bearer <token>, jadi cara untuk dapat tokennya, yaitu dengan split string tersebut dg spasi, jadinya array [0] Bearer dan [1] <token>-nya makanya diatas [1]"

            //Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // var pertama token yg didapat dr header, var kedua adalah secret di env

            //Get user dari token yg udah di decoded
            req.user = await User.findById(decoded.id).select('-password')
            //mencari data user dari id di token yg telah di decoded, select -password supaya hasil dr findbyid cuman nama dan email tanpa menyertakan password di dalam token jwt yang diteruskan ke frontend

            next() //melanjutkan program jika dinyatakan benar
        } catch (error) {
            console.log(error)
            res.status(401) //401 artinya un authorization tidak diizinkan akses
            throw new Error('Not authorized, wrong token inserted')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token inserted')
    }
})