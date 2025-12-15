import axios from 'axios';
import { useEffect, useState } from 'react';

function AdminDashboard() {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem('token'); // token de connexion admin
        const res = await axios.get('/api/ai/platform-insights', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInsights(res.data.data);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Erreur');
      }
    };

    fetchInsights();
  }, []);

  if (!insights) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Dashboard Admin</h1>
      <p>Total Courses: {insights.stats.totalCourses}</p>
      <p>Total Reviews: {insights.stats.totalReviews}</p>
      <p>Average Rating: {insights.stats.averageRating}</p>
      <pre>{insights.insights}</pre>
    </div>
  );
}

export default AdminDashboard;
