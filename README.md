# BookStore

A full-stack MERN bookstore app — browse books, manage a cart, check out, and pay via Razorpay.

## Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT auth, Razorpay
- **Frontend**: React (Vite), Tailwind CSS + DaisyUI, React Router, Axios

## Project structure

```
backend/
  app.js, server.js       # Express app + entrypoint
  route/                  # /book, /user, /cart, /address, /order, /payment
  controllers/            # route handlers
  models/                 # Mongoose schemas
  middleware/auth.middleware.js

frontend/
  src/
    Home/, Books/, Courses/   # page sections
    components/                # Navbar, Cart, Checkout, Login, Signup, OrderHistory, ...
    context/AuthProvider.jsx   # auth context
    hooks/                     # useBooks, useCart
```

## Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
PORT=5500
MONGODB_URI=<your MongoDB connection string>
FRONTEND_URL=<frontend origin, e.g. http://localhost:5173>
JWT_SECRET=<jwt secret>
RAZORPAY_KEY_ID=<razorpay key id>
RAZORPAY_KEY_SECRET=<razorpay key secret>
```

```bash
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API routes

| Base       | Purpose                  |
|------------|---------------------------|
| `/book`    | Book listing/details      |
| `/user`    | Signup/login/auth         |
| `/cart`    | Cart operations           |
| `/address` | Shipping addresses        |
| `/order`   | Order placement/history   |
| `/payment` | Razorpay payment flow     |
