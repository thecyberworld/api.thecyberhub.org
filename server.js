const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const path = require('path')
const port = process.env.PORT || 5000
const cors = require('cors');


connectDB()

const app = express()

// app.use(cors({ origin: '*' }));
app.use(cors({origin: 'http://localhost:3000/'})); // Allow only localhost:3000 as an origin

app.use("/images/blogImages", express.static(path.join(__dirname, "/images/blogImages")));

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

const upload = multer({storage});

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
    app.get('*', (req, res) => res.send(`
    <html>
      <head>
        <style>
          .api-server-message {display: flex;justify-content: center;align-items: center; font-size: 24px; font-family: "Montserrat", sans-serif;}
          a {color: #5ac8fa;text-decoration: none;text-underline: #0e0e0e;}
        </style>
      </head>
      <body>
        <div class="api-server-message">API Server. Please visit &nbsp;<a href="https://thecyberhub.org"> https://thecyberhub.org </a></div>
      </body>
    </html>
  `))
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
