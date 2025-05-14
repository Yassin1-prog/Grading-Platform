// src/services/reviewResponseConsumer.js (Review Request Service)
const {
  connect,
  getChannel,
  REVIEW_EXCHANGE,
  QUEUE_PREFIX,
} = require("../config/rabbitmq");

const { CourseGradesReview } = require("../database/models/ReviewRequest");

const setupResponseConsumer = async () => {
  try {
    await connect();
    const channel = getChannel();

    // Create a queue for review responses
    const queueName = `${QUEUE_PREFIX}_review_response_queue`;

    // Assert queue with durability and message handling options
    const { queue } = await channel.assertQueue(queueName, {
      durable: true,
      arguments: {
        "x-message-ttl": 1000 * 60 * 60 * 24 * 7, // 7 days
        "x-dead-letter-exchange": "dead_letter_exchange",
        "x-dead-letter-routing-key": queueName,
      },
    });

    // Bind the queue to the exchange with the proper routing key
    await channel.bindQueue(queue, REVIEW_EXCHANGE, "review_response");

    // Set prefetch to limit unacknowledged messages
    channel.prefetch(1);

    // Consume messages
    channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        // Process the message
        const responseData = JSON.parse(msg.content.toString());
        console.log(
          `Received review response for student: ${responseData.studentId}`
        );

        // Process the review response
        await processReviewResponse(responseData);

        // Acknowledge the message
        channel.ack(msg);
      } catch (error) {
        console.error("Error processing review response message:", error);

        // Reject and decide whether to requeue based on error type
        const requeue = !(error instanceof SyntaxError);
        channel.reject(msg, requeue);
      }
    });

    console.log(
      `Review response consumer set up successfully for queue: ${queueName}`
    );
  } catch (error) {
    console.error("Failed to set up review response consumer:", error);
    // Retry setup after delay
    setTimeout(setupResponseConsumer, 5000);
  }
};

const processReviewResponse = async (responseData) => {
  try {
    const { courseName, term, studentId, response, status } = responseData;

    // Find the course grades document
    const courseGrades = await CourseGradesReview.findOne({
      courseName,
      term,
      "studentGrades.studentId": studentId,
    });

    if (!courseGrades) {
      console.error(
        `Course not found for response to review request: ${courseName}, ${term}`
      );
      throw new Error("Course not found");
    }

    // Find the student grade
    const studentGrade = courseGrades.studentGrades.find(
      (grade) => grade.studentId === studentId
    );

    if (!studentGrade) {
      console.error(`Student ${studentId} not found in course ${courseName}`);
      throw new Error("Student not found");
    }

    // Update the review request with the response
    if (studentGrade.reviewRequests) {
      studentGrade.reviewRequests.response = response;
      studentGrade.reviewRequests.status = status;
    } else {
      // If no review request exists yet, create one
      studentGrade.reviewRequests = {
        comment: "Review request details not available",
        response,
        status,
      };
    }

    await courseGrades.save();
    console.log(
      `Updated review request with response for student ${studentId}`
    );
  } catch (error) {
    console.error("Error saving review response data:", error);
    throw error; // Re-throw to trigger message requeue
  }
};

module.exports = {
  setupResponseConsumer,
};
