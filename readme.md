# Vartalaap

## Overview

Vartalaap is a comprehensive social media platform designed to enhance user interaction and engagement. This application features robust profile management, social networking, and real-time communication functionalities.

## Features

### Backend

- **User Authentication**: Securely manage user sessions.
- **OTP Sign-In**: Additional security layer with one-time passwords.
- **Email Verification**: Ensure users' email addresses are valid.
- **Profile Updation**: Allow users to update their profile information.
- **Forgot Password**: Users can request to reset their password.
- **Reset Password**: Users can change their password securely.
- **Posts**: Users can create, edit, and delete posts.
- **Likes and Comments**: Users can like posts and leave comments.
- **Friendship Management**: Users can send, accept, and decline friend requests.
- **Chat**: Real-time messaging between friends.

### Frontend

The frontend of Vartalaap is designed with modern web standards, ensuring a **user-friendly experience** and **seamless navigation**. Built using designs from [Dev UI](https://devuiv2.vercel.app/) by Hitesh Chaudhary, the UI is both visually appealing and highly responsive.

- **Responsive Design**: Adapts flawlessly to different screen sizes, providing an optimal experience on both mobile and desktop devices.
- **Interactive Elements**: Engaging UI components that enhance the user journey throughout the profile management process.
- **Intuitive Layout**: Logical arrangement of elements, making information easily accessible and actions straightforward to perform.
- **State Management**: Efficient handling of UI state to ensure a dynamic yet consistent user experience.
- **Accessibility**: Compliant with modern accessibility standards, ensuring that the application is usable by as many people as possible.

### Database

- **Current**: MongoDB with Mongoose for efficient data storage.
- **Planned**: Transition to PostgreSQL with Prisma for enhanced performance and scalability.

## Future Improvements

- **WebRTC Integration**: Enable real-time audio and video communication.
- **Image Sharing**: Allow users to send images in the chat.
- **Enhanced Security**: Implement additional security measures for data protection.
- **Performance Optimization**: Improve application performance and scalability.
- **Advanced Analytics**: Provide users with insights and analytics about their activity and interactions.
- **TypeScript Migration**: Convert the codebase from JavaScript to TypeScript for better type safety and maintainability.
- **Redux for State Management**: Transition from Context API to Redux for more efficient state management.

## Getting Started

To get started with Vartalaap, clone the repository and install the dependencies for both frontend and backend.

```bash
git clone <repository-url>
cd Vartalaap
# Install backend dependencies
cd backend
npm install
# Install frontend dependencies
cd ../frontend
npm install
```
## Configuration

You will need to set up your environment variables for both the frontend and backend. Create a `.env` file in the root of each directory and add the following:

### Backend `.env`

```env
DB_URI=mongodb+srv://<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
EMAIL_USER=<your-email>
EMAIL_PASS=<your-email-password>
CLIENT_ID=<your-google-client-id>
CLIENT_SECRET=<your-google-client-secret>
REFRESH_TOKEN=<your-google-refresh-token>
```

### Frontend `.env`

```env
REACT_APP_API_URL=http://localhost:3000
```

Replace the placeholder values with your actual data.

## Running the Application

To run the backend and frontend servers, use the following commands:

```bash
# Start the backend server
cd backend
npm start

# Start the frontend server in a new terminal
cd frontend
npm start
```

### Obtaining Keys
To obtain your keys for email services and other APIs, follow these steps:
1 **Google API Keys**: Enable real-time audio and video communication.
2 **MongoDB URI**: Allow users to send images in the chat.
3 **Email Password**: Implement additional security measures for data protection.
