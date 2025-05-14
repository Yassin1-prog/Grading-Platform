const { getChannel, EXCHANGE_NAME } = require("../config/rabbitmq");

const publishGradeData = async (gradesData) => {
  try {
    const channel = getChannel();
    if (!channel) {
      throw new Error("RabbitMQ channel not established");
    }

    // Publish the message to the fanout exchange
    const message = JSON.stringify(gradesData);
    const success = channel.publish(
      EXCHANGE_NAME,
      "", // With fanout, routing key is ignored, but we still need to provide it
      Buffer.from(message),
      {
        persistent: true, // Make message persistent, so when a microservice is down and then up again it doesnt miss messages
        contentType: "application/json",
      }
    );

    if (success) {
      console.log("Grade data published successfully");
    } else {
      console.warn("Channel write buffer is full, message publishing delayed");
    }

    return success;
  } catch (error) {
    console.error("Error publishing grade data:", error);
    throw error;
  }
};

module.exports = {
  publishGradeData,
};
