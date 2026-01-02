import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { analyzeSubmission } from '../../services/aiService';

const SubmissionDetails = () => {
  const { projectId, submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/submissions/${submissionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubmission(res.data);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger la submission');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      const token = localStorage.getItem('token');
      const result = await analyzeSubmission(submissionId, token);
      // The API returns the review directly
      setReview(result);
      // Refresh submission to get updated status
      const res = await axios.get(`http://localhost:5000/api/submissions/${submissionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmission(res.data);
    } catch (err) {
      console.error(err);
      setError('Analyse IA échouée');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-white">Chargement...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!submission) {
    return <div className="p-4 text-white">Submission non trouvée</div>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <Link to={`/projects/${projectId}/submissions`} className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
        ← Retour aux submissions
      </Link>
      
      <div className="bg-gray-800 rounded-xl p-6">
        <h1 className="text-2xl text-white mb-2">{submission.title}</h1>
        <div className="flex gap-4 text-gray-400 text-sm mb-4">
          <span>Langue: {submission.language}</span>
          <span className={`px-2 py-1 rounded text-xs ${
            submission.status === 'PENDING' ? 'bg-yellow-600 text-white' :
            submission.status === 'ANALYZED' ? 'bg-green-600 text-white' :
            'bg-red-600 text-white'
          }`}>
            {submission.status}
          </span>
          <span>Créé le: {new Date(submission.createdAt).toLocaleString()}</span>
        </div>
        
        {submission.userId && (
          <p className="text-gray-400 text-sm mb-4">
            Soumis par: {submission.userId.name || submission.userId.email}
          </p>
        )}
        
        <div className="mt-6">
          <h3 className="text-white text-lg mb-2">Code:</h3>
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
            <code className="text-green-400 text-sm">{submission.code}</code>
          </pre>
        </div>
        {(submission.status === 'PENDING' || submission.status === 'ANALYZED') && !review && (
          <div className="mt-6 p-4 bg-purple-900/30 border border-purple-500 rounded-lg">
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {analyzing ? 'Analyse en cours...' : 'Analyser avec IA'}
            </button>
          </div>
        )}
        
        {review && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white text-lg">Analyse IA:</h3>
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                {analyzing ? 'Analyse...' : 'Ré-analyser'}
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              {/* Score */}
              {review.score && (
                <p className="text-purple-400 text-sm mb-4">Score: {review.score}/100</p>
              )}
              
              {/* Issues - with type, line, and comment */}
              {review.issues && review.issues.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-red-400 text-sm font-semibold mb-2">Problèmes détectés:</h4>
                  <ul className="space-y-2">
                    {review.issues.map((issue, index) => (
                      <li key={index} className="text-gray-300 text-sm bg-gray-800 p-2 rounded">
                        <span className="text-red-500 font-semibold">[{issue.type || 'Issue'}]</span>
                        {issue.line && <span className="text-yellow-500"> (ligne {issue.line})</span>}
                        <p className="mt-1">{issue.comment || issue}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Best Practices */}
              {review.bestPractices && review.bestPractices.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-green-400 text-sm font-semibold mb-2">Bonnes pratiques:</h4>
                  <ul className="list-disc list-inside text-gray-300 text-sm">
                    {review.bestPractices.map((practice, index) => (
                      <li key={index}>{practice}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Suggestions */}
              {review.suggestions && review.suggestions.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-blue-400 text-sm font-semibold mb-2">Suggestions d'amélioration:</h4>
                  <ul className="list-disc list-inside text-gray-300 text-sm">
                    {review.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Raw comments fallback */}
              {review.comments && review.comments.length > 0 && (
                <div>
                  <h4 className="text-yellow-400 text-sm font-semibold mb-2">Commentaires:</h4>
                  <ul className="list-disc list-inside text-gray-300 text-sm">
                    {review.comments.map((comment, index) => (
                      <li key={index}>{typeof comment === 'string' ? comment : JSON.stringify(comment)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionDetails;
