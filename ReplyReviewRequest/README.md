# MICROSERVICE

## Reply Review Request

The Reply Review Request microservice is part of the clearSKY SaaS platform and is designed for instructors to handle student review requests. It allows instructors to view pending requests for courses they submitted and to post a response, marking each request as either `accepted` or `rejected`.

### Features

- **Fetch pending review requests** per instructor
- **Reply to review requests** with a comment and resolution
- Prevents duplicate replies and disallows action if the course is closed
- Publishes instructor responses to a message broker (e.g., RabbitMQ)

### Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT-based authentication
- RabbitMQ (via publisher service)
