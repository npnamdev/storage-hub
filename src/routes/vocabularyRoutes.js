const express = require('express');
const router = express.Router();
const Vocabulary = require('../models/vocabularyModal');

// GET - Lấy danh sách từ vựng
router.get('/', async (req, res) => {
  try {
    const vocabularies = await Vocabulary.find()
      .populate('topic', 'name')
      .sort({ createdAt: -1 }); // Sắp xếp theo trường createdAt theo thứ tự giảm dần (từ mới nhất trên đầu)
    res.json(vocabularies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET - Lấy từ vựng theo ID
router.get('/:id', async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findById(req.params.id).populate('topic', 'name');
    if (!vocabulary) {
      return res.status(404).json({ message: 'Không tìm thấy từ vựng' });
    }
    res.json(vocabulary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Tạo mới từ vựng
router.post('/', async (req, res) => {
  const { word, meaning, topic } = req.body;

  try {
    const vocabulary = new Vocabulary({ word, meaning, topic });
    const newVocabulary = await vocabulary.save();
    res.status(201).json(newVocabulary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Cập nhật từ vựng
router.put('/:id', async (req, res) => {
  const { word, meaning, topic } = req.body;
  try {
    const vocabulary = await Vocabulary.findById(req.params.id);
    if (!vocabulary) {
      return res.status(404).json({ message: 'Không tìm thấy từ vựng' });
    }
    vocabulary.word = word;
    vocabulary.meaning = meaning;
    vocabulary.topic = topic;
    const updatedVocabulary = await vocabulary.save();
    res.json(updatedVocabulary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Xóa từ vựng
router.delete('/:id', async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findByIdAndDelete(req.params.id);
    if (!vocabulary) {
      return res.status(404).json({ message: 'Không tìm thấy từ vựng' });
    }
    res.json({ message: 'Đã xóa từ vựng' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
