// src/pages/PlatformInsights.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const PlatformInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem("token"); // ton JWT
        const res = await axios.get("http://localhost:5000/api/ai/platform-insights", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInsights(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors du chargement des insights");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) return <p>Chargement des insights...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Insights de la plateforme</h1>
      <h2>Statistiques générales</h2>
      <ul>
        <li>Total cours : {insights.stats.totalCourses}</li>
        <li>Total reviews : {insights.stats.totalReviews}</li>
        <li>Note moyenne : {insights.stats.averageRating}</li>
      </ul>

      <h2>Rapport IA</h2>
      <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f4f4f4", padding: "1rem" }}>
        {insights.insights}
      </pre>
    </div>
  );
};

export default PlatformInsights;
