# SDE Intern Assignment: Shipment Status Validator

## Problem Statement
Build a Shipment Status Validator that validates tracking event sequences against a simple state machine. This helps ensure shipments follow valid state transitions in logistics systems.

## What You Need to Build
Create a validation tool that:
- Validates tracking event sequences against a state machine
- Detects invalid state transitions
- Checks for time-based anomalies
- Generates a validation report

## Requirements

### 1. Input Format
You'll receive shipment tracking data as JSON:

**File: shipments.json** - Array of shipments with tracking events

```json
[
  {
    "shipment_no": "SHIP001",
    "tracking_id": "AWB123456",
    "origin_pincode": "400001",
    "destination_pincode": "110001",
    "created_at": "2024-01-15T10:00:00Z",
    "tracking_events": [
      {
        "status_code": 1010,
        "status_name": "Shipment Booked",
        "timestamp": "2024-01-15T10:00:00Z",
        "location": "Mumbai",
        "comment": "Shipment created"
      },
      {
        "status_code": 1200,
        "status_name": "Picked Up from Origin",
        "timestamp": "2024-01-15T14:30:00Z",
        "location": "Mumbai",
        "comment": "Picked up by courier"
      },
      {
        "status_code": 1220,
        "status_name": "Shipment In-Transit",
        "timestamp": "2024-01-16T08:00:00Z",
        "location": "Delhi Hub",
        "comment": "In transit to destination"
      },
      {
        "status_code": 1700,
        "status_name": "Shipment Out for Delivery",
        "timestamp": "2024-01-17T09:00:00Z",
        "location": "Delhi",
        "comment": "Out for delivery"
      },
      {
        "status_code": 1900,
        "status_name": "Delivered",
        "timestamp": "2024-01-17T15:30:00Z",
        "location": "Delhi",
        "comment": "Delivered successfully"
      }
    ]
  }
]
```

### 2. Status Code Reference
Complete status codes and their meanings:

**Booking & Initial Phase:**
- `1000` => "Booking Pending"
- `1010` => "Shipment Booked" (common starting state)
- `1011` => "Dead Status"
- `1020` => "Shipment Manifested"
- `1025` => "Cancel Requested"
- `1039` => "Missed Pickup"
- `1050` => "Pickup Cancelled" (terminal state)
- `1070` => "Pickup Scheduled"
- `1083` => "Pickup Re-scheduled"
- `1100` => "Out for Pickup"

**Pickup & Transit Phase:**
- `1200` => "Picked Up from Origin"
- `1220` => "Shipment In-Transit"
- `1250` => "Shipment Cancelled" (terminal state)
- `1280` => "Received at Origin Hub"
- `1300` => "Shipment On-Hold"
- `1400` => "Received at Destination Hub"

**Exception & Problem States:**
- `1440` => "Shipment Misrouted"
- `1500` => "Shipment Lost"
- `1550` => "Shipment Damaged"
- `1560` => "Unexpected Challenge"
- `1570` => "Address Incorrect"
- `1616` => "Delay in Delivery expected"

**Delivery Phase:**
- `1700` => "Shipment Out for Delivery"
- `1770` => "Delivery Attempt Failed"
- `1800` => "Partial Delivery"
- `1850` => "Pending"
- `1880` => "Contact Customer Support"
- `1900` => "Delivered" (terminal state)

**RTO (Return to Origin) Phase:**
- `2000` => "RTO Initiated" (can only occur after 1900)
- `2020` => "RTP In Transit"
- `2025` => "RTO Exception"
- `2030` => "RTO Delivered" (terminal state)

**Terminal State:**
- `8000` => "Tracking Closed" (terminal state)

**Terminal/Closed Statuses** (no further transitions allowed):
- `1900` (Delivered)
- `2030` (RTO Delivered)
- `8000` (Tracking Closed)
- `1250` (Shipment Cancelled)
- `1050` (Pickup Cancelled)

### 3. Core Functionality

#### A. State Machine Validation
Implement a state machine that validates:
- **Valid transitions**: Can a shipment move from status A to status B?
- **Invalid sequences**: Detect impossible or illogical transitions

**Valid Transition Rules:**
1. Shipment must start with `1010` (Shipment Booked) or `1000` (Booking Pending)
2. Cannot go backwards (e.g., `1900` → `1220` is invalid)
3. Terminal states (`1900`, `2030`, `8000`, `1250`, `1050`) cannot have subsequent events
4. RTO flow: `1900` → `2000` → `2020` → `2030` is valid
5. Cancellation (`1250`) can happen from any state except terminal states
6. Pickup Cancellation (`1050`) is a terminal state

**Valid Flow Example:**
```
1010 (Booked) → 1200 (Picked Up) → 1220 (In-Transit) → 1700 (Out for Delivery) → 1900 (Delivered)
```

#### B. Anomaly Detection
Detect and flag:

1. **Invalid State Transitions**
   - Example: `1900` (Delivered) → `1220` (In-Transit)
   - Example: `1250` (Cancelled) → `1900` (Delivered)
   - Example: `8000` (Tracking Closed) → any other status
   - Example: `1050` (Pickup Cancelled) → any other status

2. **Time-based Anomalies**
   - Events out of chronological order (timestamp before previous event)
   - Future-dated events (timestamp after current time)

#### C. Validation Report
Generate a JSON report:

```json
{
  "summary": {
    "total_shipments": 10,
    "valid_shipments": 8,
    "invalid_shipments": 2,
    "anomalies_detected": 3
  },
  "shipments": [
    {
      "shipment_no": "SHIP001",
      "tracking_id": "AWB123456",
      "status": "valid",
      "current_status": 1900,
      "anomalies": []
    },
    {
      "shipment_no": "SHIP002",
      "tracking_id": "AWB789012",
      "status": "invalid",
      "current_status": 1900,
      "anomalies": [
        {
          "type": "invalid_transition",
          "from_status": 1900,
          "to_status": 1220,
          "message": "Cannot transition from Delivered to In-Transit",
          "event_index": 5
        },
        {
          "type": "time_anomaly",
          "message": "Event timestamp is before previous event",
          "event_index": 3
        }
      ]
    }
  ],
  "anomaly_summary": {
    "invalid_transitions": 2,
    "time_anomalies": 1
  }
}
```

### 4. Technical Requirements
- **Language**: Any language of you choice (PHP 8.0+ prefered)
- **No external dependencies**: Use only standard library
- **Command-line interface**: 
  ```bash
  php validate_shipments.php shipments.json output.json
  ```
- **Performance**: Handle files with up to 1,000 shipments efficiently
- **Error handling**: Graceful handling of malformed data

### 5. Bonus Features (Optional)
- Detect duplicate events (same status code appearing multiple times)
- Validate that shipments don't skip critical states (e.g., Delivered without "Out for Delivery")
- Handle edge cases: empty events, single event, all same status

## Evaluation Criteria
- **Correctness (50%)**: Correctly validates state transitions and detects anomalies
- **Code Quality (30%)**: Clean, readable, well-structured code
- **Edge Case Handling (15%)**: Handles duplicates, missing data, malformed input
- **Documentation (5%)**: Clear README explaining approach

## Sample Test Cases
Your solution should handle:

1. **Valid Flow**: `1010` → `1200` → `1220` → `1700` → `1900`
2. **Invalid Backward Transition**: `1900` → `1220`
3. **Time Anomaly**: Event timestamp before previous event
4. **Terminal State with Updates**: `1900`, `2030`, `8000`, `1250`, or `1050` followed by another event
5. **RTO Flow**: `1900` → `2000` → `2020` → `2030`
6. **Cancelled Shipment**: `1010` → `1200` → `1250`
7. **Empty Events**: Shipment with no tracking events
8. **Single Event**: Shipment with only one event

## Deliverables
1. **Source code** (all files)
2. **README.md** with:
   - How to set up and run
   - Assumptions made
   - Sample output (JSON report for provided sample data)
   - Brief explanation (1-2 paragraphs) of your approach

## Timeline
- **Duration**: 3-5 days
- **Submission**: GitHub repository or zip file

## Hints
- Model the state machine as a map/dictionary for valid transitions
- Validate chronological order first
- Consider terminal states carefully
- Think about what makes a transition "valid" vs "invalid"
- Handle edge cases: empty events, single event, all same status

