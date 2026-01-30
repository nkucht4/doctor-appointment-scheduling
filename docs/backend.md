# Backend API Documentation

All endpoints require JWT authentication (`Authorization: Bearer <token>`) unless otherwise specified.

---

## Authentication

| Method | Endpoint                | Description                          | Roles Allowed | Notes                    |
|--------|-------------------------|------------------------------------|---------------|--------------------------|
| POST   | `/auth/login`           | User login                         | Public        | Returns JWT token        |
| POST   | `/auth/register`        | Register new patient               | Public        |                          |
| POST   | `/auth/register_doctor` | Register new doctor                | ADMIN         | Requires Admin token     |

---

## Users

| Method | Endpoint                         | Description                        | Roles Allowed | Notes                    |
|--------|----------------------------------|----------------------------------|---------------|--------------------------|
| GET    | `/users`                        | Get all users                     | ADMIN         |                          |
| GET    | `/users/doctors`                | Get basic info of all doctors     | Public        | No auth needed           |
| GET    | `/users/doctors/:id/can_review` | Check if patient can review doctor| PATIENT       | Auth required            |
| PUT    | `/users/:id/ban`                | Ban/unban user                   | ADMIN         |                          |

---

## Appointments

| Method | Endpoint                       | Description                         | Roles Allowed         | Notes                           |
|--------|--------------------------------|-----------------------------------|-----------------------|---------------------------------|
| POST   | `/appointments`                | Create a new appointment           | ADMIN, PATIENT        | Supports file upload (`file`)    |
| GET    | `/appointments`                | Get all appointments               | ADMIN                 |                                 |
| GET    | `/appointments/doctor/:id`     | Get appointments for a doctor     | ADMIN, DOCTOR, PATIENT|                                 |
| GET    | `/appointments/patient/:id`    | Get appointments for a patient    | ADMIN, PATIENT        |                                 |
| PUT    | `/appointments/:id`            | Update an appointment              | DOCTOR, ADMIN, PATIENT|                                 |
| DELETE | `/appointments/:id`            | Delete/cancel an appointment       | DOCTOR, ADMIN, PATIENT|                                 |
| GET    | `/appointments/:id/file`       | Download appointment attached file| DOCTOR, ADMIN, PATIENT|                                 |

---

## Availability

| Method | Endpoint                   | Description                       | Roles Allowed     | Notes         |
|--------|----------------------------|---------------------------------|-------------------|---------------|
| POST   | `/availability`            | Create availability slots        | DOCTOR, ADMIN     |               |
| GET    | `/availability/doctor/:id` | Get availability for doctor      | DOCTOR, ADMIN, PATIENT |          |
| PUT    | `/availability/:id`        | Update availability              | DOCTOR, ADMIN     |               |
| DELETE | `/availability/:id`        | Delete availability              | DOCTOR, ADMIN     |               |

---

## Absences

| Method | Endpoint                 | Description                    | Roles Allowed       | Notes       |
|--------|--------------------------|-------------------------------|---------------------|-------------|
| POST   | `/absence`               | Create an absence period       | DOCTOR              |             |
| GET    | `/absence`               | Get all absences               | PATIENT, DOCTOR, ADMIN |           |
| GET    | `/absence/doctor/:id`    | Get absences by doctor ID      | PATIENT, DOCTOR, ADMIN |           |
| GET    | `/absence/:id`           | Get absence by ID              | PATIENT, DOCTOR, ADMIN |           |
| PUT    | `/absence/:id`           | Update absence                 | DOCTOR, ADMIN       |             |
| DELETE | `/absence/:id`           | Delete absence                 | DOCTOR, ADMIN       |             |

---

## Notifications

| Method | Endpoint                      | Description                  | Roles Allowed | Notes       |
|--------|-------------------------------|------------------------------|---------------|-------------|
| GET    | `/notifications`              | Get notifications for patient| PATIENT       |             |
| GET    | `/notifications/unread-count`| Get count of unread notifications | PATIENT  |             |
| PATCH  | `/notifications/:id/read`    | Mark notification as read    | PATIENT       |             |
| PATCH  | `/notifications/read-all`    | Mark all notifications as read| PATIENT     |             |

---

## Ratings

| Method | Endpoint                    | Description                   | Roles Allowed      | Notes                         |
|--------|-----------------------------|-------------------------------|--------------------|-------------------------------|
| GET    | `/ratings/doctor/:doctorId` | Get ratings for a doctor       | DOCTOR, ADMIN, PATIENT |                            |
| POST   | `/ratings`                  | Post rating for doctor         | PATIENT            | Middleware checks permission  |
| DELETE | `/ratings/:id`              | Delete a rating                | ADMIN, PATIENT     |                               |

---

## Auth Settings (Persistence Mode)

| Method | Endpoint            | Description                 | Roles Allowed | Notes                   |
|--------|---------------------|-----------------------------|---------------|-------------------------|
| POST   | `/auth-settings`    | Set persistence mode         | ADMIN         |                         |
| GET    | `/auth-settings`    | Get current persistence mode | Public        | No authentication needed|

---

# Notes

- All protected routes require the header `Authorization: Bearer <token>`.
- Role-based access control enforced by `authorizeRole(...)` middleware.
- File uploads (for appointments) use multipart form data with field `file`.
- Primary roles: `PATIENT`, `DOCTOR`, and `ADMIN`.
- CORS is configured to allow requests from http://localhost:5173.
---

# Server
- Server runs on process.env.PORT or 8080 by default.
- Uses Socket.io for real-time notifications.
- onnects to MongoDB using connectDB()
- Notification service is wired to Socket.io.

---

