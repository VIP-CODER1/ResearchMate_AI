import React, { useState } from 'react';
import axios from '../axios';

function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.name.endsWith('.pdf') || selectedFile.name.endsWith('.txt'))) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a PDF or TXT file.');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUpload(response.data.text, response.data.summary);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload document.');
    }
  };

  return (
    <div className="upload-card">
      <div className="upload-head">
        <p className="pill subtle">PDF / TXT</p>
        <h2>Drop your research file</h2>
        <p className="muted">We parse and sanitize the text before summarizing.</p>
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        <label className="dropzone">
          <input type="file" accept=".pdf,.txt" onChange={handleFileChange} />
          <div>
            <strong>{file ? file.name : 'Click to choose a file'}</strong>
            <span>or drag & drop here</span>
          </div>
        </label>

        {error && <p className="text-error text-sm">{error}</p>}

        <div className="upload-actions">
          <button type="submit" disabled={!file} className="btn-cta">
            Upload & Summarize
          </button>
          <span className="muted">PDF / TXT up to ~20MB</span>
        </div>
      </form>
    </div>
  );
}

export default FileUpload;