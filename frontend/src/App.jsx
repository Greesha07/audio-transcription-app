import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadAudio = async () => {
    if (!file) {
      alert("Please select an audio file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setText(data.text);
    } catch (err) {
      alert("Upload failed. Check backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Audio to Text</h1>
        <p className="subtitle">
          Upload an audio file and get instant transcription
        </p>

        <label className="upload-box">
          {file ? file.name : "Click to upload audio"}
          <input
            type="file"
            accept="audio/*"
            hidden
            onChange={handleFileChange}
          />
        </label>

        <button className="btn" onClick={uploadAudio} disabled={loading}>
          {loading ? "Transcribing..." : "Upload & Transcribe"}
        </button>

        {text && (
          <div className="transcription-output">
            <h3 style={{ marginTop: 0, marginBottom: 12, color: '#0f172a' }}>Transcription</h3>
            <p style={{ margin: 0, color: '#0f172a' }}>{text}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;







