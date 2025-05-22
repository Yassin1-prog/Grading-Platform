# MICROSERVICE

## Post Grades

This microservice is part of the clearSKY SaaS platform and is responsible for accepting and processing grade submissions by instructors. It supports both **initial** and **final** submissions of grades using Excel files, and updates the academic record accordingly. The submitted grades are validated, stored in MongoDB, and broadcast via a message broker (e.g., RabbitMQ) to other microservices in the system.

### Features

- Accepts **initial** and **final** grade submissions via Excel files.
- Parses and validates `.xlsx` files using SheetJS.
- Extracts total and per-question grades for each student.
- Saves or updates data in the `CourseGrades` collection.
- Ensures proper grade submission flow:
  - Initial grades must precede final grades.
  - Final grades replace initial grades.
- Publishes grade data to a message queue for downstream services.

### Technologies Used

- Node.js
- Express.js
- Multer (for file uploads)
- SheetJS (`xlsx`)
- MongoDB with Mongoose
- RabbitMQ (via `amqplib` or custom publisher)
- JWT-based authentication
