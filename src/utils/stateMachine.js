import { isTerminalState, isValidStartState } from './statusCodes.js';

/**
 * Defines valid state transitions
 * Key: from_status_code
 * Value: array of valid to_status_codes
 */
const STATE_TRANSITIONS = {
  // Booking & Initial Phase
  1000: [1010, 1011, 1020, 1050, 1250], // Booking Pending
  1010: [1020, 1025, 1039, 1050, 1070, 1083, 1100, 1200, 1250, 1280], // Shipment Booked
  1011: [1050, 1250], // Dead Status
  1020: [1025, 1039, 1050, 1070, 1083, 1100, 1200, 1250, 1280], // Shipment Manifested
  1025: [1050, 1250], // Cancel Requested
  1039: [1050, 1070, 1083, 1100, 1200, 1250], // Missed Pickup
  1050: [], // Pickup Cancelled (terminal)
  1070: [1039, 1050, 1083, 1100, 1200, 1250], // Pickup Scheduled
  1083: [1039, 1050, 1100, 1200, 1250], // Pickup Re-scheduled
  1100: [1039, 1050, 1200, 1250], // Out for Pickup

  // Pickup & Transit Phase
  1200: [1220, 1250, 1280, 1300, 1400], // Picked Up from Origin
  1220: [1250, 1300, 1400, 1440, 1500, 1550, 1560, 1570, 1616, 1700], // Shipment In-Transit
  1250: [], // Shipment Cancelled (terminal)
  1280: [1220, 1250, 1300, 1400], // Received at Origin Hub
  1300: [1220, 1250, 1400, 1440, 1500, 1550, 1560, 1570], // Shipment On-Hold
  1400: [1250, 1300, 1440, 1500, 1550, 1560, 1570, 1616, 1700], // Received at Destination Hub

  // Exception & Problem States
  1440: [1220, 1250, 1300, 1400, 1500, 1550, 1700], // Shipment Misrouted
  1500: [1250], // Shipment Lost
  1550: [1250, 1700, 1900], // Shipment Damaged
  1560: [1220, 1250, 1300, 1400, 1700, 1770], // Unexpected Challenge
  1570: [1250, 1300, 1700, 1770], // Address Incorrect
  1616: [1250, 1700], // Delay in Delivery expected

  // Delivery Phase
  1700: [1250, 1770, 1800, 1850, 1880, 1900], // Shipment Out for Delivery
  1770: [1700, 1850, 1880, 1900, 2000], // Delivery Attempt Failed
  1800: [1900, 2000], // Partial Delivery
  1850: [1700, 1770, 1880, 1900], // Pending
  1880: [1700, 1770, 1900, 2000], // Contact Customer Support
  1900: [2000], // Delivered (can only go to RTO)

  // RTO (Return to Origin) Phase
  2000: [2020, 2025, 2030], // RTO Initiated
  2020: [2025, 2030], // RTP In Transit
  2025: [2020, 2030], // RTO Exception
  2030: [], // RTO Delivered (terminal)

  // Terminal State
  8000: [], // Tracking Closed (terminal)
};

/**
 * Check if a transition from one status to another is valid
 * @param {number} fromStatus - Current status code
 * @param {number} toStatus - Next status code
 * @returns {boolean} - True if transition is valid
 */
export const isValidTransition = (fromStatus, toStatus) => {
  // Terminal states cannot have any transitions
  if (isTerminalState(fromStatus)) {
    return false;
  }

  // Cancellation can happen from most states except terminals
  if (toStatus === 1250 && !isTerminalState(fromStatus)) {
    return true;
  }

  // Check if the transition is defined in the state machine
  const validNextStates = STATE_TRANSITIONS[fromStatus] || [];
  return validNextStates.includes(toStatus);
};

/**
 * Validate the entire sequence of tracking events
 * @param {Array} events - Array of tracking events
 * @returns {Array} - Array of anomalies found
 */
export const validateEventSequence = (events) => {
  const anomalies = [];

  if (!events || events.length === 0) {
    return anomalies;
  }

  // Check if first event has valid starting state
  const firstEvent = events[0];
  if (!isValidStartState(firstEvent.status_code)) {
    anomalies.push({
      type: 'invalid_start_state',
      status_code: firstEvent.status_code,
      message: `Invalid starting status: ${firstEvent.status_name || firstEvent.status_code}. Must start with 1000 or 1010.`,
      event_index: 0,
    });
  }

  // Validate each transition
  for (let i = 1; i < events.length; i++) {
    const fromEvent = events[i - 1];
    const toEvent = events[i];

    if (!isValidTransition(fromEvent.status_code, toEvent.status_code)) {
      // Check if it's because of terminal state
      if (isTerminalState(fromEvent.status_code)) {
        anomalies.push({
          type: 'invalid_transition',
          from_status: fromEvent.status_code,
          to_status: toEvent.status_code,
          message: `Cannot transition from terminal state "${fromEvent.status_name}" (${fromEvent.status_code}) to "${toEvent.status_name}" (${toEvent.status_code})`,
          event_index: i,
        });
      } else {
        anomalies.push({
          type: 'invalid_transition',
          from_status: fromEvent.status_code,
          to_status: toEvent.status_code,
          message: `Invalid transition from "${fromEvent.status_name}" (${fromEvent.status_code}) to "${toEvent.status_name}" (${toEvent.status_code})`,
          event_index: i,
        });
      }
    }
  }

  return anomalies;
};
