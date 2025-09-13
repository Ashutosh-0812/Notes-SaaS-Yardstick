const express = require('express');
const { auth } = require('../middleware/auth');
const { checkNoteLimit } = require('../middleware/tenant');
const Note = require('../models/Note');

const router = express.Router();

// Get all notes for current tenant
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ tenant: req.user.tenant._id })
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      tenant: req.user.tenant._id
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new note
router.post('/', auth, checkNoteLimit, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = new Note({
      title,
      content,
      tenant: req.user.tenant._id,
      createdBy: req.user._id
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a note
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, tenant: req.user.tenant._id },
      { title, content },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      tenant: req.user.tenant._id
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;