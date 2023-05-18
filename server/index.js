// index.js
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const authenticationRouter = require('./routes/authenticationRouter');
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoute');
const commentRoute = require('./routes/commentRoute');
require('dotenv').config();

// middleware calls

const corsConfig = {
  origin: ['https://ik.imagekit.io','http://localhost:3000'],
  optionsSuccessStatus: 200,
  methods: 'GET, POST, PUT, DELETE',
};

app.use(cors(corsConfig));
app.use(express.json());
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.use('/api/v1/auth', authenticationRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/comment', commentRoute);

app.get('/health/check', (req, res) => {
  res.status(200).send('Welcome to pic lounge backend service');
});

function connetDb() {
  mongoose
    .connect(process.env.DB_URL || 'mongodb://0.0.0.0:27017/pic_lounge_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('connected to db', process.env.DB_URL);
    })
    .catch((err) => {
      console.log(err);
    });
}

// port configuration
app.listen(process.env.PORT || 3000, () => {
  connetDb();
  console.log('server started on ' + (process.env.PORT || 3000));
});
