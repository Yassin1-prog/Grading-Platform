// src/services/messageConsumer.js
const {
  connect,
  getChannel,
  EXCHANGE_NAME,
  QUEUE_PREFIX,
} = require("../config/rabbitmq");

// Import appropriate model for each service
const CourseGrades = require("../database/models/CourseGrades"); // Adjust based on service

const setupConsumer = async () => {
  try {
    await connect();
    const channel = getChannel();

    // Create a queue with a unique name for this service
    const queueName = `${QUEUE_PREFIX}_grades_queue`;

    // Assert queue with these options for durability and message handling
    const { queue } = await channel.assertQueue(queueName, {
      durable: true, // Queue survives broker restart
      arguments: {
        "x-message-ttl": 1000 * 60 * 60 * 24 * 7, // Messages expire after 7 days
        "x-dead-letter-exchange": "dead_letter_exchange", // For unprocessed messages
      },
    });

    // Create a dead letter exchange and queue for failed messages
    await channel.assertExchange("dead_letter_exchange", "direct", {
      durable: true,
    });
    await channel.assertQueue(`${queueName}_dlq`, { durable: true }); // queue is durable for sychronization matters
    await channel.bindQueue(
      `${queueName}_dlq`,
      "dead_letter_exchange",
      queueName
    );

    // Bind the queue to the exchange
    await channel.bindQueue(queue, EXCHANGE_NAME, "");

    // Set prefetch to limit how many unacknowledged messages a consumer can have
    channel.prefetch(1);

    // Consume messages
    channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        // Process the message
        const gradesData = JSON.parse(msg.content.toString());
        console.log(
          `Received grades data for course: ${gradesData.courseName}`
        );

        // Process based on service type (this would be different for each service)
        await processGradesData(gradesData);

        // Acknowledge the message after successful processing
        channel.ack(msg); //very improtant manual ack, so if microservice is down messages will accumulate in the queue
      } catch (error) {
        console.error("Error processing message:", error);

        // Reject the message and don't requeue if it's a parsing error
        // (would go to dead letter queue)
        const requeue = !(error instanceof SyntaxError);
        channel.reject(msg, requeue);
      }
    });

    console.log(`Consumer set up successfully for queue: ${queueName}`);
  } catch (error) {
    console.error("Failed to set up consumer:", error);
    // Retry setup after delay
    setTimeout(setupConsumer, 5000);
  }
};

// This function would be different for each microservice
const processGradesData = async (gradesData) => {
  // Example implementation for "View Grade Statistics" service
  try {
    // Upsert operation - update if exists, insert if not
    await CourseGrades.findOneAndUpdate(
      {
        instructorId: gradesData.instructorId,
        courseName: gradesData.courseName,
        term: gradesData.term,
      },
      gradesData,
      { upsert: true, new: true }
    );

    console.log(`Processed grades for ${gradesData.courseName} successfully`);
  } catch (error) {
    console.error("Error saving grades data:", error);
    throw error; // Re-throw to trigger message requeue
  }
};

module.exports = {
  setupConsumer,
};
