# CivicGuard: System Documentation
**Project Title**: CivicGuard Incident Reporting & Response Management System  
**Case Study**: SmartCity Governance  

## Phase 1: System Analysis & Design

### 1.1 General Description
CivicGuard is a digital platform designed to streamline communication between citizens and urban administrations. It provides a transparent, secure, and real-time environment for reporting public safety incidents (fire, crime, medical) and tracking their resolution progress.

### 1.2 Identified Problems
- **Slow Response Times**: Traditional phone-based reporting often delays information transit.
- **Lack of Transparency**: Citizens often do not know if their report was received or acted upon.
- **Data Fragmentation**: Local authorities lack a centralized database for analytics and trend mapping.

### 1.3 Design Pattern Selection
**Service Layer Pattern + Singleton Pattern**:  
In this implementation, the `incidentService` act as a centralized management layer for all Firestore operations. This ensures that validation and error handling are handled consistently across the application (Citizen and Admin views). The Firebase instance itself acts as a **Singleton**, ensuring only one connection pool exists throughout the application lifecycle.

## Phase 2: Software Development Prototype
This application is built using a **Reactor Architecture** (React.js) with a **NoSQL Serverless Backend** (Firebase).  
- **UI Architecture**: Component-based modular design using Tailwind CSS for utility-first styling.
- **Real-time Synchronization**: Uses Firestore Listeners (Observer Pattern) to provide live updates without manual refreshes.

## Phase 3: Deployment & Collaboration

### 3.1 Dockerization Process
To dockerize this application:
1. **Dockerfile**: Create a multi-stage build.
    - Stage 1: Build the React app (Node.js).
    - Stage 2: Serve the `dist/` folder using Nginx.
2. **Isolation**: Environment variables (like Firebase keys) are injected at runtime via secrets management.
3. **Command**: Use `docker build -t civicguard .` and `docker run -p 3000:80 civicguard`.

### 3.2 Version Control (Git/SVN)
The project is maintained using **Git**. Branching strategies (Main, Develop, Feature) are used to manage collaborative development.  
- `git init`
- `git add .`
- `git commit -m "Initial architecture setup"`

## Phase 4: Software Test Plan

### 1. Unit Testing
- **Auth Flows**: Verify that unauthorized users are redirected to login.
- **Form Validation**: Ensure incident reports cannot be submitted with empty descriptions.

### 2. Integration Testing
- **Firestore Connectivity**: Verify that `addDoc` calls successfully persist to the "incidents" collection.
- **Real-time Updates**: Verify that data updated by an admin appears instantly on the citizen dashboard.

### 3. Security Testing (The Red Team Audit)
- **Role Enforcement**: Attempt to access `/admin` route with a "citizen" account (should result in redirect).
- **Rules Verification**: Attempt to update another user's incident via Firestore SDK directly (should result in `PERMISSION_DENIED`).
