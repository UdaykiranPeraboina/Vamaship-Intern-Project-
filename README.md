# 🚢 Shipment Status Validator
### Vamship SDE Intern Assignment | Uday Kiran Peraboina


**A production-ready web application for intelligent shipment validation and anomaly detection in logistics operations**


## 🚀 How to Use the Application

### Step-by-Step Guide

#### 1️⃣ **Start the Application**
```bash
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173`



#### 2️⃣ **Upload Shipment Data**
- Click the **"📂 Upload JSON File"** button in the center of the screen
- Or **drag and drop** your JSON file directly onto the upload area
- The file must be in JSON format (`.json` extension)



#### 3️⃣ **View Validation Dashboard**
After upload, you'll see:
- **📊 Total Shipments**: Count of all shipments processed
- **✅ Valid Shipments**: Shipments with no anomalies detected
- **❌ Invalid Shipments**: Shipments with validation issues
- **📈 Success Rate**: Visual progress bar showing validation percentage

#### 4️⃣ **Analyze Anomaly Breakdown**
The dashboard displays categorized anomaly counts:
- **Invalid Transitions**: Status changes that violate business rules
- **Missing Statuses**: Gaps in the expected workflow sequence
- **Timestamp Issues**: Out-of-order events or duplicate timestamps
- **Location Anomalies**: Invalid location changes during transit




#### 5️⃣ **Explore Detailed Results**
- Scroll down to the **Shipment Results** table
- **Green rows** = Valid shipments with no issues
- **Red rows** = Invalid shipments with detected anomalies
- **Click any row** to expand and view:
  - Complete status history with timestamps and locations
  - List of all detected anomalies with descriptions
  - Color-coded status indicators

## 🎯 Project Overview

This project is developed as part of the **Vamship SDE Internship Assignment** to demonstrate proficiency in:
- Building scalable React applications with modern best practices
- Implementing complex business logic (state machines, anomaly detection)
- Creating intuitive, professional user interfaces
- Writing clean, maintainable, and well-documented code



### Problem Statement
Validate shipment status transitions in a logistics system, detect anomalies, and provide actionable insights through an interactive dashboard.



### Solution Delivered
A comprehensive web application featuring:
- **Smart Validation Engine**: Multi-layered anomaly detection with 40+ status codes
- **Professional UI/UX**: Responsive dashboard with real-time metrics and detailed breakdowns
- **Production-Ready Code**: Optimized performance, error handling, and scalability



---

## ✨ Key Features

### 🔍 Intelligent Validation System
- **State Machine Logic**: Enforces valid status transitions based on logistics workflow rules
- **40+ Status Codes**: Complete coverage from ORDER_PLACED to DELIVERED/RETURNED
- **Multi-Layer Anomaly Detection**:
  - ❌ Invalid state transitions
  - ⚠️ Missing intermediate statuses
  - ⏰ Timestamp inconsistencies (out-of-order, duplicates)
  - 📍 Location tracking anomalies
  - 🔄 Logical workflow violations


### 🎨 Professional User Interface
- **Interactive Dashboard**: Real-time metrics with validation success rate
- **Anomaly Breakdown**: Categorized view of all detected issues
- **Expandable Results**: Detailed shipment history with color-coded status indicators
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Modern Aesthetics**: Professional minimal icons, gradient cards, smooth animations



### ⚡ Performance & Quality
- **Optimized Rendering**: React.memo, useMemo, useCallback for minimal re-renders
- **GPU Acceleration**: CSS transforms for smooth 60fps animations
- **Error Handling**: Comprehensive validation with user-friendly error messages
- **Code Quality**: ESLint configured, modular architecture, clear separation of concerns

---



#### 6️⃣ **Test with Sample Data**
Use the provided `sample_shipments.json` file in the `shipment-status-validator/` folder:
```bash
# File location: shipment-status-validator/sample_shipments.json
```

### 📝 Input JSON Format

```json
{
  "shipments": [
    {
      "shipment_id": "SH001",
      "statuses": [
        {
          "status_code": "ORDER_PLACED",
          "timestamp": "2024-01-01T10:00:00Z",
          "location": "Mumbai"
        },
        {
          "status_code": "SHIPPED",
          "timestamp": "2024-01-02T14:30:00Z",
          "location": "Mumbai_Hub"
        },
        {
          "status_code": "DELIVERED",
          "timestamp": "2024-01-05T09:15:00Z",
          "location": "Delhi"
        }
      ]
    }
  ]
}
```

