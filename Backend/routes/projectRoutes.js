const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    createProject,
    getMyProjects,
    updateProject,
    deleteProject
} = require('../controllers/projectController');

router.post('/', protect, createProject);
router.get('/', protect, getMyProjects);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
