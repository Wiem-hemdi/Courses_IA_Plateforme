import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function RecommendedCourses() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const response = await api.get("/ai/recommended-courses");
        setRecommendations(response.data.data.recommendations);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors de la récupération");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchRecommendations();
  }, [user]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Cours recommandés pour vous</h1>
      {loading && <p>Chargement des recommandations...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <pre style={{ whiteSpace: "pre-wrap", background: "#f4f4f4", padding: "10px" }}>
          {recommendations}
        </pre>
      )}
    </div>
  );
}

export default RecommendedCourses;
