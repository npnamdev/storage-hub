const Note = require('../models/noteModel');

exports.createNote = async (noteData) => {
    try {
        const newNote = new Note(noteData);
        const savedNote = await newNote.save();
        return savedNote;
    } catch (error) {
        throw error;
    }
};


exports.getAllNotes = async () => {
    try {
        const allNotes = await Note.find();
        return allNotes;
    } catch (error) {
        throw error;
    }
};

exports.getNoteById = async (noteId) => {
    try {
        const note = await Note.findById(noteId);
        if (!note) {
            throw new Error('Note not found');
        }
        return note;
    } catch (error) {
        throw error;
    }
};

exports.updateNoteById = async (noteId, updateData) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(noteId, updateData, { new: true });
        if (!updatedNote) {
            throw new Error('Note not found');
        }
        return updatedNote;
    } catch (error) {
        throw error;
    }
};

exports.deleteNoteById = async (noteId) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(noteId);
        if (!deletedNote) {
            throw new Error('Note not found');
        }
        return deletedNote;
    } catch (error) {
        throw error;
    }
};

exports.getUserNotes = async (userId) => {
    try {
        const userNotes = await Note.find({ user: userId });
        return userNotes;
    } catch (error) {
        throw error;
    }
};