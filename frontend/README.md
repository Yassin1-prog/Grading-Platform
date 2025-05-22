# Academic Grading System Frontend

A modern, responsive web application for managing academic grades, review requests, and course statistics.

![Grading System Dashboard](https://placeholder.com/grading-system-dashboard.png)

## Overview

This Academic Grading System provides a comprehensive platform for instructors and students to manage the grading process. Instructors can upload grades, manage review requests, and view grade distributions, while students can view their grades and submit review requests.

## Features

### For Students

- **View Grades**: Access grades for all enrolled courses
- **Grade Visualization**: View grade distributions with personal grade highlighted
- **Review Requests**: Submit and track grade review requests

### For Instructors

- **Grade Upload**: Upload initial and final grades via Excel files
- **Review Management**: Respond to student review requests
- **Grade Statistics**: View grade distributions across courses and questions

### General Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Authentication**: Secure role-based access control
- **Data Visualization**: Interactive charts for grade distributions
- **Sorting & Filtering**: Organize and find information easily

## Technologies Used

- **React**: Frontend library for building user interfaces
- **Vite**: Next-generation frontend tooling
- **React Router**: For navigation and routing
- **Recharts**: For data visualization
- **Axios**: For API requests
- **Tailwind CSS**: For styling and responsive design

## Project Structure

\`\`\`
grading-system/
├── public/ # Static files
├── src/
│ ├── components/ # Reusable UI components
│ ├── context/ # React context providers
│ ├── pages/ # Page components
│ │ ├── instructor/ # Instructor-specific pages
│ │ └── student/ # Student-specific pages
│ ├── services/ # API services
│ ├── App.jsx # Main application component
│ ├── index.css # Global styles
│ └── main.jsx # Application entry point
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
\`\`\`

## Installation

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Setup

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/grading-system.git
   cd grading-system
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install

   # or

   yarn install
   \`\`\`

3. Create a `.env` file in the root directory with the following content:
   \`\`\`
   VITE_API_URL=http://localhost:8080
   \`\`\`
   Replace the URL with your backend API URL.

4. Start the development server:
   \`\`\`bash
   npm run dev

   # or

   yarn dev
   \`\`\`

5. Open your browser and navigate to `http://localhost:5173`

## Building for Production

\`\`\`bash
npm run build

# or

yarn build
\`\`\`

The build artifacts will be stored in the `dist/` directory.

## API Integration

The frontend communicates with a RESTful API backend. The main API endpoints include:

### Authentication

- `POST /auth/login`: User login
- `GET /auth/users`: Get all users

### Courses

- `GET /allCourses/statistics`: Get all courses with grade statistics
- `GET /personalCourses/grades/mine`: Get courses for the current student

### Grade Upload

- `POST /uploadGrades/postInitialGrades`: Upload initial grades
- `POST /uploadGrades/postFinalGrades`: Upload final grades

### Review Requests

- `GET /reviewRequests/my-review-requests`: Get review requests for the current student
- `POST /reviewRequests/review-request`: Submit a new review request
- `GET /manageReviewRequests/my-review-requests-instructor`: Get review requests for the instructor
- `POST /manageReviewRequests/reply-review-request`: Reply to a review request

## Usage

### Login

Use your provided credentials to log in. The system will automatically direct you to the appropriate dashboard based on your role (student or instructor).

### Student Workflow

1. **Dashboard**: View all available courses and grade distributions
2. **My Grades**: View personal grades for all courses
3. **Review Requests**: Submit and track grade review requests

### Instructor Workflow

1. **Dashboard**: View all courses and grade distributions
2. **Grade Upload**: Upload initial or final grades via Excel files
3. **Review Management**: Respond to student review requests

## File Format for Grade Upload

The Excel file for grade uploads should follow this format:

| Student ID | Total Grade | Q1  | Q2  | Q3  | ... | Q10 |
| ---------- | ----------- | --- | --- | --- | --- | --- |
| S10001     | 8           | 9   | 8   | 7   | ... | 8   |
| S10002     | 7           | 7   | 7   | 6   | ... | 7   |

- First column: Student ID
- Second column: Total Grade (0-10)
- Subsequent columns: Individual question grades (0-10)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
  \`\`\`
