import { useState } from 'react';
import api from '../api/axios';

function SimilarCourses({ courseId }) {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleGetSuggestions = async () => {
    if (suggestions) {
      setShow(!show);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/ai/similar-courses/${courseId}`);
      setSuggestions(response.data.data);
      setShow(true);
    } catch (error) {
      alert('Erreur lors de la génération des suggestions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <button
        onClick={handleGetSuggestions}
        disabled={loading}
        style={{
          padding: '12px 24px',
          backgroundColor: loading ? '#95a5a6' : '#f39c12',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {loading
          ? 'Chargement...'
          : show
          ? 'Masquer les suggestions'
          : 'Voir les cours similaires (IA)'}
      </button>

      {show && suggestions && (
        <div
          style={{
            marginTop: '20px',
            padding: '25px',
            backgroundColor: '#fff9e6',
            borderRadius: '10px',
            border: '2px solid #f39c12'
          }}
        >
          <h3 style={{ color: '#f39c12', marginBottom: '15px' }}>
            Cours similaires recommandés par l’IA :
          </h3>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '16px' }}>
            {suggestions.suggestions}
          </div>
        </div>
      )}
    </div>
  );
}

export default SimilarCourses;
