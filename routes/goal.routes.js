import express from "express"
const router = express.Router()
import { getGoals, createGoals, updateGoals, deleteGoals } from "../controllers/goal.controller.js"
import { protect } from "../middleware/auth.middleware.js"


router.route('/').get(protect, getGoals).post(protect, createGoals)
router.route('/:id').delete(protect, deleteGoals).put(protect, updateGoals)

// protect digunakan untuk memberi middleware, hanya yg udah ada token di simpen di local storage yg bisa akses
// Sama dengan yg diatas tp yg atas lebih simpel
// router.get('/', getGoals)
// router.post('/', createGoals)
// router.put('/:id', updateGoals)
// router.delete('/:id', deleteGoals)

export default router