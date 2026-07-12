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


# 🤖 AI Usage

This project was developed using AI pair programming with **Google Gemini & Cluade**.

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

---

# 🖼️ Showcase Gallery

The following screenshots highlight the finished design and workflows of the Car Dealership Inventory System.

### 🔐 Modern Portal Login
The login screen featuring custom glassmorphism panels, luxury vehicle wireframe outlines, and gold color styling.
![Modern Portal Login](images/Screenshot%202026-07-12%20135208.png)

---

### 🛠️ Administrative Dashboard Control Panel
Management view tracking active models, total units in stock, low-stock warnings, and direct restock/catalog commands.
![Admin Dashboard Control Panel](images/Screenshot%202026-07-12%20135246.png)

---

### 📥 Catalog New Asset Dialog
The interactive modal for registering and cataloging new premium vehicles into the dealership database.
![Catalog New Asset Dialog](images/Screenshot%202026-07-12%20135258%20-%20Copy.png)

---

### 🔍 Customer Showroom Search & Filter Console
The customer landing view displaying active stock summaries and the live filtering console for searching models.
![Search & Filter Console](images/Screenshot%202026-07-12%20135354.png)

---

### 🛒 Active Showroom Catalog Cards
Showroom product cards with custom vehicle outline designs, availability tags, and purchase triggers.
![Showroom Cards](images/Screenshot%202026-07-12%20135413.png)

---

### 📜 Customer Secure Garage & Acquisition Log
The secure customer profile log showing purchased vehicles, transaction dates, and total values.
![Secure Garage Log](images/Screenshot%202026-07-12%20135436.png)
