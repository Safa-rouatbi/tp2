import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  FolderPlus,
  Check,
  Plus,
  X,
  Edit2,
  Trash2,
  User,
  Folder,
  FileText,
  Brain,
  Star
} from "lucide-react";
import {
  getMyProjects,
  createProject,
  updateProject,
  deleteProject
} from "../services/projectService";
import Modal from "./Modal";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getMyProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les projets");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProject(editingId, { name, description });
      } else {
        await createProject({ name, description });
      }

      setName("");
      setDescription("");
      setEditingId(null);
      setIsModalOpen(false); 
      const data = await getMyProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setName(project.name);
    setDescription(project.description || "");
    setIsModalOpen(true); 
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    handleCancel();
  };

  if (loading) {
    return <div className="p-6 text-white">Chargement...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-900 via-blue-800 to-amber-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-black text-gray-300 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-white text-2xl font-bold">Dashboard</h2>
          <p className="text-sm text-gray-400">Gestion de projets</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <a className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl">
            <User /> Profil
          </a>
          <a className="flex items-center gap-3 p-3 bg-blue-600/20 text-blue-400 rounded-xl">
            <Folder /> Mes projets
          </a>
          <a className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl">
            <FileText /> Submissions
          </a>
          <a className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl">
            <Brain /> AI Analysis
          </a>
          <a className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl">
            <Star /> Reviews
          </a>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="mb-8 bg-black rounded-2xl p-8">
          <div className="flex items-center gap-4">
            <FolderOpen className="w-10 h-10 text-white" />
            <h1 className="text-4xl text-white font-bold">Mes Projets</h1>
          </div>
        </div>

        {/* BOUTON CREER PROJET */}
        <button
          onClick={openCreateModal}
          className="bg-blue-600 px-6 py-3 rounded-xl text-white flex items-center gap-2 mb-6"
        >
          <Plus /> Créer un projet
        </button>

        {/* MODAL FORMULAIRE */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-white text-xl mb-4">
            {editingId ? "Modifier le projet" : "Créer un projet"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="Nom du projet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 bg-gray-800 text-white rounded-xl"
            />

            <input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-xl"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 px-6 py-3 rounded-xl text-white flex items-center gap-2"
              >
                {editingId ? <Check /> : <Plus />}
                {editingId ? "Modifier" : "Créer"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-600 px-6 py-3 rounded-xl text-white flex items-center gap-2"
                >
                  <X /> Annuler
                </button>
              )}
            </div>
          </form>
        </Modal>

        {/* PROJECTS LIST */}
        <div className="grid gap-4">
          {projects.length === 0 ? (
            <p className="text-white">Aucun projet</p>
          ) : (
            projects.map((project) => (
              <div
                key={project._id}
                className="bg-black rounded-2xl p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-white text-xl">{project.name}</h3>
                  <p className="text-gray-400">
                    {project.description || "Aucune description"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(project)}>
                    <Edit2 className="text-yellow-400" />
                  </button>
                  <button onClick={() => handleDelete(project._id)}>
                    <Trash2 className="text-red-500" />
                  </button>
                  <Link
                    to={`/projects/${project._id}/submissions`}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-xl text-white flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" /> Submissions
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
