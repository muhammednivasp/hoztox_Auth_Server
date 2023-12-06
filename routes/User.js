import express from "express"
const router = express.Router()

import UserController from '../controllers/UserController.js'
const {UserRegister,VerifyOtp,UserLogin,IsUserAuth,UserGet} = UserController
// router.route('/login').get((req,res)=>console.log("jjjjj")).post((req,res)=>console.log(req.body))

// router.get('/login',(req,res)=>{
//     console.log('hello');
//     res.send('hello hai everyone')
// })

router.route('/register').post(UserRegister)
router.route('/verify').post(VerifyOtp)
router.route('/login').post(UserLogin)
router.route('/userauth').get(IsUserAuth)
router.route('/userget').get(UserGet)




export default router