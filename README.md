# ShopNest - MERN E-commerce Application

A full-stack E-commerce web application built using the MERN stack.

## Features

* User Authentication with JWT
* Product Listing and Details
* Shopping Cart Management
* Order Placement
* Razorpay Payment Integration
* Admin Dashboard
* User Profile Management
* Email Notifications using Nodemailer

## Tech Stack

### Frontend

* React.js
* React Router
* Redux Toolkit
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Razorpay
* Nodemailer

## Installation

### Clone Repository

```bash
git clone https://github.com/sakshi1402/Ecommerce-shopnest.git
```


## 🛠 Tech Stack Details

- **Frontend:** Pure React.js (`react-scripts`), Redux Toolkit (for Cart state management), AuthContext API (for JWT user sessions).
- **Backend:** Node.js, Express.js architecture mapped with middleware-based routing.
- **Database:** MongoDB (via Mongoose schemas).
- **Features:** Unified Admin Dashboard, Direct Cloudinary Content Maps, Personal User Profiles matching mapped Order Histories.
- **Payments:** Razorpay fully implemented (utilize your test metrics or placeholder).
- **Cloud Storage:** Cloudinary integration for Product image uploading securely via Multer.


### Install Dependencies

```bash
npm run install-all
```

### Environment Variables

Create a `.env` file inside the backend folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

### Run Project

```bash
npm run dev
```

## Project Structure

```text
backend/
frontend/
```

## Author

Sakshi Malviya
