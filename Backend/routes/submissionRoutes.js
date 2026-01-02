const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

const {
    createSubmission,
    getProjectSubmissions,
    getSubmissionById,
} = require('../controllers/submissionController');

router.post('/', protect, createSubmission);
router.get('/project/:projectId', protect, getProjectSubmissions);
router.get('/:id', protect, getSubmissionById);



module.exports = router;
