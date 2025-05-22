# MICROSERVICE

## View Grade Statistics

This microservice is part of the clearSKY SaaS platform and is responsible for providing aggregated statistics about student grades per course. It exposes a secure endpoint that returns total and per-question grade distributions for every course in the system, across all terms and instructors.

### Features

- Retrieves aggregated grade statistics for **all available courses**
- Includes:
  - Course name, academic term, status (initial/final), submission dates
  - Total grade distribution for each course (0–10 scale)
  - Per-question grade distribution (10 questions × 0–10 scale)
- Helps students and instructors analyze the performance distribution across the class
- Supports JWT-based authentication (optional)

### Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Docker-ready architecture

