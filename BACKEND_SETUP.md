# CivicGuard Backend Setup Guide

## Database Setup 
Your PostgreSQL database is already created with all tables:
- `civicguard_db` (Database)
- Users, Incidents, CCTV Cameras, Alerts, Preferences, Updates (Tables)

## Backend Server Setup

### 1. Install Dependencies
```bash
npm install pg cors ts-node
```
(This is running now...)

### 2. Configure Database Connection
Edit `.env` file with your PostgreSQL credentials:
```
DB_USER=postgres
DB_PASSWORD=<your_postgres_password>
DB_HOST=localhost
DB_PORT=5432
DB_NAME=civicguard_db
PORT=5000
```

### 3. Start the Backend Server
```bash
npm run server
```

You should see:
```
   Server running on http://localhost:5000
   API Documentation:
   GET  http://localhost:5000/health
   GET  http://localhost:5000/api/users
   GET  http://localhost:5000/api/incidents
   POST http://localhost:5000/api/incidents
   GET  http://localhost:5000/api/cameras
   GET  http://localhost:5000/api/alerts
```

## Available API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create or sync a user into PostgreSQL
- `PATCH /api/users/:uid` - Update an existing user in PostgreSQL
- `DELETE /api/users/:uid` - Delete a user from PostgreSQL

### Incidents
- `GET /api/incidents` - Get all incidents
- `GET /api/incidents/:id` - Get incident by ID
- `POST /api/incidents` - Create new incident
- `PATCH /api/incidents/:id` - Update incident status

### Cameras
- `GET /api/cameras` - Get all CCTV cameras

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create new alert

## Test Your API

**In PowerShell/Terminal:**
```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/users
curl http://localhost:5000/api/incidents
```

**In pgAdmin:**
View all data in real-time as your frontend makes API calls!

## Connect Frontend to Backend

Update your frontend services to call the API:
```typescript
const API_URL = 'http://localhost:5000/api';

// Example
fetch(`${API_URL}/incidents`)
  .then(res => res.json())
  .then(data => console.log(data))
```

## User Sync Notes
- New signups now sync into PostgreSQL through `POST /api/users`
- Existing Firestore users are backfilled into PostgreSQL when an admin opens the user registry
- pgAdmin should be refreshed after signup or after opening the admin users page

## Next Steps
1.   Verify database exists in pgAdmin
2.   Install dependencies (npm install running)
3.   Start backend: `npm run server`
4.   Test API endpoints with curl
5.   Connect frontend to backend
6.   Deploy backend (Heroku, Vercel, Railway, etc.)
