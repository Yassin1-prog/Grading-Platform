// src/services/reviewMessagePublisher.js (Review Request Service)
const { getChannel, REVIEW_EXCHANGE } = require("../config/rabbitmq");

const publishReviewRequest = async (reviewData) => {
  try {
    const channel = getChannel();
    if (!channel) {
      throw new Error("RabbitMQ channel not established");
    }

    // Format the message for the Reply service
    const message = JSON.stringify({
      type: "new_review_request",
      courseName: reviewData.courseName,
      term: reviewData.term,
      studentId: reviewData.studentId,
      comment: reviewData.comment,
      status: "pending",
      timestamp: new Date().toISOString(),
    });

    // Use 'new_review' as the routing key
    const routingKey = "new_review";

    const success = channel.publish(
      REVIEW_EXCHANGE,
      routingKey,
      Buffer.from(message),
      {
        persistent: true,
        contentType: "application/json",
      }
    );

    if (success) {
      console.log("Review request published successfully");
    } else {
      console.warn("Channel write buffer is full, message publishing delayed");
    }

    return success;
  } catch (error) {
    console.error("Error publishing review request:", error);
    throw error;
  }
};

module.exports = {
  publishReviewRequest,
};
