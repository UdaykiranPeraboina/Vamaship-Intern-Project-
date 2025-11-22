import React from 'react';
import './ValidationSummary.css';

const ValidationSummary = React.memo(({ report }) => {
  if (!report) return null;

  const { summary, anomaly_summary } = report;

  const anomalyTypes = [
    {
      key: 'invalid_transitions',
      iconClass: 'icon-transitions',
      label: 'Invalid Transitions',
      description: 'State changes that violate the defined transition rules',
      color: '#e53e3e'
    },
    {
      key: 'time_anomalies',
      iconClass: 'icon-time',
      label: 'Time Anomalies',
      description: 'Events with incorrect timestamps or chronological order',
      color: '#dd6b20'
    },
    {
      key: 'duplicate_events',
      iconClass: 'icon-duplicate',
      label: 'Duplicate Events',
      description: 'Multiple occurrences of the same status at one location',
      color: '#d69e2e'
    },
    {
      key: 'skipped_states',
      iconClass: 'icon-warning',
      label: 'Skipped States',
      description: 'Missing critical intermediate states in the shipment flow',
      color: '#38a169'
    },
    {
      key: 'no_events',
      iconClass: 'icon-empty',
      label: 'No Events',
      description: 'Shipments with no tracking events recorded',
      color: '#c62828'
    },
    {
      key: 'invalid_start_state',
      iconClass: 'icon-blocked',
      label: 'Invalid Start State',
      description: 'Shipments beginning with an incorrect initial status',
      color: '#e91e63'
    }
  ];

  const getPercentage = (value, total) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
  };

  const successRate = getPercentage(summary.valid_shipments, summary.total_shipments);
  const errorRate = getPercentage(summary.invalid_shipments, summary.total_shipments);
  const validationStatus = successRate >= 90 ? 'excellent' : successRate >= 70 ? 'good' : successRate >= 50 ? 'fair' : 'poor';

  return (
    <div className="validation-summary">
      <div className="summary-header">
        <div className="header-content-wrapper">
          <div className="header-left">
            <div className="report-badge">
              <span className="badge-dot"></span>
              <span className="badge-label">Validation Report</span>
            </div>
            <h2>Shipment Analysis Dashboard</h2>
            <p className="header-subtitle">
              <span className="subtitle-icon icon-chart-bar"></span>
              Analyzed {summary.total_shipments} shipments • Generated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="header-right">
            <div className={`status-indicator status-${validationStatus}`}>
              <div className="status-ring">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" className="status-ring-bg"></circle>
                  <circle cx="50" cy="50" r="45" className="status-ring-progress" 
                    style={{ strokeDashoffset: `${283 - (283 * successRate) / 100}` }}></circle>
                </svg>
                <div className="status-value">{successRate}%</div>
              </div>
              <div className="status-label">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="summary-metrics">
        <div className="metrics-grid">
          <div className="metric-card-simple primary">
            <div className="metric-icon-simple icon-box"></div>
            <div className="metric-value-simple">{summary.total_shipments}</div>
            <div className="metric-label-simple">Total Shipments</div>
            <div className="metric-tag-simple">OVERVIEW</div>
          </div>
          
          <div className="metric-card-simple success">
            <div className="metric-icon-simple icon-check"></div>
            <div className="metric-badge"><span className="arrow-up"></span>{successRate}%</div>
            <div className="metric-value-simple">{summary.valid_shipments}</div>
            <div className="metric-label-simple">Valid Shipments</div>
          </div>
          
          <div className="metric-card-simple error">
            <div className="metric-icon-simple icon-cross"></div>
            <div className="metric-badge error-badge"><span className="arrow-down"></span>{errorRate}%</div>
            <div className="metric-value-simple">{summary.invalid_shipments}</div>
            <div className="metric-label-simple">Invalid Shipments</div>
          </div>
          
          <div className="metric-card-simple warning">
            <div className="metric-icon-simple icon-alert"></div>
            <div className="metric-value-simple">{summary.anomalies_detected}</div>
            <div className="metric-label-simple">Issues Found</div>
            <div className={`metric-tag-simple ${summary.anomalies_detected > 0 ? 'alert' : 'success-tag'}`}>
              {summary.anomalies_detected > 0 ? 'ACTION REQUIRED' : 'ALL CLEAR'}
            </div>
          </div>
        </div>
      </div>

      {summary.anomalies_detected > 0 && (
          <div className="anomaly-breakdown">
          <div className="breakdown-header">
            <h3 className="breakdown-title">Anomaly Breakdown</h3>
            <p className="breakdown-subtitle">Detailed insights into {summary.anomalies_detected} detected issues</p>
          </div>
          <div className="anomaly-grid">
            {anomalyTypes.map(anomaly => {
              const count = anomaly_summary[anomaly.key];
              if (count === 0) return null;
              
              const percentage = ((count / summary.anomalies_detected) * 100).toFixed(1);
              
              return (
                <div key={anomaly.key} className="anomaly-card" style={{ '--accent-color': anomaly.color }}>
                  <div className="anomaly-card-header">
                    <div className={`anomaly-icon ${anomaly.iconClass}`}></div>
                    <div className="anomaly-stats">
                      <div className="anomaly-count-large">{count}</div>
                      <div className="anomaly-percentage">{percentage}%</div>
                    </div>
                  </div>
                  <div className="anomaly-card-body">
                    <h4 className="anomaly-title">{anomaly.label}</h4>
                    <p className="anomaly-description">{anomaly.description}</p>
                  </div>
                  <div className="anomaly-progress-bar">
                    <div className="anomaly-progress-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {summary.anomalies_detected === 0 && (
        <div className="no-anomalies">
          <div className="success-icon icon-success"></div>
          <h3>All Clear!</h3>
          <p>No anomalies detected in the shipment data. All tracking events are valid and follow the correct state transitions.</p>
        </div>
      )}
    </div>
  );
});

ValidationSummary.displayName = 'ValidationSummary';

export default ValidationSummary;
