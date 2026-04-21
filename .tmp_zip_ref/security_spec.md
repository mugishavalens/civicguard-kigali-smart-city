# Security Spec: CivicGuard Incident Reporting System

## Data Invariants
1. An incident must have a valid reporterId matching the authenticated user's ID.
2. An incident's initial status is always 'pending'.
3. Only Admins can update incident status and add administrative comments.
4. Users cannot change their own roles after initial registration.
5. All IDs must be validated to prevent injection/resource poisoning.

## The "Dirty Dozen" Payloads (Denial Tests)
1. **Identity Spoofing**: User A tries to create an incident with `reporterId` set to User B.
2. **State Shortcutting**: Citizen tries to create an incident with `status` set to 'resolved'.
3. **Admin Escalation**: Citizen tries to update an incident's `status` to 'in-progress'.
4. **Role Injection**: Citizen tries to update their own profile to change `role` to 'admin'.
5. **ID Poisoning**: Hacker tries to create a document with a 1MB string as ID.
6. **Orphaned Record**: User tries to create an incident with a non-existent `reporterId`.
7. **Cross-User Leak**: Citizen tries to 'get' an incident report belong to another citizen.
8. **Malicious Analytics**: User tries to write to a hypothetical analytics collection they shouldn't access.
9. **Terminal State Break**: Admin tries to update an incident that is already 'resolved' (terminal locking).
10. **Shadow Field**: User adds a `isVerified: true` field to their profile.
11. **Massive Payload**: User sends a description that is 1MB in size.
12. **Timestamp Fraud**: User provides a `timestamp` from 1999 instead of using `request.time`.

## Test Runner Plan
- `firestore.rules.test.ts` will verify that all above payloads return `PERMISSION_DENIED`.
- Test that authenticated citizens can list ONLY their own reports.
- Test that authenticated admins can list ALL reports.
