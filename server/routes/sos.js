const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const casesFile = path.join(__dirname, '../data/cases.json');
const uploadsDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }
});

router.post('/', authMiddleware, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]), (req, res) => {
  try {
    const { locationLink, notes } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const videoFile = req.files?.video?.[0];
    const audioFile = req.files?.audio?.[0];

    const newCase = {
      id: uuidv4(),
      userId: req.user.userId,
      userEmail: req.user.email,
      videoUrl: videoFile ? `/uploads/${videoFile.filename}` : null,
      audioUrl: audioFile ? `/uploads/${audioFile.filename}` : null,
      locationLink: locationLink || null,
      timestamp: new Date().toISOString(),
      status: 'Pending',
      notes: notes || ''
    };

    const data = JSON.parse(fs.readFileSync(casesFile, 'utf8'));
    data.cases.unshift(newCase);
    fs.writeFileSync(casesFile, JSON.stringify(data, null, 2));

    res.status(201).json({
      message: 'SOS case created successfully',
      case: newCase
    });
  } catch (error) {
    console.error('Create case error:', error);
    res.status(500).json({ error: 'Error creating SOS case' });
  }
});

router.get('/', authMiddleware, (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(casesFile, 'utf8'));
    
    let cases = data.cases;
    
    if (req.user.role !== 'police') {
      cases = cases.filter(c => c.userId === req.user.userId);
    }

    cases.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ cases });
  } catch (error) {
    console.error('Get cases error:', error);
    res.status(500).json({ error: 'Error fetching cases' });
  }
});

router.get('/:id', authMiddleware, (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(casesFile, 'utf8'));
    
    const caseData = data.cases.find(c => c.id === req.params.id);
    
    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }

    if (req.user.role !== 'police' && caseData.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ case: caseData });
  } catch (error) {
    console.error('Get case error:', error);
    res.status(500).json({ error: 'Error fetching case' });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const data = JSON.parse(fs.readFileSync(casesFile, 'utf8'));
    
    const caseIndex = data.cases.findIndex(c => c.id === req.params.id);
    
    if (caseIndex === -1) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const caseData = data.cases[caseIndex];

    if (status) {
      data.cases[caseIndex].status = status;
    }
    if (notes !== undefined) {
      data.cases[caseIndex].notes = notes;
    }

    fs.writeFileSync(casesFile, JSON.stringify(data, null, 2));

    res.json({
      message: 'Case updated successfully',
      case: data.cases[caseIndex]
    });
  } catch (error) {
    console.error('Update case error:', error);
    res.status(500).json({ error: 'Error updating case' });
  }
});

module.exports = router;
