import { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import ValidationSummary from './components/ValidationSummary';
import ShipmentResults from './components/ShipmentResults';
import { validateShipments } from './utils/validator';
import './App.css';

function App() {
  const [validationReport, setValidationReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileLoad = useCallback((shipments) => {
    setIsLoading(true);
    
    // Process validation asynchronously for better performance
    requestAnimationFrame(() => {
      setTimeout(() => {
        const report = validateShipments(shipments);
        setValidationReport(report);
        setIsLoading(false);
      }, 100);
    });
  }, []);

  const handleReset = useCallback(() => {
    setValidationReport(null);
  }, []);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <div className="navbar-logo">
              <img src="https://res.cloudinary.com/dmyww4jcv/image/upload/v1763710974/Screenshot_2025-11-21_131126_dozfqi.png" alt="VAMASHIP" className="logo-image" />
            </div>
            <div className="navbar-divider"></div>
            <h1 className="navbar-title">Shipment Status Validator</h1>
          </div>
        </div>
      </nav>
      
      <main className="app-main">
        <FileUpload onFileLoad={handleFileLoad} />

        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Validating shipments...</p>
          </div>
        )}

        {!isLoading && validationReport && (
          <>
            <ValidationSummary report={validationReport} />
            <ShipmentResults report={validationReport} />
            
            <div className="reset-section">
              <button onClick={handleReset} className="reset-btn">
                Reset & Upload New File
              </button>
            </div>
          </>
        )}

        {!isLoading && !validationReport && (
          <div className="welcome-message">
            <div className="welcome-icon icon-clipboard"></div>
            <h2>Welcome to Shipment Status Validator</h2>
            <p>Upload a JSON file or load sample data to get started</p>
            <ul className="features-list">
              <li><span className="check-icon"></span>Validates state transitions</li>
              <li><span className="check-icon"></span>Detects time-based anomalies</li>
              <li><span className="check-icon"></span>Identifies duplicate events</li>
              <li><span className="check-icon"></span>Checks for skipped critical states</li>
              <li><span className="check-icon"></span>Generates comprehensive reports</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
