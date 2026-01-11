import { useState } from "react";

function App() {
  // State to store user input
  const [input, setInput] = useState("");
  // State to store movies returned by backend
  const [movies, setMovies] = useState("");
  // Loading state while fetching
  const [loading, setLoading] = useState(false);

  // Function to fetch movie recommendations from backend
  const getMovies = async () => {
    if (!input) return alert("Please enter your preference");

    setLoading(true);
    setMovies("");

    try {
      const res = await fetch("https://movierecommendation1.onrender.com/recommend", { // <-- Update here
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: input }),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      setMovies(data.movies); // Display movies
    } catch (err) {
      console.error(err);
      alert("Error fetching recommendations. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>🎬 Movie Recommendation App</h1>

        {/* Input box */}
        <input
          type="text"
          placeholder="e.g. romantic movies"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />

        {/* Button to fetch movies */}
        <button onClick={getMovies} style={styles.button}>
          Get Recommendations
        </button>

        {/* Loading state */}
        {loading && <p style={styles.loading}>Loading...</p>}

        {/* Display results */}
        {movies && (
          <pre style={styles.result}>
            {movies}
          </pre>
        )}
      </div>
    </div>
  );
}

// Inline styles
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center", // Center horizontally
    alignItems: "center",     // Center vertically
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "50px",
    borderRadius: "15px",
    width: "500px",
    textAlign: "center",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
  },
  heading: {
    fontSize: "32px",  // Bigger heading
    marginBottom: "25px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "14px",
    fontSize: "20px",  // Bigger text
    marginBottom: "25px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "20px",  // Bigger text
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  loading: {
    marginTop: "20px",
    fontSize: "20px",
    color: "#555",
  },
  result: {
    marginTop: "30px",
    textAlign: "left",
    fontSize: "18px",
    backgroundColor: "#f0f0f0",
    padding: "20px",
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
  },
};

export default App;
