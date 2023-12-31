import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'

dotenv.config();

import NodeMailer from '../utills/NodeMailer.js';
import UserModel from '../model/UserModel.js'
import OtpModel from '../model/Otp.js';
import EventModal from '../model/EventModel.js'

import { OtpGenerator } from '../utills/OtpGenerator.js';

export default {
    UserRegister: async (req, res) => {
        try {
            const { username, email, password, cPassword } = req.body
            if (username.length !== 0 && email.length !== 0 && password.length > 4 && password === cPassword) {
                const userExist = await UserModel.findOne({ email });
                if (userExist) {
                    if (userExist.verified === false) {
                        const otpPin = OtpGenerator()
                        await OtpModel.deleteOne({ userId: userExist._id });
                        const otpCreation = await OtpModel.create({
                            userId: userExist._id,
                            otp: otpPin,
                        })
                        await NodeMailer(userExist.email, "verify Email", otpCreation.otp);
                        return res.status(201).json({
                            userId: userExist._id,
                            created: true,
                            message: "You have already an account,An otp sent to your mail, please verify",
                            success: true
                        });

                    } else {
                        return res.status(400).json({ message: "User already exists", success: false });
                    }
                } else {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    const newUser = await UserModel.create({ username, email, password: hashedPassword })
                    const otpPin = OtpGenerator()
                    const otpCreation = await OtpModel.create({
                        userId: newUser._id,
                        otp: otpPin,
                    })
                    await NodeMailer(newUser.email, "verify Email", otpCreation.otp);
                    return res.status(201).json({
                        userId: newUser._id,
                        created: true,
                        message: "An otp sent to your mail, please verify",
                        success: true
                    });
                }

            } else {
                return res.json({ message: "Given data is not accurate", success: false });

            }
        } catch (error) {
            return res.json({ error, message: error.email, success: false });
        }
    },
    VerifyOtp: async (req, res) => {
        try {
            const { otp, userId } = req.body
            const verify = await OtpModel.findOne({ otp: otp, userId: userId })
            if (verify) {
                await UserModel.updateOne({ _id: userId }, { $set: { verified: true } })
                    .then(async () => {
                        await OtpModel.deleteOne({ userId: userId })
                            .then(() => console.log('deleted'))
                    })
                    .then(() => {
                        return res.status(200).json({
                            message: "Verified Successfully",
                            success: true
                        })
                    })
                    .catch((err) => {
                        return res.status(400).json({ message: err })
                    })
            } else {
                return res.status(400).json({ message: "OTP Does not Match" })
            }
        } catch (error) {
            return res.status(500).json({
                message: error,
                success: false
            })
        }
    },
    UserLogin: async (req, res) => {
        try {
            const { password, email } = req.body;
            const userExist = await UserModel.findOne({ email });
            if (!userExist) {
                return res.status(400).json({ message: "User does not exist", success: false });
            } else {
                if (userExist.verified !== true) {
                    return res.status(400).json({ message: "Please verify your account ", success: false });
                } else if (userExist.block === true) {
                    return res.status(400).json({ message: "You are blocked", success: false });
                } else {
                    const isPasswordValid = await bcrypt.compare(password, userExist.password);
                    if (!isPasswordValid) {
                        return res.status(400).json({ message: "Incorrect password", success: false });
                    } else {
                        let token = jwt.sign({ userId: userExist._id }, process.env.JwtSecretKey, { expiresIn: '1day' })
                        return res.status(200).json({ token: token, userExist: userExist, message: "Login successful", success: true });
                    }
                }
            }
        } catch (error) {
            return res.json({ message: "Internal server error", success: false });
        }
    },
    IsUserAuth: async (req, res) => {
        try {
            const token = req.headers["authorization"]?.split(" ")[1];
            if (!token) {
                return res.status(401).json({
                    message: "User Authentication failed",
                    success: false,
                });
            }
            const secretKey = process.env.JwtSecretKey;
            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        message: "User Authentication failed",
                        success: false,
                    });
                } else {
                    UserModel.findById({ _id: decoded.userId }).then((response) => {
                        if (response.block) {
                            return res.status(401).json({
                                message: " Blocked",
                                success: false,
                            });
                        } else {
                            return res.status(200).json({
                                message: "User Authentication success",
                                success: true,
                            });
                        }
                    })

                }
            });
        } catch (error) {
            return res.status(401).json({
                message: "User Authentication failed",
                success: false,
            });
        }

    },
    UserGet: async (req, res) => {
        try {
            const token = req.headers["authorization"]?.split(" ")[1];
            if (!token) {
                return res.status(401).json({
                    message: "User Authentication failed: Token not found",
                    success: false,
                });
            }
            const secretKey = process.env.JwtSecretKey;
            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        message: "User Authentication failed: Invalid token",
                        success: false,
                    });
                } else {
                    UserModel.findById({ _id: decoded.userId }).then((response) => {
                        if (response.block) {
                            return res.status(401).json({
                                message: " Blocked",
                                success: false,
                            });
                        } else {
                            return res.status(200).json({
                                message: "User Authentication success",
                                success: true,
                                username: response.username
                            });
                        }
                    })

                }
            });
        } catch (error) {
            return res.status(401).json({
                message: "User Authentication failed",
                success: false,
            });
        }

    },
    EventGet: async (req, res) => {
        try {
            const Events = await EventModal.find().sort({ eventDateTime: 1 })
            return res.status(200).json({
                Events,
                message: "Events get successfully",
                success: true,
            });
        } catch (error) {
            return res.status(401).json({
                message: "Events get error",
                success: false,
            });
        }
    }
}