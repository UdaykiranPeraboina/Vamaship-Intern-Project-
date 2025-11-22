// Status code definitions
export const STATUS_CODES = {
  // Booking & Initial Phase
  1000: "Booking Pending",
  1010: "Shipment Booked",
  1011: "Dead Status",
  1020: "Shipment Manifested",
  1025: "Cancel Requested",
  1039: "Missed Pickup",
  1050: "Pickup Cancelled",
  1070: "Pickup Scheduled",
  1083: "Pickup Re-scheduled",
  1100: "Out for Pickup",

  // Pickup & Transit Phase
  1200: "Picked Up from Origin",
  1220: "Shipment In-Transit",
  1250: "Shipment Cancelled",
  1280: "Received at Origin Hub",
  1300: "Shipment On-Hold",
  1400: "Received at Destination Hub",

  // Exception & Problem States
  1440: "Shipment Misrouted",
  1500: "Shipment Lost",
  1550: "Shipment Damaged",
  1560: "Unexpected Challenge",
  1570: "Address Incorrect",
  1616: "Delay in Delivery expected",

  // Delivery Phase
  1700: "Shipment Out for Delivery",
  1770: "Delivery Attempt Failed",
  1800: "Partial Delivery",
  1850: "Pending",
  1880: "Contact Customer Support",
  1900: "Delivered",

  // RTO (Return to Origin) Phase
  2000: "RTO Initiated",
  2020: "RTP In Transit",
  2025: "RTO Exception",
  2030: "RTO Delivered",

  // Terminal State
  8000: "Tracking Closed",
};

// Terminal states - no further transitions allowed
export const TERMINAL_STATES = [1900, 2030, 8000, 1250, 1050];

// Valid starting states
export const VALID_START_STATES = [1000, 1010];

// State progression groups for validation
export const STATE_GROUPS = {
  BOOKING: [1000, 1010, 1011, 1020, 1025, 1039, 1050, 1070, 1083, 1100],
  PICKUP_TRANSIT: [1200, 1220, 1250, 1280, 1300, 1400],
  EXCEPTIONS: [1440, 1500, 1550, 1560, 1570, 1616],
  DELIVERY: [1700, 1770, 1800, 1850, 1880, 1900],
  RTO: [2000, 2020, 2025, 2030],
  TERMINAL: [8000],
};

// Get status name by code
export const getStatusName = (code) => {
  return STATUS_CODES[code] || `Unknown Status (${code})`;
};

// Check if status is terminal
export const isTerminalState = (statusCode) => {
  return TERMINAL_STATES.includes(statusCode);
};

// Check if status is valid starting state
export const isValidStartState = (statusCode) => {
  return VALID_START_STATES.includes(statusCode);
};
