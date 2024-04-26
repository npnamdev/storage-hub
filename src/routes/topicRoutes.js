const express = require('express');
const router = express.Router();
const Topic = require('../models/topicModel');

// GET - Lấy danh sách chủ đề
router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Lấy chủ đề theo ID
router.get('/:id', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Không tìm thấy chủ đề' });
    }
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Tạo mới chủ đề
router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    const topic = new Topic({ name });
    const newTopic = await topic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Cập nhật chủ đề
router.put('/:id', async (req, res) => {
  const { name } = req.body;

  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Không tìm thấy chủ đề' });
    }

    topic.name = name;

    const updatedTopic = await topic.save();
    res.json(updatedTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Xóa chủ đề
router.delete('/:id', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Không tìm thấy chủ đề' });
    }

    await topic.remove();
    res.json({ message: 'Đã xóa chủ đề' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
