import express from "express"
import color  from "colors" //optional sih, fungsinya biar console.log jadi berwarna
import dotenv from "dotenv"
dotenv.config()
import { errorHandler } from "./middleware/error.middleware.js"
import { connectDB } from "./config/db.config.js"
const port = process.env.PORT || 5000

connectDB()

import goalRoutes from "./routes/goal.routes.js"
import userRoutes from "./routes/user.routes.js"

const app = express()

app.use(express.json())                             // supaya bisa menerima input body
app.use(express.urlencoded({ extended: false }))    // supaya bisa menerima input body versi url encoded bukan hanya raw json

app.use('/api/goals', goalRoutes)
app.use('/api/users', userRoutes)

app.use(errorHandler)

app.listen(port, () => { console.log(`Server started on port ${port}`) })