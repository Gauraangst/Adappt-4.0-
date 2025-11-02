// CSV upload component for importing usage data
import React, { useState } from 'react';
import { uploadCSV } from '../services/api';

function CSVUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const result = await uploadCSV(file);
      setMessage(`✅ Success! Imported ${result.imported} records. ${result.errors} errors.`);
      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setMessage(`❌ Upload failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-section">
      <h2>📁 Upload CSV Data</h2>
      <p>Upload a CSV file with columns: applianceName, timestamp, consumption, powerRating</p>
      <div className="file-input">
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange}
          disabled={uploading}
        />
        <button 
          onClick={handleUpload} 
          className="upload-btn"
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </div>
      {message && <div style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>{message}</div>}
    </div>
  );
}

export default CSVUpload;
