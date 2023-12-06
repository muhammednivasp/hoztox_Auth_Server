import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import User from './routes/User.js'
import Admin from './routes/Admin.js'

const app = express()

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors({
    // origin: [`${process.env.BASE_URL}`,"https://vs-sports.netlify.app","http://localhost:5173"],
    origin: ["http://localhost:3000"],
    method: ["get", "post", "delete", "put", "patch"],
    credentials: true,
  }))

app.use('/',User)
app.use('/admin',Admin)


const Connection_Url = 'mongodb+srv://muhammednivasp:12345@gadgetstore.63oiejb.mongodb.net/hoztox'
const port = 4000

mongoose.connect(Connection_Url)
.then(()=>app.listen(port,()=>console.log('server running')))
.catch((error)=>console.log(error.message))