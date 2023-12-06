import express from "express"
const router = express.Router()

router.get('/',(req,res)=>{
    console.log('hiii');
    res.send('hiii hai all')
})

router.post('/',(req,res)=>{
    console.log('eeee....');
})

export default router