import { useState } from 'react';
import api from '../api/axios';

function GenerateDescription() {
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim() || !instructor.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setDescription('');

    try {
      const response = await api.post('/ai/generate-description', {
        title,
        instructor,
        keywords: keywords
          .split(',')
          .map(k => k.trim())
          .filter(k => k),
      });
      setDescription(response.data.data.description);
    } catch (error) {
      alert('Erreur lors de la génération');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    alert('Description copiée !');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '30px' }}>
      <h1>Générer une Description de Cours</h1>
      <p style={{ color: '#666', marginTop: '10px' }}>
        Utilisez l’IA pour créer une description attractive et professionnelle
      </p>

      <div style={{ marginTop: '30px' }}>
        {/* Titre du cours */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Titre du cours * :
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Développement Web avec React"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '5px'
            }}
          />
        </div>

        {/* Instructeur */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Instructeur * :
          </label>
          <input
            type="text"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            placeholder="Ex: Dr. Marie Dupont"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '5px'
            }}
          />
        </div>

        {/* Mots-clés */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Mots-clés (séparés par des virgules) :
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Ex: JavaScript, React, Hooks, Frontend"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '5px'
            }}
          />
        </div>

        {/* Bouton Générer */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            padding: '15px 40px',
            backgroundColor: loading ? '#95a5a6' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Génération...' : 'Générer avec l\'IA'}
        </button>
      </div>

      {/* Affichage de la description générée */}
      {description && (
        <div
          style={{
            marginTop: '40px',
            padding: '25px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            border: '2px solid #3498db',
            position: 'relative'
          }}
        >
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              padding: '8px 16px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Copier
          </button>

          <h3 style={{ color: '#3498db', marginBottom: '15px' }}>
            Description générée :
          </h3>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '16px' }}>
            {description}
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerateDescription;
