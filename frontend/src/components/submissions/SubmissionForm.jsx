import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SubmissionForm = ({ onSubmissionCreated }) => {
  const { projectId } = useParams();
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token'); // JWT
      const res = await axios.post(`http://localhost:5000/api/submissions`, {
        projectId,
        title,
        language,
        code
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onSubmissionCreated(res.data);
      setTitle('');
      setCode('');
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
      {error && <p className="text-red-500">{error}</p>}
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Titre de la submission"
        required
        className="p-2 rounded-md bg-gray-800 text-white"
      />
      <select
        value={language}
        onChange={e => setLanguage(e.target.value)}
        className="p-2 rounded-md bg-gray-800 text-white"
      >
        <option>JavaScript</option>
        <option>Java</option>
        <option>Python</option>
        <option>C++</option>
        <option>Ruby</option>
        <option>Go</option>
        <option>PHP</option>
        <option>C#</option>
        <option>Swift</option>
        <option>Kotlin</option>
        <option>TypeScript</option>
        <option>Rust</option>
        <option>Scala</option>
      </select>
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Collez votre code ici"
        required
        className="p-2 rounded-md bg-gray-800 text-white"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
      >
        {loading ? 'Envoi...' : 'Soumettre'}
      </button>
    </form>
  );
};

export default SubmissionForm;
