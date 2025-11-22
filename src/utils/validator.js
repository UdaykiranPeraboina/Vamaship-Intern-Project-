import { validateEventSequence } from './stateMachine.js';
import { detectAllAnomalies } from './anomalyDetector.js';

/**
 * Validate a single shipment
 * @param {Object} shipment - Shipment object with tracking events
 * @returns {Object} - Validation result
 */
export const validateShipment = (shipment) => {
  const { shipment_no, tracking_id, tracking_events } = shipment;

  // Handle empty or missing events
  if (!tracking_events || tracking_events.length === 0) {
    return {
      shipment_no,
      tracking_id,
      status: 'invalid',
      current_status: null,
      current_status_name: null,
      anomalies: [
        {
          type: 'no_events',
          message: 'Shipment has no tracking events',
        },
      ],
    };
  }

  // Validate state transitions
  const transitionAnomalies = validateEventSequence(tracking_events);

  // Detect other anomalies (time, duplicates, skipped states)
  const otherAnomalies = detectAllAnomalies(tracking_events);

  // Combine all anomalies
  const allAnomalies = [...transitionAnomalies, ...otherAnomalies];

  // Get current status (last event)
  const currentEvent = tracking_events[tracking_events.length - 1];

  return {
    shipment_no,
    tracking_id,
    status: allAnomalies.length === 0 ? 'valid' : 'invalid',
    current_status: currentEvent.status_code,
    current_status_name: currentEvent.status_name,
    event_count: tracking_events.length,
    anomalies: allAnomalies,
  };
};

/**
 * Validate multiple shipments
 * @param {Array} shipments - Array of shipment objects
 * @returns {Object} - Validation report
 */
export const validateShipments = (shipments) => {
  const validatedShipments = shipments.map(validateShipment);

  const validShipments = validatedShipments.filter(s => s.status === 'valid');
  const invalidShipments = validatedShipments.filter(s => s.status === 'invalid');

  // Count anomaly types
  const anomalyCounts = {
    invalid_transitions: 0,
    time_anomalies: 0,
    duplicate_events: 0,
    skipped_states: 0,
    no_events: 0,
    invalid_start_state: 0,
    other: 0,
  };

  validatedShipments.forEach(shipment => {
    shipment.anomalies.forEach(anomaly => {
      if (anomaly.type === 'invalid_transition') {
        anomalyCounts.invalid_transitions++;
      } else if (anomaly.type === 'time_anomaly') {
        anomalyCounts.time_anomalies++;
      } else if (anomaly.type === 'duplicate_event') {
        anomalyCounts.duplicate_events++;
      } else if (anomaly.type === 'skipped_state') {
        anomalyCounts.skipped_states++;
      } else if (anomaly.type === 'no_events') {
        anomalyCounts.no_events++;
      } else if (anomaly.type === 'invalid_start_state') {
        anomalyCounts.invalid_start_state++;
      } else {
        anomalyCounts.other++;
      }
    });
  });

  const totalAnomalies = Object.values(anomalyCounts).reduce((sum, count) => sum + count, 0);

  return {
    summary: {
      total_shipments: shipments.length,
      valid_shipments: validShipments.length,
      invalid_shipments: invalidShipments.length,
      anomalies_detected: totalAnomalies,
    },
    shipments: validatedShipments,
    anomaly_summary: anomalyCounts,
  };
};
