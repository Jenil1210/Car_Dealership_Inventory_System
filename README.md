# 🚗 Car Dealership Inventory System

> **TDD Kata — Incubyte Assessment**

A full-stack Car Dealership Inventory System built with **Test-Driven Development (TDD)**, following the **Red-Green-Refactor** methodology. The system enables secure user authentication, role-based authorization, vehicle inventory management, advanced search, purchase tracking, and inventory analytics.

---

# Tech Stack

| Layer | Technology |
|--------|------------|
| Backend | Java 17 + Spring Boot 3 |
| Database | PostgreSQL |
| Authentication | JWT (jjwt) |
| Frontend | React 18 + Vite |
| Testing | JUnit 5 + Mockito + MockMvc |
| Frontend Testing | Vitest + React Testing Library |
| Coverage | JaCoCo |

---

# 🌐 Live Demo

- **Frontend (Vercel):** https://car-dealership-inventory-system-x9j.vercel.app
- **Backend API:** https://car-dealership-inventory-system-x9j.vercel.app/api

---

# Project Status

🟢 **Completed & Deployed**

✔ JWT Authentication

✔ Role Based Authorization

✔ Vehicle Inventory CRUD

✔ Advanced Search

✔ Purchase History

✔ Restocking System

✔ TDD Implementation

✔ Responsive UI

---

# ⚙️ Test Cases & TDD Coverage

This project follows **Test Driven Development (TDD)** throughout the development lifecycle.

## Backend Testing (JUnit 5 + Mockito + MockMvc)

**58 Automated Test Cases**

### Authentication & JWT
- User Registration
- Duplicate Email Validation
- User Login
- Invalid Password Handling
- JWT Generation
- JWT Validation
- Token Parsing

### User Management
- Get Users
- Delete User
- Authorization Validation
- Profile Retrieval

### Vehicle Inventory
- Add Vehicle
- Update Vehicle
- Delete Vehicle
- Search Vehicles
- Filtering

### Purchase & Stock
- Purchase Vehicle
- Out Of Stock Validation
- Restock Inventory

### Seeder
- Default Admin User

---

## Frontend Testing (Vitest + React Testing Library)

**15 Automated Test Cases**

### Authentication
- Login Page
- Register Page
- Validation
- JWT Storage

### Dashboard
- Load Vehicles
- Search
- Purchase
- Logout

### Admin Dashboard
- Add Vehicle
- Delete Vehicle
- Update Vehicle
- Restock Vehicle

### Routing
- Protected Routes
- Admin Route Validation

---

# 📊 Automated Test Reports

## Backend

```text
Results:

Tests run: 58
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
```

## Frontend

```text
Test Files 5 passed
Tests 15 passed
```

---

# 🚀 Application Walkthrough

The following screenshots demonstrate the primary workflows and features of the Car Dealership Inventory System.

---

## 🔑 Authentication Portal

Secure JWT-based authentication with dedicated login and registration pages.

![Authentication](docs/screenshots/login.png)

---

## 📊 Admin Inventory Management Dashboard

Administrative dashboard displaying inventory statistics, low stock alerts, total categories, active models, and complete inventory management controls.

![Admin Dashboard](docs/screenshots/admin_dashboard.png)

---

## ➕ Vehicle Management

Administrators can add new vehicles, update inventory details, restock existing vehicles, and remove vehicles from the catalog.

![Vehicle Management](docs/screenshots/vehicle_management.png)

---

## 🚗 Customer Showroom & Advanced Search

Customers can browse available vehicles, filter inventory by manufacturer, model, category, and price range, then purchase available vehicles.

![Customer Dashboard](docs/screenshots/customer_dashboard.png)

---

## 📜 Purchase History

Authenticated users can securely review their purchase history including acquisition date, category, quantity, and purchase value.

![Purchase History](docs/screenshots/purchase_history.png)

---

# Setup Instructions

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL

---

## Backend

```bash
cd backend

mvn clean compile

mvn test

mvn spring-boot:run
```

---

## Frontend

```bash
cd frontend

npm install

npm run test

npm run dev
```

---

# 🤖 AI Usage

This project was developed using AI pair programming with **Antigravity (Google DeepMind)**.

### AI Assisted Tasks

- TDD Test Case Generation
- Spring Boot Development
- JWT Authentication
- REST API Development
- React Components
- State Management
- Bug Fixing
- Refactoring
- Documentation

---

# Git Commit Convention

```
test:     RED
feat:     GREEN
refactor: REFACTOR
docs:     Documentation
style:    UI Changes
chore:    Configuration
```

Every AI-assisted commit includes

```
Co-authored-by: Antigravity (Google DeepMind) <AI@users.noreply.github.com>
```
