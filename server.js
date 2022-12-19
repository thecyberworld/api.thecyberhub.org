const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const path = require('path')
const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/userDetails', require('./routes/userDetailRoutes'))
// app.use('/api/blogs', require('./routes/blogRoutes'))
app.use('/api/goals', require('./routes/goalRoutes'))

// Serve Frontend
if(process.env.NODE_ENV === 'production') {
    app.get('*',(req,res) => res.send('API Server.' + 'Checkout https://thecyberhub.org'))
// app.use(express.static(path.join(__dirname,'../web/dist')))
    // app.get('*', (req,res)=> {
    //     res.sendFile(path.resolve(__dirname,'..','web','dist','index.html'))
    // })

    // app.use(express.static(path.join(__dirname,'./dist')))
    // app.get('*', (req,res)=> {
    //     res.sendFile(path.resolve(__dirname,'dist','index.html'))
    // })
} else {
    app.get('/',(req,res) => res.send('Please set to production'))
}

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))
