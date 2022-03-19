import asyncHandler from "express-async-handler" 
// pengen pakai async await tp gamau pakai try catch, katanya mongodb hasilnya aync await
import Goal from "../models/goal.model.js"
import User from "../models/user.model.js"

// @desc    Get goals
// @route   GET /api/goals
// @access  Private
export const getGoals = asyncHandler(async (req, res) => {
    // const goals = await Goal.find()
    // untuk mengambil data semua dari colection goal, pakai await karena synchourous yg artinya harus ditunggu dulu sampai proses ambil datanya selesai
    const goals = await Goal.find({ user: req.user.id })
    // find semua di collection goal dimana user id-nya sama dengan yg di req.user dari protect middleware
    res.status(200).json(goals)
})

// @desc    Create goals
// @route   POST /api/goals
// @access  Private
export const createGoals = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        // res.status(400).json({ message: 'Please insert data' })
        res.status(400)
        throw new Error('Please add a text field')
    }
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id,
    })

    res.status(200).json(goal)
})

// @desc    Update goals
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoals = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await User.findById(req.user.id)

    // Check apakah user exist
    if (!user) {
        req.status(401)
        throw new Error('User not found in database')
    }

    // jika user ada di db, cek apakah user berhak mengupdate goal
    if (goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized to update goal')
    }

    // jika dua if diatas bisa dilewati baru kita update
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true,
        }
    )
    //pakai await krena harus ditunggu kelar, cari id dan update, pertama id-nya, terus body atau isinya, yg ketiga new true artinya jika data id tidak ditemukan buat data sngan id tersebut

    res.status(200).json(updatedGoal)
})

// @desc    Delete goals
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoals = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)
    if (!goal) {
        res.status(400)
        throw new Error('Goal not found') //kalau mau ini harus pakai middleware
        // res.status(400).json({ message: 'Goal not found' }) //kalau mau simple
    }

    const user = await User.findById(req.user.id)

    // Check apakah user exist
    if (!user) {
        req.status(401)
        throw new Error('User not found in database')
    }

    // jika user ada di db, cek apakah user berhak mengupdate goal
    if (goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized to update goal')
    }

    // await Goal.remove() //tapi kayaknya seharusnya ini
    await goal.remove() //kalau di video ini
    res.status(200).json({ id: req.params.id })
})