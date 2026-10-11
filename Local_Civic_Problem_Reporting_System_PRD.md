# Product Requirements Document (PRD)

## Local Civic Problem Reporting System

**Project Type:** Municipal Enterprise Platform\
**Application Type:** Full-Stack Web Application\
**Primary Language:** Java & TypeScript\
**Version:** 1.0

------------------------------------------------------------------------

## 1. Project Overview

The **Local Civic Problem Reporting System** is a simple web application
that allows citizens to report common local civic problems such as
potholes, garbage, broken streetlights, and water leakage.

The system will also provide an authority/admin side where reported
complaints can be viewed, managed, assigned, and updated until they are
resolved.

The main purpose of the project is to demonstrate a practical web
application using **Java, Spring Boot, and a relational database**.

The project will remain simple and focused on the core
complaint-reporting workflow. Advanced features such as AI,
microservices, real-time notifications, and complex analytics are
outside the initial scope.

------------------------------------------------------------------------

# 2. Problem Statement

Citizens often face local problems but may not have a simple way to
report them and track their complaints.

At the same time, authorities need a structured way to maintain
complaint records and know which problems are pending, in progress, or
resolved.

This project provides a single web-based system for:

-   Reporting civic problems
-   Recording complaint details
-   Tracking complaint status
-   Managing complaints
-   Maintaining resolved and pending records

------------------------------------------------------------------------

# 3. Project Objectives

The main objectives are:

1.  Allow citizens to report local civic problems.
2.  Store complaint information in a structured database.
3.  Allow citizens to track their complaints.
4.  Allow authorities to manage reported complaints.
5.  Provide complaint categories, priorities, and statuses.
6.  Maintain a history of complaint status changes.
7.  Provide a simple dashboard for authorities.
8.  Demonstrate Java-based backend development using Spring Boot.

------------------------------------------------------------------------

# 4. Target Users

The system will have two main user types.

## 4.1 Citizen

Citizens can:

-   Create an account
-   Log in
-   Report a civic problem
-   Add problem details
-   Select a category
-   Add location
-   Upload an optional image
-   View their complaints
-   Track complaint status

## 4.2 Authority / Admin

Authorities can:

-   Log in
-   View all complaints
-   View complaint details
-   Filter complaints
-   Set or update priority
-   Assign complaints
-   Update complaint status
-   Add remarks
-   Mark complaints as resolved
-   View basic complaint statistics

------------------------------------------------------------------------

# 5. Project Scope

## 5.1 Citizen Features

### Registration and Login

Citizens should be able to:

-   Register using name, email, and password.
-   Log in using their credentials.
-   Log out securely.

### Report a Problem

A citizen can create a complaint with:

-   Complaint title
-   Description
-   Category
-   Location
-   Optional image
-   Submit date

### Complaint Categories

The initial categories will be:

-   Pothole
-   Garbage
-   Broken Streetlight
-   Water Leakage
-   Other

### Complaint Tracking

Citizens can view:

-   Complaint ID
-   Complaint title
-   Category
-   Location
-   Priority
-   Current status
-   Submitted date
-   Last updated date

### Complaint Status

The basic status flow will be:

``` text
Submitted
    ↓
Under Review
    ↓
Assigned
    ↓
In Progress
    ↓
Resolved
    ↓
Closed
```

The authority can update the status when required.

------------------------------------------------------------------------

# 6. Authority/Admin Features

## 6.1 Dashboard

The dashboard should show simple statistics:

-   Total complaints
-   Pending complaints
-   Complaints in progress
-   Resolved complaints

Example:

``` text
Total:       100
Pending:      25
In Progress:  20
Resolved:     55
```

## 6.2 Complaint Management

Authorities can:

-   View all complaints
-   Search complaints
-   Filter by category
-   Filter by status
-   Filter by priority
-   Open complaint details
-   Update complaint status
-   Assign a complaint
-   Add remarks
-   Mark a complaint as resolved

## 6.3 Complaint Details

The authority should be able to see:

-   Complaint ID
-   Citizen name
-   Category
-   Title
-   Description
-   Image
-   Location
-   Priority
-   Status
-   Assigned officer/department
-   Created date
-   Updated date
-   Status history

------------------------------------------------------------------------

# 7. Priority

The system will use four simple priority levels:

-   Low
-   Medium
-   High
-   Critical

The authority can set or update the official priority.

Citizens should not be responsible for determining the final official
priority.

------------------------------------------------------------------------

# 8. Location

The system should store the location of a complaint.

For the mini project, the location can be represented using:

-   Address
-   Latitude
-   Longitude

A simple map can be added using:

-   Leaflet
-   OpenStreetMap

The map is an optional supporting feature and should not make the
project unnecessarily complicated.

------------------------------------------------------------------------

# 9. Image Upload

Citizens can optionally upload an image showing the problem.

Example:

``` text
Pothole
    ↓
Upload Photo
    ↓
Submit Complaint
```

For the initial project, image storage can be kept simple.

The system should support:

-   One optional image per complaint
-   Basic image validation
-   Image preview before submission

------------------------------------------------------------------------

# 10. Complaint Status History

The system should maintain a basic history of status changes.

Example:

``` text
Complaint #CMP-001

30 Sep
Submitted

30 Sep
Under Review

01 Oct
Assigned

02 Oct
In Progress

04 Oct
Resolved
```

This allows citizens and authorities to understand the progress of a
complaint.

------------------------------------------------------------------------

# 11. Functional Requirements

## FR-01: User Registration

The system shall allow citizens to create an account.

## FR-02: User Login

The system shall authenticate registered users.

## FR-03: Complaint Creation

The system shall allow citizens to submit a new complaint.

## FR-04: Complaint Categories

The system shall allow complaints to be classified into predefined
categories.

## FR-05: Complaint Location

The system shall store the location associated with a complaint.

## FR-06: Complaint Tracking

The system shall allow citizens to view the current status of their
complaints.

## FR-07: Authority Complaint Management

The system shall allow authorities to view and manage complaints.

## FR-08: Priority Management

The system shall allow authorities to set complaint priority.

## FR-09: Status Management

The system shall allow authorities to update complaint status.

## FR-10: Complaint Assignment

The system shall allow an authority to assign a complaint to an officer
or department.

## FR-11: Complaint History

The system shall maintain the status history of complaints.

## FR-12: Dashboard

The system shall display basic complaint statistics to authorities.

------------------------------------------------------------------------

# 12. Non-Functional Requirements

## Performance

The application should provide normal page and API responses without
unnecessary delays.

## Security

-   Passwords must not be stored as plain text.
-   Users should only access features allowed by their role.
-   Citizens should only be able to view their own complaints.
-   Authority users can manage complaints according to their
    permissions.

## Usability

The interface should be:

-   Simple
-   Responsive
-   Easy to understand
-   Suitable for desktop and mobile browsers

## Maintainability

The backend should follow a basic layered structure so that the code is
easy to understand and maintain.

------------------------------------------------------------------------

# 13. Recommended Technology Stack

## Frontend

-   React
-   TypeScript
-   Tailwind CSS

## Backend

-   Java 21
-   Spring Boot
-   Spring Web
-   Spring Security
-   Spring Data JPA
-   Hibernate

## Database

-   PostgreSQL

## Maps

-   Leaflet
-   OpenStreetMap

## Build Tool

-   Maven

## API Testing

-   Postman

## Version Control

-   Git
-   GitHub

------------------------------------------------------------------------

# 14. System Architecture

The application will use a simple three-layer architecture.

``` text
┌─────────────────────────────┐
│          Frontend           │
│     React + TypeScript      │
└──────────────┬──────────────┘
               │
             REST API
               │
┌──────────────▼──────────────┐
│          Backend            │
│        Spring Boot          │
│            Java             │
├─────────────────────────────┤
│ Controller                  │
│ Service                     │
│ Repository                  │
│ Security                    │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│         PostgreSQL          │
└─────────────────────────────┘
```

------------------------------------------------------------------------

# 15. Backend Structure

A simple Spring Boot structure is recommended:

``` text
src/main/java/
└── com.example.civic/
    ├── controller/
    ├── service/
    ├── repository/
    ├── entity/
    ├── dto/
    ├── security/
    └── config/
```

### Controller

Handles HTTP requests.

### Service

Contains application/business logic.

### Repository

Handles database operations.

### Entity

Represents database tables.

### DTO

Represents data transferred through APIs.

### Security

Handles authentication and authorization.

------------------------------------------------------------------------

# 16. Database Design

The main tables can be:

``` text
users
roles
complaints
categories
departments
assignments
complaint_status_history
```

## Users

``` text
id
name
email
password
role_id
created_at
```

## Complaints

``` text
id
complaint_number
user_id
category_id
title
description
image_url
address
latitude
longitude
priority
status
created_at
updated_at
resolved_at
```

## Categories

``` text
id
name
description
```

## Departments

``` text
id
name
description
```

## Assignments

``` text
id
complaint_id
department_id
assigned_to
assigned_at
```

## Complaint Status History

``` text
id
complaint_id
old_status
new_status
changed_by
remarks
created_at
```

------------------------------------------------------------------------

# 17. Main User Flow

## Citizen Flow

``` text
Open Website
     ↓
Register / Login
     ↓
Citizen Dashboard
     ↓
Report Problem
     ↓
Enter Complaint Details
     ↓
Select Location
     ↓
Upload Optional Image
     ↓
Submit
     ↓
Complaint ID Generated
     ↓
Track Complaint
```

## Authority Flow

``` text
Authority Login
     ↓
Admin Dashboard
     ↓
View Complaints
     ↓
Open Complaint
     ↓
Review Details
     ↓
Set Priority
     ↓
Assign Complaint
     ↓
Update Status
     ↓
Resolve Complaint
     ↓
Close Complaint
```

------------------------------------------------------------------------

# 18. Main Pages

## Public Pages

-   Home
-   Login
-   Register

## Citizen Pages

-   Citizen Dashboard
-   Report Problem
-   My Complaints
-   Complaint Details
-   Profile

## Authority Pages

-   Admin Dashboard
-   All Complaints
-   Complaint Details
-   Manage Categories
-   Manage Departments
-   Profile

The number of pages should remain limited for the mini project.

------------------------------------------------------------------------

# 19. API Requirements

The frontend and backend will communicate through REST APIs.

Example API groups:

## Authentication

``` text
POST /api/auth/register
POST /api/auth/login
```

## Complaints

``` text
GET    /api/complaints
GET    /api/complaints/{id}
POST   /api/complaints
PUT    /api/complaints/{id}
```

## Complaint Status

``` text
PUT /api/complaints/{id}/status
```

## Categories

``` text
GET  /api/categories
POST /api/categories
```

## Dashboard

``` text
GET /api/dashboard/statistics
```

The exact API design can be finalized during implementation.

------------------------------------------------------------------------

# 20. Authentication and Roles

The system will have two basic roles:

``` text
CITIZEN
AUTHORITY
```

Example:

``` text
Citizen
  ├── Create complaint
  ├── View own complaints
  └── Track status

Authority
  ├── View complaints
  ├── Manage complaints
  ├── Update status
  └── View dashboard
```

Spring Security will be used to protect backend APIs.

------------------------------------------------------------------------

# 21. Out of Scope

To keep the project suitable for a mini project, the following features
are not required:

-   AI-based complaint classification
-   AI chatbot
-   Microservices
-   Real-time chat
-   Mobile application
-   Payment system
-   Complex notification system
-   SMS integration
-   Advanced GIS analysis
-   IoT integration
-   Predictive analytics
-   Blockchain
-   Complex government department integration
-   Real-time tracking of field workers

These can be considered future improvements but should not be part of
the initial implementation.

------------------------------------------------------------------------

# 22. Future Enhancements

Possible future improvements include:

-   Email notifications
-   SMS notifications
-   Mobile application
-   AI-based category detection
-   Automatic priority suggestions
-   Advanced geographic analysis
-   Public complaint statistics
-   Multiple authority departments
-   Citizen feedback and ratings
-   Complaint escalation

These features are not required for version 1.0.

------------------------------------------------------------------------

# 23. Project Success Criteria

The project will be considered successful if:

1.  A citizen can register and log in.
2.  A citizen can submit a civic complaint.
3.  The complaint is stored correctly in PostgreSQL.
4.  A citizen can view and track their complaint.
5.  An authority can log in.
6.  An authority can view all complaints.
7.  An authority can update priority and status.
8.  Complaint status history is maintained.
9.  Resolved complaints remain available as records.
10. The authority dashboard displays basic statistics.
11. The application works correctly as a web application.

------------------------------------------------------------------------

# 24. Recommended Development Order

The project should be developed in the following order:

### Phase 1 --- Project Setup

-   Create Spring Boot project
-   Configure Maven
-   Configure PostgreSQL
-   Create React frontend
-   Connect frontend and backend

### Phase 2 --- Authentication

-   User registration
-   Login
-   Password hashing
-   Role-based access

### Phase 3 --- Complaint System

-   Create complaint
-   Complaint categories
-   Complaint list
-   Complaint details
-   Complaint status

### Phase 4 --- Authority Management

-   Authority dashboard
-   View all complaints
-   Filters
-   Priority management
-   Assignment
-   Status updates

### Phase 5 --- Location and Image

-   Location fields
-   Leaflet map
-   Optional complaint image

### Phase 6 --- Testing

-   API testing using Postman
-   Frontend testing
-   Authentication testing
-   Database testing
-   Role/permission testing

### Phase 7 --- Final Polish

-   Responsive UI
-   Error handling
-   Form validation
-   Loading states
-   Final documentation

------------------------------------------------------------------------

# 25. Final Technology Decision

The project will use:

``` text
Application Type
→ Web Application

Main Language
→ Java

Backend
→ Spring Boot

Frontend
→ React + TypeScript

Database
→ PostgreSQL

ORM
→ Spring Data JPA / Hibernate

Authentication
→ Spring Security

Maps
→ Leaflet + OpenStreetMap

Build
→ Maven

Testing
→ Postman

Version Control
→ Git + GitHub
```

The project intentionally uses a simple architecture and limited feature
set so that it remains suitable for an academic mini project while still
demonstrating important concepts such as Java backend development, REST
APIs, authentication, database management, CRUD operations, role-based
access, and web application development.

------------------------------------------------------------------------

# 26. Final Project Summary

**Local Civic Problem Reporting System** is a web-based application for
reporting and managing local civic problems.

Citizens can report problems such as potholes, garbage, broken
streetlights, and water leakage. They can provide descriptions,
locations, and optional images and track the progress of their
complaints.

Authorities can manage complaints through a dashboard, assign
complaints, update priorities and statuses, and maintain records of
resolved and pending problems.

The project will use **Java and Spring Boot as the main backend
technology**, with React on the frontend and PostgreSQL for data
storage.

The goal is to build a **simple, functional, and easy-to-understand
academic project**, rather than an unnecessarily complex
production-level system.
