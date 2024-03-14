const noteService = require('../services/noteService');
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
        const noteData = req.body;
        
        console.log(noteData);
        console.log(req.files);
        const savedNote = await noteService.createNote(noteData);

        return res.status(200).json({
            status: 'success',
            message: 'Ghi chú đã được tạo thành công',
            data: savedNote,
        });
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};


exports.getAllNotes = async (req, res) => {
    try {
        const allNotes = await noteService.getAllNotes();
        return res.status(200).json({
            status: 'success',
            message: 'Danh sách các ghi chú đã được lấy thành công',
            data: allNotes,
        });
    } catch (error) {
        return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};