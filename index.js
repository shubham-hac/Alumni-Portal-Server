const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const eventsRoute = require('./routes/events');
const jobsRoute = require('./routes/jobs');
const courseRoute = require('./routes/courses');
const mongoose = require('mongoose');
const cors = require('cors');

//CONSTANTS
const port = process.env.PORT || 8080;
const db_url = process.env.DB_URL;

//MIDDLEWARES
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

//ROUTES
app.get('/', (req,res) => {
    res.send('hello');
})

app.use('/users', userRoute);
app.use('/auth', authRoute);
app.use('/events', eventsRoute);
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