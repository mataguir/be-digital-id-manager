require('dotenv').config();
const cors = require('cors');

const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(cors({
    origin: '*'
}));

mongoose.connect(process.env.DATABASE_URL, {});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

const usersRouter = require('./routes/user');
app.use('/user', usersRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server Started'));