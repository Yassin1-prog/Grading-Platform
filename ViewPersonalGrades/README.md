# MICROSERVICE

## View Personal Grades

This microservice is part of the clearSKY SaaS platform and is responsible for enabling authenticated students to view their personal grades in all enrolled courses. In addition to individual grades, the service provides detailed grade distributions at both the total and per-question level for statistical transparency and self-assessment.

### Features

- Retrieves personal grades for the currently authenticated student
- Includes:
  - Course name, term, status (e.g., final/initial)
  - Total grade and per-question breakdown
  - Grade distribution across all students for each course:
    - Overall total grade distribution (0–10)
    - Per-question grade distribution (10 questions × 0–10 scale)
- JWT-based authentication required

### Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Docker-ready architecture

