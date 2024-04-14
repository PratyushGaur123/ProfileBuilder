# Profile Builder

## Overview

Profile Builder is a full-stack application designed for managing user profiles. It features a minimalistic frontend that supports the robust backend functionalities.

## Features

### Backend

- **User Authentication**: Securely manage user sessions.
- **OTP Sign-In**: Additional security layer with one-time passwords.
- **Email Verification**: Ensure users' email addresses are valid.
- **Profile Updation**: Allow users to update their profile information.
- **Forgot Password**: Users can request to reset their password.
- **Reset Password**: Users can change their password securely.

### Frontend

The frontend of Profile Builder is a testament to modern web design principles, offering a **user-friendly experience** and **seamless navigation**. It's built with a focus on **usability** and **aesthetic appeal**, ensuring that users can manage their profiles with ease and confidence.

- **Minimal Design**: Adapts flawlessly to different screen sizes, providing an optimal experience on both mobile and desktop devices.
- **Interactive Elements**: Engaging UI components that enhance the user journey throughout the profile management process.
- **Intuitive Layout**: Logical arrangement of elements, making information easily accessible and actions straightforward to perform.
- **State Management**: Efficient handling of UI state to ensure a dynamic yet consistent user experience.
- **Accessibility**: Compliant with modern accessibility standards, ensuring that the application is usable by as many people as possible.

The frontend serves as the gateway to the robust features of the backend, presenting a **minimalistic yet powerful interface** that users will find both refreshing and intuitive.
.

### Database

- **MongoDB**: A NoSQL database to store user data efficiently.

## Getting Started

To get started with Profile Builder, clone the repository and install the dependencies for both frontend and backend.

```bash
git clone <repository-url>
cd ProfileBuilder
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

## Obtaining Keys

To obtain your keys for email services and other APIs, follow these steps:

1. **Google API Keys**: Visit the [Google Developers Console](https://console.developers.google.com/) to create a project and obtain your `CLIENT_ID`, `CLIENT_SECRET`, and `REFRESH_TOKEN`.

2. **MongoDB URI**: Set up an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a cluster to get your `DB_URI`.

3. **Email Password**: Use the App Passwords feature in your Google Account settings to generate an `EMAIL_PASS`.

## Contributing

Contributions are welcome! Please read the contributing guide before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
```
