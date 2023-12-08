import express from "express"
const router = express.Router()

import AdminController from "../controllers/AdminController.js"
const {AdminLogin,IsAdminAuth,UsersList,UserHandle,EventCreation} = AdminController

router.route('/login').post(AdminLogin)
router.route('/adminauth').get(IsAdminAuth)
router.route('/userslist').get(UsersList)
router.route('/userhandle').patch(UserHandle)
router.route('/eventcreation').post(EventCreation)





export default router