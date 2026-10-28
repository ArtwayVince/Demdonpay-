# Security Specification & Threat Model — Dem Don Pay (DdP)

## 1. Data Invariants
1. **Official Announcement Separation**: An employee can NEVER post or modify an official announcement document (`official_announcements`). Only verified company representatives (`isVerifiedOnDdP == true` and `verifiedRepUid == auth.uid`) or platform admins can write to `official_announcements`.
2. **Employee Experience Scoping**: An employee salary report (`salary_reports`) can only represent that employee's own report (`incoming().userId == request.auth.uid`). No user may forge or submit reports on behalf of other users.
3. **No Unbounded Collective Claims**: Individual employee reports are tagged `sourceType: 'employee_reported'`. No employee report can claim to be an official announcement.
4. **PII Strict Isolation**: User email, phone numbers, and notification credentials reside in `/users/{userId}/private/info` and are restricted strictly to `request.auth.uid == userId` or platform administrator. No public reads of private subcollections.
5. **No Self-Assigned Privileges**: Users cannot change their own `role` to `admin` or `moderator` or `org_representative` without platform authorization.
6. **Auditable Moderation**: Only moderators and admins can resolve or modify `moderation_reports` and write to `moderation_logs`.

---

## 2. The "Dirty Dozen" Payloads (Must ALL be rejected by Rules)

1. **Payload 1 (Shadow Official Announcement by Employee)**:
   Attempt by employee to create a document in `/official_announcements` without verified rep status.
   *Result*: PERMISSION_DENIED.
2. **Payload 2 (Ghost Privileges in User Public Profile)**:
   Attempt by a regular user to register or update their user doc with `{ role: "admin" }` or `{ role: "moderator" }`.
   *Result*: PERMISSION_DENIED.
3. **Payload 3 (Impersonating Another Employee's Salary Report)**:
   Attempt by user `attacker_123` to post `{ userId: "victim_456", orgId: "org_1", status: "salary_received" }`.
   *Result*: PERMISSION_DENIED.
4. **Payload 4 (Tampering with Someone Else's Salary Report)**:
   Attempt by user `attacker_123` to update or delete `victim_456`'s salary report.
   *Result*: PERMISSION_DENIED.
5. **Payload 5 (Snooping on Colleague's Private Contact Info)**:
   Attempt by user `employee_A` to read `/users/employee_B/private/info`.
   *Result*: PERMISSION_DENIED.
6. **Payload 6 (Arbitrary Approval of Own Org Rep Application)**:
   Attempt by applicant to update their own `/rep_verifications/{id}` to `{ status: "approved" }`.
   *Result*: PERMISSION_DENIED.
7. **Payload 7 (Denial-of-Wallet Massive String Injection)**:
   Attempt to create a salary report with a 1MB payload in `notes` or an invalid long string ID.
   *Result*: PERMISSION_DENIED.
8. **Payload 8 (Fabricated System Source Type)**:
   Attempt by employee to set `sourceType: "official_payment_announcement"` in a `salary_reports` doc.
   *Result*: PERMISSION_DENIED.
9. **Payload 9 (Self-Verification of Organisation)**:
   Attempt by an unverified user to create or edit an organisation with `isVerifiedOnDdP: true`.
   *Result*: PERMISSION_DENIED.
10. **Payload 10 (Forged Moderation Log)**:
    Attempt by ordinary user to insert a fake audit trail in `/moderation_logs`.
    *Result*: PERMISSION_DENIED.
11. **Payload 11 (Unauthenticated Write)**:
    Attempt by unauthenticated client to write to any collection.
    *Result*: PERMISSION_DENIED.
12. **Payload 12 (Shadow Field Injection in Moderation Report)**:
    Attempt to inject `{ resolvedBy: "attacker", status: "resolved" }` during report creation.
    *Result*: PERMISSION_DENIED.
