const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const path = require('path')
const port = process.env.PORT || 5000

connectDB()

const app = express()


// Mongo

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: String,
    data: Buffer,
});

const Image = mongoose.model('Image', imageSchema);

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'api/images/blogImages');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), async (req, res) => {
    // req.file contains the uploaded file
    const image = new Image({
        name: req.file.originalname,
        data: req.file.buffer,
    });
    await image.save();

    res.send('File uploaded successfully');
});
// ----------------------------------------------------------------


app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/userDetails', require('./routes/userDetailRoutes'))
app.use('/api/blogs', require('./routes/blogRoutes'))
app.use('/api/goals', require('./routes/goalRoutes'))

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => res.send('API Server. ' + 'Please visit https://thecyberhub.org'))
// app.use(express.static(path.join(__dirname,'../web/dist')))
    // app.get('*', (req,res)=> {
    //     res.sendFile(path.resolve(__dirname,'..','web','dist','index.html'))
    // })

    // app.use(express.static(path.join(__dirname,'./dist')))
    // app.get('*', (req,res)=> {
    //     res.sendFile(path.resolve(__dirname,'dist','index.html'))
    // })
} else {
    app.get('/', (req, res) => res.send('Please set to production'))
}

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))
