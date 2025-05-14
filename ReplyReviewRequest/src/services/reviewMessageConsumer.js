// src/services/reviewMessageConsumer.js (Reply to Review Request Service)
const {
  connect,
  getChannel,
  REVIEW_EXCHANGE,
  QUEUE_PREFIX,
} = require("../config/rabbitmq");

const { CourseGradesReview } = require("../database/models/ReviewRequest");

const setupReviewConsumer = async () => {
  try {
    await connect();
    const channel = getChannel();

    // Create a queue for new review requests
    const queueName = `${QUEUE_PREFIX}_new_review_queue`;

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
    await channel.bindQueue(queue, REVIEW_EXCHANGE, "new_review");

    // Set prefetch to limit unacknowledged messages
    channel.prefetch(1);

    // Consume messages
    channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        // Process the message
        const reviewData = JSON.parse(msg.content.toString());
        console.log(
          `Received new review request for student: ${reviewData.studentId}`
        );

        // Process the review request
        await processReviewRequest(reviewData);

        // Acknowledge the message
        channel.ack(msg);
      } catch (error) {
        console.error("Error processing review request message:", error);

        // Reject and decide whether to requeue based on error type
        const requeue = !(error instanceof SyntaxError);
        channel.reject(msg, requeue);
      }
    });

    console.log(
      `Review request consumer set up successfully for queue: ${queueName}`
    );
  } catch (error) {
    console.error("Failed to set up review request consumer:", error);
    // Retry setup after delay
    setTimeout(setupReviewConsumer, 5000);
  }
};

const processReviewRequest = async (reviewData) => {
  try {
    const { courseName, term, studentId, comment } = reviewData;

    // Find or create course grades document
    let courseGrades = await CourseGradesReview.findOne({
      courseName,
      term,
      "studentGrades.studentId": studentId,
    });

    if (!courseGrades) {
      console.warn(
        `Course document not found for review request. Creating a placeholder.`
      );
      // Create a minimal placeholder if it doesn't exist
      // This might happen if this service hasn't yet received the grades data
      courseGrades = new CourseGradesReview({
        courseName,
        term,
        studentGrades: [
          {
            studentId,
            totalGrade: 0, // Placeholder
            gradeByQuestion: [], // Placeholder
            reviewRequests: {
              comment,
              status: "pending",
            },
          },
        ],
      });
    } else {
      // Find the student grade
      let studentGrade = courseGrades.studentGrades.find(
        (grade) => grade.studentId === studentId
      );

      if (!studentGrade) {
        // Add student if not found
        courseGrades.studentGrades.push({
          studentId,
          totalGrade: 0, // Placeholder
          gradeByQuestion: [], // Placeholder
          reviewRequests: {
            comment,
            status: "pending",
          },
        });
      } else {
        // Update existing review request
        studentGrade.reviewRequests = {
          comment,
          status: "pending",
        };
      }
    }

    await courseGrades.save();
    console.log(
      `Saved review request for student ${studentId} in course ${courseName}`
    );
  } catch (error) {
    console.error("Error saving review request data:", error);
    throw error; // Re-throw to trigger message requeue
  }
};

module.exports = {
  setupReviewConsumer,
};
