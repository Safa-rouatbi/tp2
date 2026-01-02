import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import SubmissionForm from './SubmissionForm';
import { analyzeSubmission } from '../../services/aiService';

const SubmissionList = () => {
  const { projectId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/submissions/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubmissions(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger les submissions');
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [projectId]);

  const toggleDetails = (submissionId) => {
    setExpandedSubmission(expandedSubmission === submissionId ? null : submissionId);
  };

  const handleAnalyze = async (submissionId) => {
    try {
      setAnalyzingId(submissionId);
      const token = localStorage.getItem('token');
      await analyzeSubmission(submissionId, token);
      // Refresh submissions
      const res = await axios.get(`http://localhost:5000/api/submissions/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert('Analyse IA échouée');
    } finally {
      setAnalyzingId(null);
    }
  };

  if (loading) {
    return <div className="p-4 text-white">Chargement des submissions...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h2 className="text-2xl text-white mb-4">Submissions</h2>

      {/* Formulaire de création */}
      <SubmissionForm
        onSubmissionCreated={(sub) =>
          setSubmissions((prev) => [sub, ...prev])
        }
      />

      {/* Liste des submissions */}
      <ul className="mt-6 space-y-4">
        {submissions.length > 0 ? (
          submissions.map((sub) => (
            <li key={sub._id} className="bg-gray-800 rounded-xl overflow-hidden">
              {/* En-tête cliquable */}
              <div
                onClick={() => toggleDetails(sub._id)}
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-700 transition-colors"
              >
                <span className="text-white">
                  {sub.title} ({sub.language}) - {sub.status} -{' '}
                  {new Date(sub.createdAt).toLocaleString()}
                </span>
                <span className="text-gray-400">
                  {expandedSubmission === sub._id ? '▲' : '▼'}
                </span>
              </div>

              {/* Détails affichés quand expandé */}
              {expandedSubmission === sub._id && (
                <div className="p-4 bg-gray-900 border-t border-gray-700">
                  <div className="flex gap-4 text-gray-400 text-sm mb-4">
                    {sub.userId && (
                      <span>Soumis par: {sub.userId.name || sub.userId.email}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/projects/${projectId}/submissions/${sub._id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Voir détails
                    </Link>
                    {sub.status === 'PENDING' && (
                      <button
                        onClick={() => handleAnalyze(sub._id)}
                        disabled={analyzingId === sub._id}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        {analyzingId === sub._id ? 'Analyse...' : 'Analyser avec IA'}
                      </button>
                    )}
                    {sub.status === 'ANALYZED' && (
                      <span className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                        Analysé
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <h4 className="text-white text-sm mb-2">Code:</h4>
                    <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                      <code className="text-green-400 text-sm">{sub.code}</code>
                    </pre>
                  </div>
                </div>
              )}
            </li>
          ))
        ) : (
          <li className="text-gray-400">Aucune submission disponible</li>
        )}
      </ul>
    </div>
  );
};

export default SubmissionList;
