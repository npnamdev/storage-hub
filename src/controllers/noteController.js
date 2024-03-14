const userService = require('../services/userService');
const _ = require('lodash');
require('dotenv').config();

/**
 * Tạo một ghi chú mới
 * @param {object} req - Đối tượng request
 * @param {object} res - Đối tượng response
 * @returns {object} - Ghi chú đã được tạo
 */
exports.createNote = async (req, res) => {
    try {
        const { title, content, user, sharedWith, tags, isArchived, isDeleted, category, importance, files, urls, status } = req.body;
        const newNote = new Note({
            title,
            content,
            user,
            sharedWith,
            tags,
            isArchived,
            isDeleted,
            category,
            importance,
            files,
            urls,
            status
        });

        const savedNote = await newNote.save();

        return res.status(200).json({
            status: 'success',
            message: 'Ghi chú đã được tạo thành công',
            data: savedNote,
        });
    } catch (error) {
        return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};