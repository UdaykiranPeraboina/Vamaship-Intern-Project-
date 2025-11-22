/**
 * Detect time-based anomalies in tracking events
 * @param {Array} events - Array of tracking events
 * @returns {Array} - Array of time anomalies found
 */
export const detectTimeAnomalies = (events) => {
  const anomalies = [];

  if (!events || events.length === 0) {
    return anomalies;
  }

  const currentTime = new Date();

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const eventTime = new Date(event.timestamp);

    // Check if timestamp is valid
    if (isNaN(eventTime.getTime())) {
      anomalies.push({
        type: 'invalid_timestamp',
        message: `Invalid timestamp format: ${event.timestamp}`,
        event_index: i,
      });
      continue;
    }

    // Check if event is in the future
    if (eventTime > currentTime) {
      anomalies.push({
        type: 'time_anomaly',
        message: `Event timestamp is in the future: ${event.timestamp}`,
        event_index: i,
        timestamp: event.timestamp,
      });
    }

    // Check chronological order (compare with previous event)
    if (i > 0) {
      const prevEvent = events[i - 1];
      const prevEventTime = new Date(prevEvent.timestamp);

      if (!isNaN(prevEventTime.getTime()) && eventTime < prevEventTime) {
        anomalies.push({
          type: 'time_anomaly',
          message: `Event timestamp (${event.timestamp}) is before previous event (${prevEvent.timestamp})`,
          event_index: i,
          timestamp: event.timestamp,
          previous_timestamp: prevEvent.timestamp,
        });
      }
    }
  }

  return anomalies;
};

/**
 * Detect duplicate events (same status code appearing multiple times)
 * @param {Array} events - Array of tracking events
 * @returns {Array} - Array of duplicate anomalies found
 */
export const detectDuplicateEvents = (events) => {
  const anomalies = [];
  const seenStatuses = new Map();

  if (!events || events.length === 0) {
    return anomalies;
  }

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const statusCode = event.status_code;

    if (seenStatuses.has(statusCode)) {
      const firstIndex = seenStatuses.get(statusCode);
      anomalies.push({
        type: 'duplicate_event',
        status_code: statusCode,
        message: `Duplicate status code ${statusCode} (${event.status_name}). First seen at index ${firstIndex}, repeated at index ${i}`,
        event_index: i,
        first_occurrence_index: firstIndex,
      });
    } else {
      seenStatuses.set(statusCode, i);
    }
  }

  return anomalies;
};

/**
 * Detect if shipment skipped critical states
 * @param {Array} events - Array of tracking events
 * @returns {Array} - Array of skipped state anomalies
 */
export const detectSkippedStates = (events) => {
  const anomalies = [];

  if (!events || events.length === 0) {
    return anomalies;
  }

  const statusCodes = events.map(e => e.status_code);

  // Check if delivered (1900) without "Out for Delivery" (1700)
  if (statusCodes.includes(1900) && !statusCodes.includes(1700)) {
    const deliveredIndex = statusCodes.indexOf(1900);
    anomalies.push({
      type: 'skipped_state',
      message: `Shipment delivered without "Out for Delivery" (1700) status`,
      missing_status: 1700,
      missing_status_name: 'Shipment Out for Delivery',
      event_index: deliveredIndex,
    });
  }

  // Check if delivered without "In-Transit" (1220)
  if (statusCodes.includes(1900) && !statusCodes.includes(1220)) {
    const deliveredIndex = statusCodes.indexOf(1900);
    anomalies.push({
      type: 'skipped_state',
      message: `Shipment delivered without "In-Transit" (1220) status`,
      missing_status: 1220,
      missing_status_name: 'Shipment In-Transit',
      event_index: deliveredIndex,
    });
  }

  // Check if delivered without "Picked Up" (1200)
  if (statusCodes.includes(1900) && !statusCodes.includes(1200)) {
    const deliveredIndex = statusCodes.indexOf(1900);
    anomalies.push({
      type: 'skipped_state',
      message: `Shipment delivered without "Picked Up from Origin" (1200) status`,
      missing_status: 1200,
      missing_status_name: 'Picked Up from Origin',
      event_index: deliveredIndex,
    });
  }

  return anomalies;
};

/**
 * Combine all anomaly detection methods
 * @param {Array} events - Array of tracking events
 * @returns {Array} - All anomalies found
 */
export const detectAllAnomalies = (events) => {
  const timeAnomalies = detectTimeAnomalies(events);
  const duplicateAnomalies = detectDuplicateEvents(events);
  const skippedStateAnomalies = detectSkippedStates(events);

  return [...timeAnomalies, ...duplicateAnomalies, ...skippedStateAnomalies];
};
