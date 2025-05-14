// src/services/reviewResponsePublisher.js (Reply to Review Request Service)
const { getChannel, REVIEW_EXCHANGE } = require("../config/rabbitmq");

const publishReviewResponse = async (responseData) => {
  try {
    const channel = getChannel();
    if (!channel) {
      throw new Error("RabbitMQ channel not established");
    }

    // Format the message for the Review Request service
    const message = JSON.stringify({
      type: "review_response",
      courseName: responseData.courseName,
      term: responseData.term,
      studentId: responseData.studentId,
      response: responseData.responseText,
      status: responseData.status,
      timestamp: new Date().toISOString(),
    });

    // Use 'review_response' as the routing key
    const routingKey = "review_response";

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
      console.log("Review response published successfully");
    } else {
      console.warn("Channel write buffer is full, message publishing delayed");
    }

    return success;
  } catch (error) {
    console.error("Error publishing review response:", error);
    throw error;
  }
};

module.exports = {
  publishReviewResponse,
};
