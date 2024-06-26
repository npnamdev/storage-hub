const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectToDatabase = require('./configs/database');

const usersRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');
const vocabularyRoutes = require('./routes/vocabularyRoutes');
const topicRoutes = require('./routes/topicRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const cors = require('cors');
require('dotenv').config();

const userController = require('./controllers/userController');
userController.createAdminUserIfNotExist();

connectToDatabase();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: '*' })); 

app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notes', notesRoutes);
app.use('/api/v1/vocabulary', vocabularyRoutes);
app.use('/api/v1/topic', topicRoutes);
app.use('/api/v1/transactions', transactionRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is listening at http://localhost:${process.env.PORT}`);
});
