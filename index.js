import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import User from './routes/User.js'
import Admin from './routes/Admin.js'

const app = express()

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors({
  origin: [`${process.env.BASE_URL}` , 'https://hoztox.netlify.app/'],
  method: ["get", "post", "delete", "put", "patch"],
  credentials: true,
}))

app.use('/', User)
app.use('/admin', Admin)

const Connection_Url = process.env.MONGO_URL
const port = process.env.PORT

mongoose.connect(Connection_Url)
  .then(() => app.listen(port, () => console.log('Server running')))
  .catch((error) => console.error('Error connecting to MongoDB:', error.message));
