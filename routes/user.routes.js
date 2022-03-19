import express from "express"
const router = express.Router()
import { registerUser, loginUser, getMe } from "../controllers/user.controller.js"
import { protect } from "../middleware/auth.middleware.js"


router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)

export default router