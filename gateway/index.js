const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const rateLimit = require("express-rate-limit");
// const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("./config/config");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
WE COULD HAVE CENTRALIZED AUTHENTICATION INSTEAD OF HAVING ONE IN EACH MICROSERVICE (LATER)
const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
        }
        
        // Verify JWT token (in production, use proper secret management)
        const decoded = jwt.verify(token, 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
*/

const users = proxy("http://js-usermanagement:8081");
const postGrades = proxy("http://js-postgrades:8082");
const reviewRequests = proxy("http://js-reviewrequest:8085");
const replyReviewRequests = proxy("http://js-replyreviewrequest:8086");
const allCourses = proxy("http://js-viewgradestatistics:8087");
const personalCourses = proxy("http://js-viewpersonalgrades:8088");

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all requests
app.use(limiter);

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

// WILL BE CHANGED LATER WHEN ALL MICROSERVICES ARE READY
// SO THAT THERE IS ACTUALLY ROUTING AND NOT ALL REQUESTS GET SENT TO ALL SERVICES
// (will throw an error if it doesnt match, should use next() or specify)
app.use("/auth", users);
app.use("/uploadGrades", postGrades);
app.use("/reviewRequests", reviewRequests);
app.use("/manageReviewRequests", replyReviewRequests);
app.use("/allCourses", allCourses);
app.use("/personalCourses", personalCourses);

// Fallback route
app.use((req, res) => {
  res.status(404).json({ error: "Not Found (Gateway)" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error (Gateway)" });
});

app.listen(8080, () => {
  console.log("Gateway is Listening to Port 8080");
});
