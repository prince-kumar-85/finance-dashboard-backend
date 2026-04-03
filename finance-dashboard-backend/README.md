# Finance Dashboard Backend

A fully functional backend assignment project for **finance data processing and access control**, built with **Node.js, Express, MongoDB, and Mongoose**.

## Features

- JWT based authentication
- Role based access control (viewer, analyst, admin)
- User management
- Financial records CRUD
- Filtering, search, and pagination for financial records
- Dashboard analytics APIs
- Soft delete for financial records
- Input validation and centralized error handling
- Seed script for demo users and sample records

## Roles and Permissions

| Role | Dashboard Summary | View Records | Create/Update/Delete Records | Manage Users |
|------|-------------------|-------------|------------------------------|--------------|
| Viewer | Yes | No | No | No |
| Analyst | Yes | Yes | No | No |
| Admin | Yes | Yes | Yes | Yes |

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-validator

## Project Setup

### 1. Clone and install

```bash
git clone <your-repository-url>
cd finance-dashboard-backend
npm install
```

### 2. Create environment file

Create a `.env` file based on `.env.example`.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finance_dashboard
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Run project

```bash
npm run dev
```

### 4. Seed demo data

```bash
npm run seed
```

## Demo Credentials

- **Admin:** `admin@example.com` / `Password@123`
- **Analyst:** `analyst@example.com` / `Password@123`
- **Viewer:** `viewer@example.com` / `Password@123`

## API Endpoints

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Users (Admin only)

- `GET /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`

## Records

- `POST /api/records` → Admin only
- `GET /api/records` → Analyst, Admin
- `GET /api/records/:id` → Analyst, Admin
- `PUT /api/records/:id` → Admin only
- `DELETE /api/records/:id` → Admin only

### Record Filters

`GET /api/records?type=expense&category=Food&startDate=2026-03-01&endDate=2026-03-31&page=1&limit=10&search=groceries`

## Dashboard

- `GET /api/dashboard/summary`
- `GET /api/dashboard/categories`
- `GET /api/dashboard/recent`
- `GET /api/dashboard/trends?groupBy=month`
- `GET /api/dashboard/trends?groupBy=week`

## Example Request Flow

### 1. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Password@123"
}
```

### 2. Use token

```http
Authorization: Bearer <your_token>
```

### 3. Create financial record

```http
POST /api/records
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "amount": 7000,
  "type": "income",
  "category": "Bonus",
  "date": "2026-04-01",
  "notes": "Performance bonus"
}
```

## Assumptions

- New users can be registered with any role for assignment simplicity.
- In real production, only admins should create privileged users.
- Inactive users cannot log in or access protected routes.
- Soft deleted records are excluded from dashboard analytics and normal record listing.

## Tradeoffs

- Refresh tokens are not implemented to keep the solution focused.
- Swagger is not included, but can be added easily.
- MongoDB was chosen for simplicity and fast development.

## Suggested Submission Add-ons

You can optionally add:

- Swagger documentation
- Unit tests with Jest
- Deployment on Render / Railway
- Postman collection

