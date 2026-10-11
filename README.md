# CivicPulse: Municipal Problem Reporting & Redressal System

> **Enterprise Civic Management Platform**  
> A full-stack web application for citizens to report local civic issues and for municipal authorities to triage, assign, track, and resolve them efficiently.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
  - [Citizen Portal](#citizen-portal)
  - [Authority / Admin Dashboard](#authority--admin-dashboard)
- [Complaint Lifecycle](#-complaint-lifecycle)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Database Design](#-database-design)
- [REST API Endpoints](#-rest-api-endpoints)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started & Setup](#-getting-started--setup)
  - [Prerequisites](#prerequisites)
  - [Database Configuration](#database-configuration)
  - [Backend Setup (Spring Boot)](#backend-setup-spring-boot)
  - [Frontend Setup (React + TypeScript)](#frontend-setup-react--typescript)
- [User Authentication & Access](#-user-authentication--access)
- [Project Milestones](#-project-milestones)
- [License](#-license)

---

## 📖 Overview

The **Local Civic Problem Reporting System** is a web-based platform built to bridge the gap between citizens and local administrative authorities. It enables residents to submit complaints regarding day-to-day municipal issues (such as potholes, overflowing garbage bins, broken streetlights, and water leakage) with precise location data and optional photographic evidence.

Local municipal departments and administrative officers can monitor incoming issues, prioritize emergencies, assign tasks to relevant field departments, update progress, and maintain transparent resolution histories.

---

## ❗ Problem Statement

Citizens frequently encounter civic inconveniences in their neighborhoods but lack a structured, trackable, and accessible digital channel to notify municipal bodies. Simultaneously, civic authorities struggle with disorganized manual complaint registers, making it challenging to track pending tasks, prioritize urgent issues, and provide status updates to the public.

This application provides a centralized, transparent, and structured platform to:
- Digitize complaint intake and record-keeping.
- Categorize and prioritize neighborhood issues.
- Provide real-time tracking for citizens.
- Streamline internal workflow and department assignments for administrators.

---

## ✨ Key Features

### 👤 Citizen Portal
- **User Authentication:** Secure registration, login, and session management using password hashing.
- **Lodge Complaints:** Submit issues with title, detailed description, category, address/coordinates, and optional photo upload.
- **Predefined Categories:** Categorize issues (Pothole, Garbage, Broken Streetlight, Water Leakage, Other).
- **Location Tagging:** Provide street address and coordinates supported by Leaflet/OpenStreetMap.
- **Track Status:** Real-time visibility into complaint status, assigned department, and audit trail of updates.
- **Personal Dashboard:** View history of all lodged complaints and their current resolution stages.

### 🛡️ Authority / Admin Dashboard
- **Analytics & Metrics:** Quick overview of total, pending, in-progress, and resolved complaints.
- **Complaint Management:** Search, sort, and filter complaints by status, category, date, and priority.
- **Priority Management:** Assign official severity levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- **Department Allocation:** Assign complaints to responsible municipal departments and officers.
- **Status Updates with Remarks:** Transition complaint status while appending official remarks and notes.
- **Audit & History:** Maintain automated, immutable audit logs for every status transition.

---

## 🔄 Complaint Lifecycle

Every complaint progresses through a defined state machine:

```
[ Submitted ]
      │
      ▼
[ Under Review ] ──(Authority verifies validity & assigns priority)
      │
      ▼
[ Assigned ]     ──(Allocated to specific department / field officer)
      │
      ▼
[ In Progress ]  ──(Repair / resolution work underway)
      │
      ▼
[ Resolved ]     ──(Issue resolved on site with official notes)
      │
      ▼
[ Closed ]       ──(Complaint finalized and archived in history)
```

---

## 💻 Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Backend** | Java 21, Spring Boot 3.x | Core REST API, business logic, dependency injection |
| **Security** | Spring Security, JWT / BCrypt | Authentication, role-based authorization (`CITIZEN`, `AUTHORITY`) |
| **Persistence** | Spring Data JPA, Hibernate | Object-Relational Mapping (ORM) and repository layer |
| **Database** | PostgreSQL | Relational database for structured, ACID-compliant data storage |
| **Frontend** | React, TypeScript, Vite | Modern, component-driven, type-safe single-page application (SPA) |
| **Styling** | Tailwind CSS | Utility-first, responsive user interface styling |
| **Maps** | Leaflet, OpenStreetMap | Lightweight open-source mapping for location selection & pin drop |
| **Build Tools** | Maven (Backend), npm / pnpm (Frontend) | Dependency management and build automation |
| **Testing** | JUnit 5, Mockito, Postman | Unit, integration, and API endpoint verification |

---

## 🏛️ System Architecture

```
┌──────────────────────────────────────────┐
│           Client Browser (SPA)           │
│         React + TypeScript + Tailwind     │
└────────────────────┬─────────────────────┘
                     │ HTTP / JSON (REST API)
                     ▼
┌──────────────────────────────────────────┐
│          Spring Boot Application         │
│  ┌────────────────────────────────────┐  │
│  │    Spring Security (Auth & RBAC)   │  │
│  └─────────────────┬──────────────────┘  │
│  ┌─────────────────▼──────────────────┐  │
│  │   Controllers (@RestController)    │  │
│  └─────────────────┬──────────────────┘  │
│  ┌─────────────────▼──────────────────┐  │
│  │      Service Layer (@Service)      │  │
│  └─────────────────┬──────────────────┘  │
│  ┌─────────────────▼──────────────────┐  │
│  │    Repositories (@Repository/JPA)  │  │
│  └─────────────────┬──────────────────┘  │
└────────────────────┼─────────────────────┘
                     │ JDBC / Hibernate
                     ▼
┌──────────────────────────────────────────┐
│          PostgreSQL Database             │
└──────────────────────────────────────────┘
```

---

## 🗄️ Database Design

The relational schema comprises the following core tables:

- **`users`**: User records containing credentials, contact details, and role references.
- **`roles`**: System roles (`ROLE_CITIZEN`, `ROLE_AUTHORITY`).
- **`categories`**: Standardized problem types (Potholes, Garbage, Water, etc.).
- **`departments`**: Municipal units responsible for specific civic maintenance.
- **`complaints`**: Core complaint records, including title, description, location (lat/lng/address), priority, current status, image URL, and timestamps.
- **`assignments`**: Mapping complaints to departments and officers.
- **`complaint_status_history`**: Audit trail capturing timestamped status transitions, author user ID, and administrative remarks.

---

## 🔌 REST API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new citizen account | Public |
| `POST` | `/api/auth/login` | Authenticate user and receive token | Public |

### 📝 Complaints (`/api/complaints`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/complaints` | Get complaints (filtered by user or all for admin) | Authenticated |
| `GET` | `/api/complaints/{id}` | Get specific complaint details & status history | Authenticated |
| `POST` | `/api/complaints` | Submit a new complaint (with optional image) | Citizen |
| `PUT` | `/api/complaints/{id}/status` | Update complaint status and append remark | Authority |
| `PUT` | `/api/complaints/{id}/priority` | Update complaint priority level | Authority |
| `POST` | `/api/complaints/{id}/assign` | Assign complaint to a department/officer | Authority |

### 📊 Categories & Dashboard
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/categories` | List active civic categories | Authenticated |
| `GET` | `/api/departments` | List municipal departments | Authority |
| `GET` | `/api/dashboard/statistics` | Get aggregate counts (total, pending, resolved) | Authority |

---

## 📁 Project Directory Structure

```
java-degree-sem3/
├── Local_Civic_Problem_Reporting_System_PRD.md # Product Requirements Document
├── README.md                                  # Project Documentation
├── backend/                                   # Spring Boot Application
│   ├── pom.xml                                # Maven build specification
│   └── src/
│       ├── main/
│       │   ├── java/com/example/civic/
│       │   │   ├── config/                    # Security & App configuration
│       │   │   ├── controller/                # REST API Controllers
│       │   │   ├── dto/                       # Request/Response DTOs
│       │   │   ├── entity/                    # JPA Entities
│       │   │   ├── repository/                # Spring Data JPA Repositories
│       │   │   ├── service/                   # Business Logic Services
│       │   │   └── CivicApplication.java      # Application Main Class
│       │   └── resources/
│       │       └── application.yml            # DB and application properties
│       └── test/                              # Unit and integration tests
└── frontend/                                  # React + TypeScript SPA
    ├── package.json
    ├── vite.config.ts
    ├── src/
    │   ├── assets/
    │   ├── components/                        # Reusable UI components & maps
    │   ├── pages/                             # Citizen & Admin views
    │   ├── services/                          # API client modules
    │   ├── types/                             # TypeScript interfaces & types
    │   └── App.tsx
    └── tailwind.config.js
```

---

## 🚀 Getting Started & Setup

### Prerequisites
- **Java Development Kit (JDK):** Version 21 or higher
- **Node.js:** Version 18.x or 20.x LTS with `npm`
- **PostgreSQL:** Version 15 or higher
- **Apache Maven:** Version 3.8+ (or use included Maven Wrapper `mvnw`)

### Database Configuration
1. Open PostgreSQL CLI or pgAdmin and create a new database:
   ```sql
   CREATE DATABASE civic_db;
   ```
2. Verify connection credentials (default port: `5432`).

### Backend Setup (Spring Boot)
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Configure database credentials in `src/main/resources/application.properties` (or `application.yml`):
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/civic_db
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```
3. Build and launch the Spring Boot application:
   ```bash
   mvn clean spring-boot:run
   ```
   The backend service will be available at `http://localhost:8080`.

### Frontend Setup (React + TypeScript)
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The web application will be accessible at `http://localhost:5173`.

---

## 🔐 User Authentication & Access

The platform supports direct user onboarding:
- Register with any valid email address (e.g. Gmail, corporate email)
- Passwords must be at least **8 characters** in length
- Choose account role during registration:
  - **Citizen:** Submit grievances, upload photos, pin map coordinates, and track real-time resolution progress.
  - **Municipal Authority:** Access administrative triage dashboard, set priority levels, assign field departments/officers, and update resolution statuses with audit notes.

---

## 🗺️ Project Milestones

- [x] **Project Architecture & Specification** (PRD & System Blueprint)
- [x] **Data Persistence & Setup** (Spring Boot 3, Maven, PostgreSQL 18 schema generation)
- [x] **Security & Access Control** (Spring Security, JWT stateless authentication, role-based authorization)
- [x] **Core Grievance Redressal** (Citizen complaint intake, category selection, real-time status tracker)
- [x] **Municipal Command Dashboard** (Analytics overview, priority triage, field department delegation, audit history)
- [x] **Geospatial & Media Attachments** (Leaflet OpenStreetMap coordinates, photo attachments)
- [x] **Integration Testing** (Spring Boot surefire test suite passing, PostgreSQL verified)
- [x] **Design & Interface Polish** (Enterprise typographic design, interactive map picker, responsive layout)

---

## 📄 License

This software is released under the **MIT License**. Free for municipal, organizational, and developer usage.
