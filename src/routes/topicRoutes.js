const express = require('express');
const router = express.Router();
const Topic = require('../models/topicModel');

router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

router.put('/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const updatedTopic = await Topic.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (!updatedTopic) {
      return res.status(404).json({ message: 'Không tìm thấy chủ đề' });
    }
    res.json(updatedTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const topic = await Topic.findOneAndDelete({ _id: req.params.id });
    if (!topic) {
      return res.status(404).json({ message: 'Không tìm thấy chủ đề' });
    }
    res.json({ message: 'Đã xóa chủ đề' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
