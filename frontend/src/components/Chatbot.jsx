import { useState } from "react";
import api from "../api/axios";

function Chatbot({ course }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer(""); // reset la réponse précédente
    try {
      const res = await api.post("/ai/chatbot", { 
        question,
        courseId: course?._id // passe l'id du cours au backend
      });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      setAnswer("Erreur lors de la réponse du chatbot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      marginTop: "20px",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#fafafa"
    }}>
      <h3>Chatbot - Posez vos questions sur ce cours</h3>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Votre question..."
        style={{ width: "100%", minHeight: "80px", marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      <button
        onClick={handleAsk}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "En cours..." : "Poser la question"}
      </button>

      {answer && (
        <div style={{
          marginTop: "15px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "5px"
        }}>
          <strong>Réponse :</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
