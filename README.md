# forgot-password-reset-api-demo

This Repository demostrate a authentication, authorization and password resetting by sending the password reset url with SMTP services.

# API Demo: User Authentication (Signup, Login, Forgot/Reset Password)

This repository showcases a basic API implementation demonstrating common user authentication functionalities: **signup (registration), login (authentication), forgot password, and reset password**.

It serves as a practical example for developers looking to understand and implement these essential features in their own applications.

## Key Features

- **User Signup:** Allows new users to create an account with email and password.
- **User Login:** Enables existing users to authenticate and obtain an access token using their credentials.
- **Forgot Password:** Provides a mechanism for users to request a password reset via their registered email address.
- **Reset Password:** Allows users to set a new password after receiving a reset link or code.

## Technologies Used

- **Backend Framework:** Node.js with Express
- **Database:** MongoDB
- **Authentication Library/Method:** JWT (JSON Web Tokens)
- **Email Sending:** Nodemailer

##Swagger Documentation

You can access the Swagger documentation by opening the following URL in your web browser:

If you run in local

http://localhost:8000/api-docs

If you want to test api you can try it out in below swagger API documentation.

https://forgot-password-reset-api-demo.onrender.com/api-docs

## Contact Info

- **Contact Number:** +959451315280

- **Mail Address:** aungthuyeinhein98@gmail.com

- **Portfolio:** https://aungthuyeinhein.vercel.app/

- **Git Hub:** https://github.com/AungThuyeinHein/

## Installation Guide

This guide will walk you through the necessary steps to get the project up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Git:** For cloning the repository. You can download it from [https://git-scm.com/downloads](https://git-scm.com/downloads).
- **Node.js and npm:** npm is bundled with Node.js. You can download Node.js from [https://nodejs.org/en/download/](https://nodejs.org/en/download/). It is recommended to use a recent LTS version.

This is developed in Node Version of(v22.14.0(LTS))
NPM version (11.1.0)

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/AungThuyeinHein/forgot-password-reset-api-demo.git
    ```

    ```bash
    cd forgot-password-reset-api-demo
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    ```bash
    # MongoDB
    MONGODB_URI= "MongoDB connection string"

    # JWT
    SECRET_STR= "Your secret key"

    # SMTP
    GMAIL_USER= "Your Gmail address"
    GMAIL_APP_PASSWORD= "Your app-specific password"

    # Backend API URL
    BACKEND_API_URL= "Your backend API URL"

    OR

    #Frontend URL
    You Can change and setup as you like. Token is the important factor.
    FRONTEND_API_URL = "Your frontend API URL"


    # Login Expiry Time
    LOGIN_EXPIRES= "Login expiry time in milliseconds"
    ```

    # How to generate app-specific password for Gmail

    - You can generate an app-specific password for your Gmail account by following these steps:
      - Go to your Google Account settings.
      - Navigate to Security > 2-Step Verification.
      - Enable 2-Step Verification if it's not already enabled.
      - Go to Security > App Passwords.
      - Select "Mail" and choose "Other" as the app.
      - Generate the app-specific password and copy it.
      - Replace the GMAIL_APP_PASSWORD value in your .env file with the generated app-specific password.

4.  **Run the API server:**

    ```bash
    npm run prod
    ```

    OR

        ```bash

    npm run dev

    ```

    ```

## API Endpoints (Example)

- **`POST /signup`**: Registers a new user. Expects email and password in the request body.
- **`POST /login`**: Authenticates an existing user. Expects email and password in the request body and returns an access token upon successful authentication.
- **`POST /forgot-password`**: Initiates the password reset process. Expects the user's registered email address in the request body.
- **`PATCH /reset-password`**: Resets the user's password. Expects a reset token/code and the new password in the request body.

## License

MIT License
