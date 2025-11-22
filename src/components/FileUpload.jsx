import React from 'react';
import './FileUpload.css';

const FileUpload = ({ onFileLoad }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    if (file.type !== 'application/json') {
      alert('Please upload a JSON file');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        
        if (!Array.isArray(jsonData)) {
          alert('JSON file must contain an array of shipments');
          return;
        }
        
        onFileLoad(jsonData);
      } catch (error) {
        alert('Error parsing JSON file: ' + error.message);
      }
    };
    
    reader.onerror = () => {
      alert('Error reading file');
    };
    
    reader.readAsText(file);
  };

  const loadSampleData = async () => {
    try {
      const response = await fetch('/shipment-status-validator/sample_shipments.json');
      const data = await response.json();
      onFileLoad(data);
    } catch (error) {
      alert('Error loading sample data: ' + error.message);
    }
  };

  return (
    <div className="file-upload">
      <h2>Upload Shipment Data</h2>
      <div className="upload-options">
        <label className="custom-file-upload">
          <input 
            type="file" 
            accept=".json"
            onChange={handleFileChange}
          />
          Choose JSON File
        </label>
        <button onClick={loadSampleData} className="sample-btn">
          Load Sample Data
        </button>
      </div>
      <p className="upload-hint">
        Upload a JSON file containing shipment tracking data or load sample data to test the validator
      </p>
    </div>
  );
};

export default FileUpload;
