import mongoose from "mongoose"

const goalSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, //berisi id dari user yang buat data
        required: true,
        ref: 'User', //mereferensikan model yang dituju, disini mengarah ke model User
    },
    text: {
        type: String,
        required: [true, 'Please add some text'],
    },
}, {
    timestamps: true,
})

export default mongoose.model('Goal', goalSchema)