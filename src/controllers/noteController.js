const noteService = require('../services/noteService');
const _ = require('lodash');

exports.createNote = async (req, res) => {
    try {
        const noteData = req.body;
        noteData.user = req.user.userId;
        const savedNote = await noteService.createNote(noteData);
        return res.status(200).json({
            status: 'success',
            message: 'Note has been successfully created',
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
            message: 'List of notes has been successfully retrieved',
            data: allNotes,
        });
    } catch (error) {
        return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};                  

exports.getNoteById = async (req, res) => {
    try {
        const noteId = req.params.id;
        if (!noteId) {
            return res.status(400).json({ status: 'error', message: 'Note ID is required' });
        }
        const note = await noteService.getNoteById(noteId);
        return res.status(200).json({
            status: 'success',
            data: note,
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.updateNoteById = async (req, res) => {
    try {
        const noteId = req.params.id;
        const updateData = req.body;

        if (!noteId) {
            return res.status(400).json({ status: 'error', message: 'Note ID is required' });
        }

        const updatedNote = await noteService.updateNoteById(noteId, updateData);

        return res.status(200).json({
            status: 'success',
            message: 'Note updated successfully',
            data: updatedNote,
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.deleteNoteById = async (req, res) => {
    try {
        const noteId = req.params.id;
        if (!noteId) {
            return res.status(400).json({ status: 'error', message: 'Note ID is required' });
        }
        const deletedNote = await noteService.deleteNoteById(noteId);
        return res.status(200).json({
            status: 'success',
            message: 'Note deleted successfully',
            data: deletedNote,
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.getUserNotes = async (req, res) => {
    try {
        console.log(req.user);
        // const userId = req.user.userId;
        // const userNotes = await noteService.getUserNotes(userId);
        return res.status(200).json({
            status: 'success',
            // data: userNotes,
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};