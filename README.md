# MERN E-Commerce Platform

## Description

A full-stack e-commerce platform built with the MERN stack (MongoDB, Express.js, React, and Node.js). Features include user authentication, product management, Stripe payments, Cloudinary for image hosting, and an admin dashboard for managing inventory and orders.

## Features

- User authentication (Register/Login).
- Admin dashboard to manage products, orders, and users.
- Product search, filter, and sorting.
- Secure payments with Stripe.
- Cloudinary integration for product image uploads.
- Persistent cart using local storage.

## Technologies Used

- **Frontend**: React, Redux, Axios, React Router.
- **Backend**: Node.js, Express.js, JWT Authentication.
- **Database**: MongoDB with Mongoose.
- **Other**: Stripe API, Cloudinary, bcrypt for password hashing.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/repository-name.git
   ```

2. Install dependencies:

   - For the backend:
     ```bash
     npm install
     ```
   - For the frontend:
     ```bash
     cd frontend
     npm install
     ```

3. Start the development server:
   - For the backend:
     ```bash
     npm run dev
     ```
   - For the frontend:
     ```bash
     cd frontend
     npm start
     ```

## Folder Structure

```
project-name/
|
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # API Controllers
│   ├── middlewares/     # Middlewares
│   ├── models/          # Mongoose Models
│   ├── routes/          # Express Routes
│   ├── utils/           # Utility Functions
│   └── server.js        # Backend entry point
|
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Global variables
│   │   ├── redux/       # Redux state management
│   │   ├── Layout.js    # Main React component
│   │   └── main.js      # Frontend entry point
|
└── README.md
```
