# DADU GatePass System

## Overview

DADU GatePass is a role-based digital gate pass management system designed for educational institutions and campuses. The system supports permanent residents, temporary visitors, conference participants, faculty members, security personnel, and approving authorities through a unified workflow.

The project was developed as part of the DADU Hackathon challenge to create a robust, scalable, and secure gate pass ecosystem that can be integrated with existing campus services.

---
## Team Credentials for Testing

The following accounts have been pre-configured for testing the complete role-based workflow.

| Role                   | Email                                               |
| ---------------------- | --------------------------------------------------- |
| Student                | [amit@bits.edu](mailto:amit@bits.edu)               |
| Student                | [raj@bits.edu](mailto:raj@bits.edu)                 |
| Faculty Member         | [faculty@bits.edu](mailto:faculty@bits.edu)         |
| Hostel Superintendent  | [hs@bits.edu](mailto:hs@bits.edu)                   |
| Conference Supervisor  | [conference@bits.edu](mailto:conference@bits.edu)   |
| Security Guard         | [guard@bits.edu](mailto:guard@bits.edu)             |
| Conference Participant | [participant@bits.edu](mailto:participant@bits.edu) |
| Visitor                | [visitor@bits.edu](mailto:visitor@bits.edu)         |

### Password

All demo accounts use:

```text
amit123
```

### Suggested Testing Flow

1. Login as Student and create a Day Pass, Outstation Pass, or Vacation Pass.
2. Login as Faculty and create a Conference Pass.
3. Login as Hostel Superintendent and approve student-related passes.
4. Login as Conference Supervisor and approve conference-related passes.
5. Login as Student or Faculty and view the generated QR pass.
6. Login as Security Guard and verify the QR token using the Gate Scanner.
7. Review Approval Logs and Gate Logs through the database for auditability.

## Problem Statement

Traditional gate pass systems often focus only on students while ignoring other categories of campus users such as:

* Faculty members
* Conference participants
* Visitors
* Security personnel
* Administrative approvers

This project provides a single platform that supports all stakeholders while maintaining approval workflows, audit trails, and gate-level verification.

---

# Features Implemented

## 1. Multiple Pass Types

The system supports:

| Pass Type       | Purpose                       |
| --------------- | ----------------------------- |
| Day Pass        | Temporary campus exit         |
| Outstation Pass | Short-duration travel         |
| Vacation Pass   | Long-duration leave           |
| Visitor Pass    | Temporary visitor access      |
| Conference Pass | Conference participant access |

Pass types are configurable through the database.

---

## 2. Role-Based Access Control (RBAC)

The platform supports multiple user roles:

| Role                   | Responsibility                          |
| ---------------------- | --------------------------------------- |
| Student                | Apply for personal passes               |
| Faculty                | Apply for visitor and conference passes |
| Security Guard         | Verify passes at gates                  |
| Hostel Superintendent  | Approve student-related passes          |
| Conference Supervisor  | Approve conference-related passes       |
| Conference Participant | Access conference passes                |
| Visitor                | Temporary campus access                 |
| Admin                  | System administration                   |

Each role receives only the functionality relevant to their responsibilities.

---

## 3. Approval Workflow

### Student Workflow

Student
→ Apply Pass
→ Hostel Superintendent Review
→ Approval / Rejection
→ QR Generation
→ Gate Verification

### Conference Workflow

Faculty
→ Create Conference Pass
→ Conference Supervisor Review
→ Approval / Rejection
→ QR Generation
→ Gate Verification

---

## 4. Secure QR-Based Verification

When a pass is approved:

* A unique QR token is generated
* The token is stored in the database
* Security personnel validate the token at the gate

### Security Enhancement

Instead of predictable QR values such as:

PASS_7

the system generates cryptographically secure random tokens using Node.js crypto APIs.

Example:

9f4a7d1b6c8e2a5f3d9c4b7e1a2f6c8d

This prevents token prediction and unauthorized pass forgery.

---

## 5. Gate Security Dashboard

Security personnel have access to:

* Gate Scanner
* Entry Verification
* Exit Verification
* Scan History
* Audit Logs

Every scan is recorded in the database.

---

## 6. Audit Trails

### Approval Logs

The system stores:

* Approver
* Decision
* Timestamp
* Remarks

### Gate Logs

The system stores:

* Pass ID
* Entry/Exit Action
* Security Personnel
* Timestamp

This provides complete traceability.

---

# System Architecture

## Backend

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication

## Frontend

* React
* Vite

## Database

Tables:

* roles
* users
* pass_types
* passes
* approvals
* gate_logs

Database schema is available in:

backend/database/schema.sql

---

# Database Design

### Users

Stores user information and role assignments.

### Roles

Defines system permissions and user categories.

### Pass Types

Stores available pass categories and constraints.

### Passes

Stores all gate pass requests and approval status.

### Approvals

Stores approval history and audit information.

### Gate Logs

Stores security gate verification events.

---

# Security Features

* JWT-based authentication
* Role-based authorization
* Approval hierarchy
* Secure random QR token generation
* Gate-level verification
* Approval audit logging
* Security audit logging

---

# API Integration Capability

The backend exposes REST APIs and can be integrated with an existing Student Welfare Division (SWD) portal.

Potential integration points include:

* Student authentication
* Pass applications
* Approval status tracking
* QR retrieval
* Gate verification

---
## Requirements Fulfilled

This implementation satisfies the major hackathon requirements:

* Support for students, faculty, visitors, and conference participants.
* Role-based approval workflows.
* Hostel Superintendent and Conference Supervisor approval hierarchy.
* Secure QR-based gate verification.
* Security guard dashboard and gate scanning workflow.
* Approval and gate audit trails.
* REST API architecture suitable for SWD integration.
* Extensible database schema for future enhancements such as RFID and rotating QR codes.

# Future Enhancements

## Dynamic Rotating QR Codes

QR tokens can be periodically regenerated to further reduce the possibility of misuse through screenshots.

## RFID Vehicle Passes

Support for faculty vehicle RFID registration and gate scanning.

## SMS Verification

Visitor verification through OTP-based authentication.

## Real-Time Notifications

Approval and gate activity notifications.

---

# Installation

## Backend

```bash
cd backend
npm install
npm start
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Database Setup

Create PostgreSQL database:

```sql
CREATE DATABASE dadu_gatepass;
```

Import schema:

```bash
psql -U postgres -d dadu_gatepass -f backend/database/schema.sql
```

---

# Team Notes

The system prioritizes backend robustness, maintainability, auditability, and role-based workflows while remaining extensible for future campus security requirements.
