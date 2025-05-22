# MICROSERVICE

## Review Request

The Review Request microservice is part of the clearSKY SaaS platform. It allows students to submit review requests for course grades within the permitted review window. The service validates the request, stores it within the grade record, and publishes it to a message broker for further processing (e.g., instructor's ReplyReviewRequest microservice).

### Features

- **Submit review requests** for a specific course and term
- **Retrieve submitted review requests** by the authenticated student
- **List all courses** in which the student is enrolled
- Ensures that:
  - Reviews are not allowed after the course is marked as `closed`
  - Duplicate review requests are prevented
- Publishes each request to RabbitMQ for asynchronous handling

### Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- RabbitMQ (via publisher service)
