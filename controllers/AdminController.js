import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'

dotenv.config();

import AdminModel from '../model/AdminModel.js';
import UserModel from '../model/UserModel.js'
import EventModel from '../model/EventModel.js';


export default {

    AdminLogin: async (req, res) => {
        try {
            const { password, email } = req.body;
            const adminExist = await AdminModel.findOne({ email });
            if (!adminExist) {
                return res.status(400).json({ message: "Admin does not exist", success: false });
            } else {
                const isPasswordValid = await bcrypt.compare(password, adminExist.password);
                if (!isPasswordValid) {
                    return res.status(400).json({ message: "Incorrect password", success: false });
                } else {
                    let token = jwt.sign({ adminId: adminExist._id }, process.env.JwtSecretKey, { expiresIn: '1day' })
                    return res.status(200).json({ token: token, adminExist: adminExist, message: "Login successful", success: true });
                }
            }
        } catch (error) {
            return res.json({ message: "Internal server error", success: false });
        }
    },
    IsAdminAuth: async (req, res) => {
        try {
            const token = req.headers["authorization"]?.split(" ")[1];
            if (!token) {
                return res.status(401).json({
                    message: "Admin Authentication failed: Token not found",
                    success: false,
                });
            }
            const secretKey = process.env.JwtSecretKey;
            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        message: "Admin Authentication failed: Invalid token",
                        success: false,
                    });
                } else {
                    AdminModel.findById({ _id: decoded.adminId }).then((response) => {
                        if (response) {
                            return res.status(200).json({
                                message: "Admin Authentication success",
                                success: true,
                            });
                        }
                    })

                }
            });
        } catch (error) {
            return res.status(401).json({
                message: "Admin Authentication failed",
                success: false,
            });
        }

    },
    UsersList: async (req, res) => {
        try {
            const Users = await UserModel.find()
            return res.status(200).json({
                Users: Users,
                message: "success",
                success: true,
            });
        } catch (error) {
            return res.status(401).json({
                message: "Users get failed",
                success: false,
            });
        }
    },
    UserHandle: async (req, res) => {
        try {
            const { _id } = req.body
            let user = await UserModel.findByIdAndUpdate({ _id });
            if (!user) {
                return res.status(404).send({ message: "user not found", success: false });
            }
            user.block = !user.block;
            user.save().then((data) => {
                UserModel.find({}).then((users) => {
                    return res.status(200).send({ Users: users, message: "User updated successfully", success: true });
                }).catch((err) => {
                    return res.status(401).send({ message: err, success: false });
                })
            }).catch((err) => {
                return res.status(401).send({ message: err, success: false });
            })
        } catch (err) {
            return res.status(500).send({ message: "Server error", success: false });
        }
    },
    EventCreation: async (req, res) => {
        try {
            const { eventName, eventDateTime, eventDescription, eventUrl } = req.body
            await EventModel.create({
                eventName,
                eventDateTime,
                eventDescription,
                eventUrl
            })
            return res.status(200).send({ message: "Event created successfully", success: true });
        } catch (error) {
            return res.status(500).send({ message: 'Event creation Failed', success: false });
        }
    }
}