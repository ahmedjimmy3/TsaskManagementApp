const express = require('express')
const app = express()

const dotenv = require('dotenv')
const connectionDB = require('./config/DBConnection')
const bodyParser = require('body-parser')
const UserAuth = require('./routes/auth')
const userRoutes = require('./routes/user')
const taskRoutes = require('./routes/tasks')


dotenv.config()
connectionDB()  //database connection

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use('/auth' , UserAuth)
app.use('/user' , userRoutes)
app.use('/task' , taskRoutes)




const PORT = process.env.PORT
app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`)
})