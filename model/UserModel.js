import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    block: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true })

const UserModel = mongoose.model('users', UserSchema)
export default UserModel