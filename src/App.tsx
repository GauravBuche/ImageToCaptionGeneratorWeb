import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        "https://b9df3515-d8f3-432f-88eb-390f647756b9-00-2zu05yv8r6vcx.sisko.replit.dev/caption",
        formData
      );
      const responseData: { caption?: unknown } = response.data;
      if (typeof responseData.caption === 'string') {
        setCaption(responseData.caption);
      } else {
        console.error('Caption is not a string:', responseData.caption);
      }
    } catch (error) {
      console.error("Error generating caption:", error.response || error.message);
      alert("Failed to generate caption. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Image-to-Caption Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Caption"}
        </button>
      </form>
      {caption && (
        <div className="caption-result">
          <h2>Caption:</h2>
          <p>{caption}</p>
        </div>
      )}
    </div>
  );
};

export default App;
