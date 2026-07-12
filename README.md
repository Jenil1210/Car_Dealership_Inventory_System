# 🚗 Car Dealership Inventory System

> **TDD Kata — Incubyte Assessment**

A full-stack Car Dealership Inventory System built with **Test-Driven Development (TDD)**, following the Red-Green-Refactor pattern.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17 + Spring Boot 3 |
| Database | PostgreSQL |
| Auth | JWT (jjwt) |
| Frontend | React 18 + Vite |
| Testing | JUnit 5 + Mockito + MockMvc |
| Coverage | JaCoCo |

---

## 🌐 Deployed Live Demo (Optional - Brownie Points)

* **Frontend Showroom (Vercel)**: [https://car-dealership-inventory-system-x9j.vercel.app](https://car-dealership-inventory-system-x9j.vercel.app)
* **Backend API (AWS Elastic Beanstalk - Proxied)**: [https://car-dealership-inventory-system-x9j.vercel.app/api](https://car-dealership-inventory-system-x9j.vercel.app/api)

---

## Project Status

🟢 **Completed & Deployed** — All user stories and technical constraints fully satisfied.


---

## Setup Instructions

### Prerequisites
- **Java 17+** (JDK 17 or JDK 21 installed)
- **Maven 3.8+**
- **Node.js 18+** & **npm** (for the frontend application)
- **PostgreSQL 14+** (configured database for production/development profile)

---

### Backend Setup & Execution

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure database credentials inside `src/main/resources/application.properties` (specifically `spring.datasource.username` and `spring.datasource.password`).
3. Build the application and compile dependencies:
   ```bash
   mvn clean compile
   ```
4. Run the automated test suite (uses H2 in-memory DB by default):
   ```bash
   mvn test
   ```
5. Start the Spring Boot backend server (runs on port `8080`):
   ```bash
   mvn spring-boot:run
   ```

---

### Frontend Setup & Execution

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependency packages:
   ```bash
   npm install
   ```
3. Run the Vitest unit/integration test suite:
   ```bash
   npm run test
   ```
4. Launch the local React development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## My AI Usage

This project was built in pairing collaboration with **Antigravity (Google DeepMind)**, an AI coding assistant. 

### Tools Used
* **Antigravity (Google DeepMind)**: Served as the primary pairing partner for code design, refactoring, TDD test writing, and bug hunting.

### AI Assistance Log
1. **TDD RED-GREEN-REFACTOR Cycle**: Assisted in writing failing JUnit/Mockito tests in the backend and Vitest/Testing-Library tests in the frontend, followed by implementation to make them pass.
2. **Backend Services & API Controllers**: Co-authored Spring Security rules, Jwt filters, User and Vehicle REST controllers, and automated seeder scripts.
3. **Frontend Component Development**: Built the dashboard pages, search filters, stateful restocking inputs, edit/update modals, and routing guard components.
4. **Build & Test Automation**: Provided command line instructions, executed build verification steps, and investigated surefire reports and DOM dumps to fix bugs.

### Reflection
The AI pairing model significantly increased development velocity by handling repetitive boilerplate, generating mock test scenarios, and ensuring that SOLID principles were adhered to throughout refactoring phases. The structured TDD cycle worked seamlessly with automated test suggestions.

---

## Git Commit Convention

This project follows **Conventional Commits** with a TDD pattern:

```
test:     Writing a failing test (🔴 RED)
feat:     Implementing the feature (🟢 GREEN)
refactor: Cleaning up code (🔵 REFACTOR)
chore:    Setup, config, dependencies
style:    CSS, formatting
docs:     Documentation
```

Every AI-assisted commit includes:
```
Co-authored-by: Antigravity (Google DeepMind) <AI@users.noreply.github.com>
```
