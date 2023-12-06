import mongoose from "mongoose"

const OtpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    otp: {
        type: String,
        required: true,
    }
}, { timestamps: true });


const OtpModel = mongoose.model("otp",OtpSchema)
export default OtpModel
