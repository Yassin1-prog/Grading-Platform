# clearSKY – SaaS Grading Platform

## Overview

**clearSKY** is a microservices-based SaaS platform designed to assist educational institutions and students with grade management, review workflows, and statistical insights. It allows instructors to upload and finalize grades, and students to view grades, request reviews, and monitor performance. The application is deployed using Docker containers and includes both backend services and a React-based frontend.

The system follows a **microservices architecture**, and includes the following core components:

### 🛠 Backend Microservices

| Service                 | Description                                                              |
| ----------------------- | ------------------------------------------------------------------------ |
| `User Management`       | Registers and authenticates users, issues JWTs, and manages student info |
| `Post Grades`           | Allows instructors to upload initial and final grades via Excel          |
| `View Personal Grades`  | Enables students to view their personal grades and distributions         |
| `View Grade Statistics` | Returns aggregated grade statistics per course (total & per-question)    |
| `Review Request`        | Allows students to submit grade review requests                          |
| `Reply Review Request`  | Allows instructors to respond to pending review requests                 |

### 🌐 Frontend

A React application that integrates with the backend services and allows:

- Students to view grades and submit review requests
- Instructors to upload grades and respond to reviews
- Admins/developers to manage user data

### 🔀 Gateway

A lightweight **API Gateway** that routes requests from the frontend to the appropriate backend services, handling JWT validation and service discovery.

### 📘 Architecture Diagram

Provided in the [`clearSKY.vpp`](./architecture/clearSKY.vpp) file and includes:

- UML Class, Component, Deployment & Sequence diagrams
- Class definitions for APIs and data types (JSON objects)
- Deployment view with exposed ports

---

## 🧪 Features by Role

### 👨‍🎓 Students

- Login
- View personal grades
- View overall course statistics
- Submit grade review requests
- Track responses to submitted reviews

### 👩‍🏫 Instructors

- Login
- Upload initial/final grades (.xlsx)
- View pending review requests
- Respond to review requests

---

## 👩🏻‍💻 Technologies Used

- **Node.js**, **Express.js**
- **MongoDB** with Mongoose ODM
- **React** (frontend)
- **RabbitMQ** (for async communication between services)
- **JWT** for authentication
- **Docker & Docker Compose**
- **Visual Paradigm / PlantUML** for architecture

---

## 📦 Installation & Deployment

### Requirements

- Docker
- Node.js & npm (for development)
- MongoDB (locally or via Docker)
- RabbitMQ (locally or via Docker)

### Development

```bash
# Clone the repository
git clone https://github.com/your-team/clearsky-saas.git
cd clearsky-saas

# Start all services
docker-compose up --build
```
