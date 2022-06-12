const express = require('express');
const app = express();

const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const {cloudinary} = require('./utils/cloudinary')

const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const eventsRoute = require('./routes/events');
const storiesRoute= require('./routes/stories');
const jobsRoute = require('./routes/jobs');
const courseRoute = require('./routes/courses');

const accessStatus = require('./middlewares/accessStatus')
const noStudent = require('./middlewares/noStudent')
//CONSTANTS
const port = process.env.PORT || 8080;
const db_url = process.env.DB_URL;

app.use('/images', express.static(path.join(__dirname, 'public/images')));
//MIDDLEWARES
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.set('view engine','ejs')

const storage = multer.diskStorage({
    destination: (req, file,cb) => {
        cb(null,'public/images');
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname);
    }
});

// const upload = multer({storage});
// app.post('/upload', upload.single('file'), (req,res) => {
//     try {
//         return res.status(200).json('File uploaded successfully')
//     } catch (error) {
//         console.log(error)
//     }
// })
//Upload images to cloudinary:
app.post('/upload',[accessStatus,noStudent],async (req,res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'Alumni',
        })
        console.log(uploadResponse);
        res.status(200).json({msg: "Uploaded Successfully", url: uploadResponse.url})
        // console.log(fileStr)
    } catch (error) {
        console.log(error)
        res.status(500).json({err: 'something went wrong'})
    }
})



//ROUTES
app.get('/', (req,res) => {
    res.send('hello');
})

app.use('/users', userRoute);
app.use('/auth', authRoute);
app.use('/events', eventsRoute);
app.use('/stories', storiesRoute);
app.use('/jobs', jobsRoute);
app.use('/courses', courseRoute);

//CONNECT TO DB
mongoose.connect(db_url, () => {
    console.log('connected to DB!');
})

//LISTENING AT PORT
app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
})
