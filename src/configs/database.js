const mongoose = require('mongoose');
require('dotenv').config();

const connectToDatabase = async () => {
    try {
        const mongodbUri = process.env.MONGODB_URI;

        if (!mongodbUri) {
            console.error('Missing MONGODB_URI in the environment variables.');
            return;
        }

        await mongoose.connect(mongodbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
}

module.exports = connectToDatabase;
