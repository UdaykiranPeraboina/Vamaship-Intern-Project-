import React, { useState, useMemo, useCallback } from 'react';
import './ShipmentResults.css';

const ShipmentResults = React.memo(({ report }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'valid', 'invalid'
  const [expandedShipment, setExpandedShipment] = useState(null);

  if (!report || !report.shipments) return null;

  const filteredShipments = useMemo(() => {
    return report.shipments.filter(shipment => {
      if (filter === 'valid') return shipment.status === 'valid';
      if (filter === 'invalid') return shipment.status === 'invalid';
      return true;
    });
  }, [report.shipments, filter]);

  const toggleShipment = useCallback((shipmentNo) => {
    setExpandedShipment(prev => prev === shipmentNo ? null : shipmentNo);
  }, []);

  const exportResults = useCallback(() => {
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'validation_report.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [report]);

  return (
    <div className="shipment-results">
      <div className="results-header">
        <h2>Shipment Details</h2>
        <button onClick={exportResults} className="export-btn">
          Export Results (JSON)
        </button>
      </div>

      <div className="filter-buttons">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All ({report.shipments.length})
        </button>
        <button 
          className={filter === 'valid' ? 'active' : ''} 
          onClick={() => setFilter('valid')}
        >
          Valid ({report.summary.valid_shipments})
        </button>
        <button 
          className={filter === 'invalid' ? 'active' : ''} 
          onClick={() => setFilter('invalid')}
        >
          Invalid ({report.summary.invalid_shipments})
        </button>
      </div>

      <div className="shipments-list">
        {filteredShipments.map((shipment) => (
          <div 
            key={shipment.shipment_no} 
            className={`shipment-card ${shipment.status}`}
          >
            <div 
              className="shipment-header"
              onClick={() => toggleShipment(shipment.shipment_no)}
            >
              <div className="shipment-info">
                <span className="shipment-number">{shipment.shipment_no}</span>
                <span className="tracking-id">{shipment.tracking_id}</span>
              </div>
              <div className="shipment-status-info">
                <span className={`status-badge ${shipment.status}`}>
                  {shipment.status.toUpperCase()}
                </span>
                {shipment.anomalies.length > 0 && (
                  <span className="anomaly-badge">
                    {shipment.anomalies.length} {shipment.anomalies.length === 1 ? 'anomaly' : 'anomalies'}
                  </span>
                )}
              </div>
              <span className={`expand-icon ${expandedShipment === shipment.shipment_no ? 'expanded' : ''}`}>
              </span>
            </div>

            {expandedShipment === shipment.shipment_no && (
              <div className="shipment-details">
                <div className="detail-row">
                  <span className="label">Current Status:</span>
                  <span className="value">
                    {shipment.current_status_name} ({shipment.current_status})
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Total Events:</span>
                  <span className="value">{shipment.event_count || 0}</span>
                </div>

                {shipment.anomalies.length > 0 && (
                  <div className="anomalies-section">
                    <h4>Anomalies Detected:</h4>
                    <div className="anomalies-list">
                      {shipment.anomalies.map((anomaly, index) => (
                        <div key={index} className="anomaly-detail">
                          <div className="anomaly-type-badge">{anomaly.type.replace(/_/g, ' ')}</div>
                          <div className="anomaly-message">{anomaly.message}</div>
                          {anomaly.event_index !== undefined && (
                            <div className="anomaly-location">At event index: {anomaly.event_index}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredShipments.length === 0 && (
        <div className="no-results">
          No shipments found for the selected filter.
        </div>
      )}
    </div>
  );
});

ShipmentResults.displayName = 'ShipmentResults';

export default ShipmentResults;
