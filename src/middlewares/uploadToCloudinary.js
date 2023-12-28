const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

const handleFileUpload = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    try {
        await cloudinary.uploader.upload_stream({ resource_type: 'auto' },
            (error, result) => {
                if (error || !result) {
                    console.error('Cloudinary Error:', error);
                    return res.status(500).json({ message: 'Cloudinary Error', error: error });
                }
                req.cloudinaryResult = result;
                next();
            }).end(req.file.buffer);
    } catch (error) {
        console.error('Cloudinary Error:', error);
        res.status(500).json({ message: 'Cloudinary Error', error: error });
    }
};

const uploadToCloudinary = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: 'File upload failed. Please try again.' });
        }

        if (req.file) {
            handleFileUpload(req, res, next);
        } else {
            return res.status(400).json({ error: 'No file provided' });
        }
    });
};

module.exports = uploadToCloudinary;
