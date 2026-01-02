const Submission = require('../models/Submission');
const Project = require('../models/Project');


//Créer une submission
const createSubmission = async (req, res) => {
    try {
        const { projectId, title, language, code } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        // Vérifier accès
        const isAllowed =
            project.ownerId.toString() === req.user._id.toString() ||
            project.collaborators.some(
                id => id.toString() === req.user._id.toString()
            );

        if (!isAllowed) {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        const submission = await Submission.create({
            projectId,
            userId: req.user._id,
            title,
            language,
            code,
            status: 'PENDING'
        });

        res.status(201).json(submission);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Récupérer les submissions d’un projet

const getProjectSubmissions = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        // Vérifier accès
        const isAllowed =
            project.ownerId.toString() === req.user._id.toString() ||
            project.collaborators.some(
                id => id.toString() === req.user._id.toString()
            );

        if (!isAllowed) {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        const submissions = await Submission.find({ projectId });

        res.status(200).json(submissions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Récupérer une submission par ID
const getSubmissionById = async (req, res) => {
    try {
        const { id } = req.params;

        const submission = await Submission.findById(id).populate('userId', 'name email');
        if (!submission) {
            return res.status(404).json({ message: 'Submission non trouvée' });
        }

        const project = await Project.findById(submission.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        // Vérifier accès
        const isAllowed =
            project.ownerId.toString() === req.user._id.toString() ||
            project.collaborators.some(
                id => id.toString() === req.user._id.toString()
            );

        if (!isAllowed) {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        res.status(200).json(submission);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSubmission,
    getProjectSubmissions,
    getSubmissionById
};
