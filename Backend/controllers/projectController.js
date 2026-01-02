const Project = require('../models/Project');


//Créer un projet

const createProject = async (req, res) => {
    try {
        const { name, description, collaborators } = req.body;

        const project = await Project.create({
            name,
            description,
            ownerId: req.user._id,   
            collaborators
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Récupérer les projets accessibles par l'utilisateur

const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { ownerId: req.user._id },
                { collaborators: req.user._id }
            ]
        });

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Mettre à jour un projet 

const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        // Vérifier ownership
        if (project.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        project.name = req.body.name || project.name;
        project.description = req.body.description || project.description;

        const updatedProject = await project.save();
        res.status(200).json(updatedProject);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Supprimer un projet (OWNER seulement)
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        if (project.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        await project.deleteOne();
        res.status(200).json({ message: 'Projet supprimé avec succès' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProject,
    getMyProjects,
    updateProject,
    deleteProject
};
