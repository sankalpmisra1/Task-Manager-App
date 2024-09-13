# Task Manager App
## Table of Contents
1. Introduction
2. Setup
3. API Overview
4. Endpoints
- User Registration
- User Login
- User Logout
- Get User Profile
- Role-Based Access Control (RBAC)
- Task Management
- Task Assignment
- Notifications
5. Unit Tests
## Introduction
This project implements a user registration and login system with role-based access control (RBAC) and task management features. It includes security measures to protect against common threats such as SQL injection, XSS, and CSRF attacks.

## Setup
### Prerequisites
- Node.js
- npm
- MongoDB
### Installation
1. Clone the repository:
```
git clone https://github.com/sankalpmisra1/Task-Manager-App.git
cd repository-name
```

2. Install dependencies:
```
npm install
npm install swagger-jsdoc swagger-ui-express
npm install --save-dev jest supertest nodemon

```

4. Configure environment variables: Create a .env file in the root directory and add the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:<port>/<collection_name>
JWT_SECRET=<Enter your string>
SENDGRID_API_KEY=<Enter your key>
SENDGRID_EMAIL=<Enter Email id>
```

4. Start the server:
npm start

## API Overview
The API provides endpoints for user registration, login, logout, profile retrieval, task management, and notifications. It uses JWT for authentication and implements role-based access control.

## Endpoints
### User Registration
- Endpoint: /api/auth/register
- Method: POST
- Description: Allows users to sign up by providing a username, email, and password.
- Validation:
  - Valid email format.
  - Strong password criteria.
- Optional: Sends a confirmation email upon successful registration.
### User Login
- Endpoint: /api/auth/login
- Method: POST
- Description: Allows registered users to log in using their credentials (username/email and password).
- Functionality:
  - Validates user credentials.
  - Issues a JWT token upon successful login.
- Security: Implements rate limiting to prevent brute-force attacks.
### User Logout
- Endpoint: /api/auth/logout
- Method: POST
- Description: Logs out the authenticated user.
- Functionality: Invalidates the JWT token to ensure the user is logged out securely.
### Get User Profile
- Endpoint: /api/auth/profile
- Method: GET
- Description: Retrieves the profile information of the authenticated user.
- Fields: Includes fields such as username, email, roles, and any other relevant user information.
- Security: Ensures the endpoint is protected and accessible only to authenticated users.
### Role-Based Access Control (RBAC)
- Implementation: Defines different roles with varying access levels to endpoints:
  - Admin: Full access to all endpoints, including user management and task assignment.
  - Manager: Access to manage tasks and view user profiles within their team.
  - User: Access to manage their own tasks and view their own profile.
- Security: Enforces role-based restrictions at the endpoint level.
### Task Management
- CRUD Operations:
  - Create Task: Endpoint to create a new task with fields such as title, description, due date, priority, and status.
  - Read Task: Endpoint to retrieve a list of tasks, with optional filtering and sorting parameters.
  - Update Task: Endpoint to update task details.
  - Delete Task: Endpoint to delete a task.
-Security: Ensures tasks are associated with users and enforces access control.
### Task Assignment
- Functionality:
  - Assign tasks to users.
  - Allow managers to assign tasks to users within their team.
- Endpoints:
  - View assigned tasks.
  - Update task assignments.
### Notifications
- Integration: Integrates with a third-party service (e.g., SendGrid, Twilio) to send notifications for task updates.
- Endpoints: Implements endpoints to configure notification preferences (e.g., email, SMS).
- Functionality: Ensures notifications are sent for key events such as task assignments, status updates, and due date reminders.
## Unit Tests
- Testing: Includes unit tests for each endpoint using a testing framework (e.g., Mocha, Jest).
- Coverage: Ensures tests cover various scenarios, including success cases, validation errors, and authentication failures.
- Instructions: Provide instructions on how to run the tests and interpret the results:
```
npm test
```
