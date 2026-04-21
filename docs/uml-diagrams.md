# CivicGuard Kigali UML Documentation

## 1. Use Case Diagram

Actors:
- Citizen
- Admin

Use cases:
- Citizen: Report Incident, View Report Status
- Admin: View Reports, Respond to Incident, Generate Analytics

```text
          +----------------------+
          |      SYSTEM          |
          |----------------------|
          |  (Report Incident)   |
Citizen --|  (View Status)       |
          |                      |
Admin ----|  (View Reports)      |
          |  (Respond Incident)  |
          |  (Generate Analytics)|
          +----------------------+
```

## 2. Class Diagram

```text
+------------------+
|      User        |
+------------------+
| id               |
| name             |
| role             |
+------------------+
        ^
        |
+------------------+     +----------------------+
|     Citizen      |     |      Incident        |
+------------------+     +----------------------+
                         | id                   |
        ^                | type                 |
        |                | location             |
+------------------+     | description          |
|      Admin       |     | status               |
+------------------+     | timestamp            |
                         +----------------------+

+----------------------+     +--------------------------+
|   ReportManager      |     | NotificationService      |
+----------------------+     +--------------------------+
| createReport()       |     | sendAlert()              |
| updateStatus()       |     | sendStatusUpdate()       |
| fetchReports()       |     +--------------------------+
+----------------------+
```

Relationships:
- `User -> Incident`: one-to-many
- `ReportManager -> Incident`: manages lifecycle
- `NotificationService -> User`: notifies citizens and admins

## 3. Activity Diagram

```text
Start
  |
Login
  |
Submit Incident
  |
Validate Data
  |
[Valid?] -- No --> Reject & Retry
  |
 Yes
  |
Save to Database
  |
Notify Admin
  |
Admin Reviews
  |
Update Status
  |
Notify User
  |
End
```

## 4. Sequence Diagram

```text
User -> System: Submit Report
System -> Database: Save Report
Database -> System: Saved
System -> Admin: Send Notification
Admin -> System: View Report
Admin -> System: Update Status
System -> NotificationService: Send Update
NotificationService -> User: Status Update
```

## 5. Component Diagram

```text
+-------------------+
|   Frontend (UI)   |
+-------------------+
         |
         v
+-------------------+
|   Backend Server  |
| (PHP / Python)    |
+-------------------+
   |        |
   v        v
Database   Notification Module
(MySQL)    (SMS / Email)
```

## Implemented Prototype Mapping

- `index.html`: landing page and UML overview
- `auth.html`: shared authentication entry
- `citizen.html`: incident reporting and status tracking
- `admin.html`: incident review, response management, analytics
- `assets/app.js`: report manager, notification simulation, theme and language state
- `assets/styles.css`: responsive interface with dark and light modes
