const Note = require('../models/noteModel');

exports.createNote = async (noteData) => {
    try {
        const { title, content, user, sharedWith, tags, isArchived, isDeleted, category, importance, files, urls, status } = noteData;
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
