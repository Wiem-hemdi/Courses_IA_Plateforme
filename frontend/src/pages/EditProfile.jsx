import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function EditProfile() {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
        website: '',
        interests: '',
        experience: '',
        goals: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                bio: user.bio || '',
                website: user.website || '',
                interests: user.interests || '',
                experience: user.experience || '',
                goals: user.goals || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.put(`/users/${user._id}`, formData);
            updateUser(response.data);
            setSuccess('Profil mis à jour avec succès!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Erreur lors de la mise à jour du profil:', err);
            setError(err.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const generateBio = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/ai/generate-bio', {
                interests: formData.interests,
                experience: formData.experience,
                goals: formData.goals
            });
            setFormData({ ...formData, bio: response.data.data.bio });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Erreur lors de la génération de la bio');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ marginBottom: '20px' }}>Modifier le profil</h1>

            {success && (
                <div style={{
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    border: '1px solid #c3e6cb'
                }}>
                    {success}
                </div>
            )}

            {error && (
                <div style={{
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    border: '1px solid #f5c6cb'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Nom d'utilisateur */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Nom d'utilisateur:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontSize: '16px'
                        }}
                        required
                    />
                </div>

                {/* Email */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontSize: '16px'
                        }}
                        required
                    />
                </div>

                {/* Intérêts */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Intérêts:</label>
                    <input
                        type="text"
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontSize: '16px'
                        }}
                        placeholder="Ex: Développement web, IA, Design..."
                    />
                </div>

                {/* Expérience */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Expérience:</label>
                    <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontSize: '16px'
                        }}
                        placeholder="Ex: 3 ans en développement front-end..."
                    />
                </div>

                {/* Objectifs */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Objectifs:</label>
                    <input
                        type="text"
                        name="goals"
                        value={formData.goals}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontSize: '16px'
                        }}
                        placeholder="Ex: Devenir développeur React senior..."
                    />
                </div>

                {/* Bio */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Bio:</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            minHeight: '100px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontSize: '16px',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                        placeholder="Dites-nous en plus sur vous..."
                    />
                    <button
                        type="button"
                        onClick={generateBio}
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '500',
                            marginTop: '10px',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Génération en cours...' : 'Générer une bio automatiquement'}
                    </button>
                </div>

                {/* Site web */}
                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Site web:</label>
                    <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontSize: '16px'
                        }}
                        placeholder="https://example.com"
                    />
                    <small style={{ color: '#6c757d', fontSize: '0.875em' }}>
                        Laissez ce champ vide si vous ne souhaitez pas afficher de site web.
                    </small>
                </div>

                {/* Boutons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '500',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={e => !loading && (e.target.style.opacity = '0.9')}
                        onMouseOut={e => !loading && (e.target.style.opacity = '1')}
                    >
                        {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#f8f9fa',
                            color: '#333333ff',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={e => e.target.style.backgroundColor = '#e2e6ea'}
                        onMouseOut={e => e.target.style.backgroundColor = '#f8f9fa'}
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProfile;
