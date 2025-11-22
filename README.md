# Shipment Status Validator - React Application

A comprehensive React-based web application for validating shipment tracking event sequences against a state machine, detecting anomalies, and generating detailed validation reports.

## 🚀 Features

- **State Machine Validation**: Validates tracking event sequences against predefined state transition rules
- **Anomaly Detection**:
  - Invalid state transitions
  - Time-based anomalies (chronological order, future-dated events)
  - Duplicate events
  - Skipped critical states
- **Interactive UI**: User-friendly interface with file upload and real-time validation
- **Detailed Reports**: Comprehensive validation reports with summary statistics
- **Export Functionality**: Download validation reports as JSON
- **Sample Data**: Load pre-configured sample data for testing

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🔧 Installation & Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd shipment-status-validator-assignment
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## 📖 How to Use

### Option 1: Upload Your Own JSON File
1. Click the "Choose JSON File" button
2. Select a JSON file containing shipment data
3. The application will automatically validate and display results

### Option 2: Load Sample Data
1. Click the "Load Sample Data" button
2. The application will load and validate the provided sample shipments

### Viewing Results
- **Summary Cards**: View overall statistics (total, valid, invalid shipments, anomalies)
- **Anomaly Breakdown**: See counts of different anomaly types
- **Shipment Details**: 
  - Filter by all/valid/invalid shipments
  - Click on any shipment to expand and view detailed anomalies
  - Each anomaly shows type, message, and location in the event sequence
- **Export**: Click "Export Results (JSON)" to download the full validation report

## 📊 Input Format

The application expects a JSON array of shipment objects:

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
      }
    ]
  }
]
```

## 🧠 Validation Logic

### State Machine Rules

1. **Valid Starting States**: Shipments must start with status code `1000` (Booking Pending) or `1010` (Shipment Booked)

2. **Terminal States**: No transitions allowed after reaching:
   - `1900` (Delivered) - except to `2000` (RTO Initiated)
   - `2030` (RTO Delivered)
   - `8000` (Tracking Closed)
   - `1250` (Shipment Cancelled)
   - `1050` (Pickup Cancelled)

3. **Valid Transitions**: The application enforces a comprehensive state machine with predefined valid transitions between status codes

### Anomaly Detection

1. **Invalid State Transitions**: Detects transitions not allowed by the state machine
2. **Time Anomalies**:
   - Events with timestamps before previous events
   - Future-dated events (timestamps after current date/time)
3. **Duplicate Events**: Same status code appearing multiple times
4. **Skipped States**: Critical states missing from the sequence (e.g., delivered without "Out for Delivery")

## 🏗️ Project Structure

```
src/
├── components/
│   ├── FileUpload.jsx          # File upload component
│   ├── FileUpload.css
│   ├── ValidationSummary.jsx   # Summary statistics component
│   ├── ValidationSummary.css
│   ├── ShipmentResults.jsx     # Detailed results component
│   └── ShipmentResults.css
├── utils/
│   ├── statusCodes.js          # Status code definitions
│   ├── stateMachine.js         # State transition validation
│   ├── anomalyDetector.js      # Anomaly detection logic
│   └── validator.js            # Main validation orchestrator
├── App.jsx                     # Main application component
├── App.css
├── main.jsx                    # Application entry point
└── index.css
```

## 🔍 Approach & Design Decisions

### Architecture

The application follows a modular architecture with clear separation of concerns:

1. **Utility Layer** (`utils/`): Contains pure validation logic, completely decoupled from the UI
   - `statusCodes.js`: Centralized status code definitions and helpers
   - `stateMachine.js`: State transition validation using a predefined transition map
   - `anomalyDetector.js`: Specialized detectors for different anomaly types
   - `validator.js`: Orchestrates all validation logic and generates reports

2. **Component Layer** (`components/`): Reusable React components for UI
   - `FileUpload`: Handles file input and sample data loading
   - `ValidationSummary`: Displays high-level statistics
   - `ShipmentResults`: Shows detailed per-shipment results with expand/collapse

3. **Application Layer**: `App.jsx` coordinates data flow between components

### Key Design Decisions

1. **State Machine as Data Structure**: Transitions are defined as a JavaScript object for easy lookup and maintenance. This makes it simple to add or modify rules without changing the validation logic.

2. **Modular Anomaly Detection**: Each type of anomaly (time, duplicate, skipped states) has its own detector function. They can be enabled/disabled independently.

3. **Performance**: Validation runs in O(n) time where n is the number of events, with efficient lookups for state transitions.

4. **User Experience**:
   - Loading states for better feedback
   - Expandable shipment details to avoid overwhelming users
   - Color-coded status indicators for quick identification
   - Export functionality for further analysis

5. **Error Handling**: Graceful handling of malformed data with user-friendly error messages

### Validation Flow

```
Input JSON → Parse → Iterate Shipments → For Each Shipment:
  1. Validate event sequence (state machine)
  2. Detect time anomalies
  3. Detect duplicates
  4. Detect skipped states
  → Combine anomalies → Generate report
```

## 📝 Sample Output

The validation generates a comprehensive report:

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
      "current_status_name": "Delivered",
      "event_count": 5,
      "anomalies": []
    },
    {
      "shipment_no": "SHIP002",
      "tracking_id": "AWB789012",
      "status": "invalid",
      "current_status": 1220,
      "current_status_name": "Shipment In-Transit",
      "event_count": 3,
      "anomalies": [
        {
          "type": "invalid_transition",
          "from_status": 1900,
          "to_status": 1220,
          "message": "Cannot transition from terminal state...",
          "event_index": 2
        }
      ]
    }
  ],
  "anomaly_summary": {
    "invalid_transitions": 2,
    "time_anomalies": 1,
    "duplicate_events": 0,
    "skipped_states": 0,
    "no_events": 0,
    "invalid_start_state": 0
  }
}
```

## 🧪 Testing with Sample Data

The provided `sample_shipments.json` includes various test cases:
- Valid shipment flows
- Invalid state transitions
- Time anomalies
- Terminal state violations
- RTO (Return to Origin) flows
- Cancelled shipments
- Empty events
- Single events
- Skipped states

## 🛠️ Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 🚀 Technologies Used

- **React 18**: Modern UI library
- **Vite**: Fast build tool and dev server
- **JavaScript (ES6+)**: Modern JavaScript features
- **CSS3**: Custom styling with gradients and animations

## 💡 Future Enhancements

- Add authentication for multi-user support
- Database integration for storing validation history
- Real-time validation via API
- Configurable validation rules via UI
- More detailed analytics and charts
- Batch processing for large files
- CSV export in addition to JSON

## 📄 License

This project is part of an assignment submission.

## 👤 Author

SDE Intern Assignment - Shipment Status Validator

---

For questions or issues, please refer to the assignment documentation in the `shipment-status-validator` folder.
