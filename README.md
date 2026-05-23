# RetireWise — Retirement Account Dashboard

A full-stack web application for tracking 401(k) account balances, contribution history, and modeling retirement income projections. Built with Java/Spring Boot and Angular.

## Tech Stack

| Layer      | Technology                                     |
|------------|------------------------------------------------|
| Frontend   | Angular 19, TypeScript, Chart.js               |
| Backend    | Java 17, Spring Boot 3, Spring Security        |
| Database   | PostgreSQL 16, Flyway migrations               |
| Auth       | JWT access + refresh tokens, BCrypt, RBAC      |
| Infra      | Docker, Docker Compose, GitHub Actions CI      |

## Features

- **JWT Authentication** — Register, login, and token refresh with role-based access control
- **Dashboard** — Total balance, YTD contribution progress against IRS limits, balance-over-time line chart, asset allocation doughnut chart, recent contributions table
- **Contribution History** — Paginated table with employee/employer breakdown, add-contribution modal, pay period tracking
- **Retirement Projections** — Compound growth calculator with adjustable parameters (age, return rate, contribution amount), projected balance and estimated monthly income via the 4% rule, interactive growth curve chart
- **Security** — Stateless JWT sessions, BCrypt password hashing, XSS/clickjacking headers, input validation with Jakarta Bean Validation, CORS configuration

## Architecture

```
Angular (SPA)  ──HTTP/REST──▶  Spring Boot API  ──JPA/JDBC──▶  PostgreSQL
     │                              │
 JWT Interceptor            JWT Auth Filter
 Auth Guard                 Spring Security
 Chart.js                   Flyway Migrations
```

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Run with Docker Compose

```bash
# Clone the repository
git clone https://github.com/stevenzhang/retirement-dashboard.git
cd retirement-dashboard

# Start all services (PostgreSQL, backend, frontend)
docker compose up --build

# App is available at http://localhost:4200
# API is available at http://localhost:8080
```

### Demo Account

After starting, log in with the seeded demo user:

| Field    | Value              |
|----------|--------------------|
| Email    | demo@example.com   |
| Password | password123        |

### Local Development

**Backend:**
```bash
# Requires Java 17+ and a running PostgreSQL instance
cd backend
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm start
# Proxies API requests to localhost:8080
```

## API Endpoints

| Method | Endpoint                                    | Auth     | Description                  |
|--------|---------------------------------------------|----------|------------------------------|
| POST   | `/api/auth/register`                        | Public   | Create account               |
| POST   | `/api/auth/login`                           | Public   | Get JWT tokens               |
| POST   | `/api/auth/refresh`                         | Public   | Refresh access token         |
| GET    | `/api/accounts`                             | Bearer   | List user's accounts         |
| GET    | `/api/accounts/{id}/contributions`          | Bearer   | Paginated contribution list  |
| POST   | `/api/accounts/{id}/contributions`          | Bearer   | Add a contribution           |
| GET    | `/api/accounts/{id}/contributions/summary`  | Bearer   | YTD totals vs IRS limit      |
| GET    | `/api/accounts/{id}/balance-history`        | Bearer   | Monthly balance snapshots    |
| GET    | `/api/accounts/{id}/asset-allocation`       | Bearer   | Current allocation breakdown |
| POST   | `/api/projections/calculate`                | Bearer   | Run retirement projection    |

## Project Structure

```
├── backend/
│   ├── src/main/java/com/stevenzhang/retirement/
│   │   ├── config/          # SecurityConfig, CorsConfig
│   │   ├── controller/      # AuthController, AccountController, ProjectionController
│   │   ├── dto/             # Request/response records
│   │   ├── entity/          # JPA entities (User, Account, Contribution, etc.)
│   │   ├── exception/       # GlobalExceptionHandler
│   │   ├── repository/      # Spring Data JPA repositories
│   │   ├── security/        # JwtTokenProvider, JwtAuthFilter
│   │   └── service/         # AuthService, AccountService, ProjectionService
│   ├── src/main/resources/db/migration/  # Flyway SQL migrations
│   └── Dockerfile
├── frontend/
│   ├── src/app/
│   │   ├── core/            # AuthService, ApiService, interceptor, guard
│   │   └── features/        # auth, dashboard, contributions, projections
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/ci.yml
```
