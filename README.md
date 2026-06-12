# 🏕️ Explorion

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

A full-stack, responsive web application designed for outdoor enthusiasts to discover, review, and share their favorite camping spots. Built using the MERN-ish stack (React, Node.js, Express, MongoDB) alongside several powerful third-party integrations, it offers a rich user experience ranging from interactive 3D maps to user-authenticated booking systems.

---

## 🚀 Key Features

- **Advanced Interactive Mapping**
  - Built on **MapTiler** with 3D terrain exaggeration and Milky Way backgrounds.
  - Calculates real-time distance using **Turf.js** between your current geolocated position and the campground.
  - Click anywhere on the map to draw a route and measure distance from the campground to the clicked point.
  
- **AI-Powered Trip Planner & Tourist Search**
  - Utilizes **Gemini AI** to suggest personalized camping routes and nearby tourist attractions.
  - Interactive sliding panel allows you to generate, review, and add stops to your itinerary dynamically.
  
- **Geocoding & Location Intelligence**
  - When hosts create a campground by typing a location string (e.g., "Yosemite, CA"), the backend automatically translates this into exact GeoJSON coordinates using MapTiler's Forward Geocoding API.
  
- **Role-Based Access Control (RBAC)**
  - Users are assigned roles (`camper`, `host`, `admin`).
  - **Campers** can browse, leave reviews, and book campgrounds.
  - **Hosts** have dedicated profile sections to manage their listings, create new spots, and track bookings.

- **Comprehensive Booking System**
  - Dynamic calendar component built with `react-day-picker`.
  - Automatically disables dates that are already booked by fetching active reservations.
  - Calculates total pricing dynamically based on selected date ranges.
  - Users have a dedicated "My Bookings" dashboard to track, view, and cancel reservations.

- **Image Management & Galleries**
  - Seamless image uploads powered by **Cloudinary** and **Multer**.
  - Interactive auto-sliding image carousels for campground galleries.
  - Upon campground or individual image deletion, assets are automatically destroyed in Cloudinary to prevent stale data.

- **Community Driven Reviews**
  - 5-star rating system with real-time average calculation.
  - Authenticated users can write, view, and delete their own reviews.

- **Real-Time Weather Data**
  - Dedicated weather widgets that fetch real-time conditions using the exact coordinates of the campground.

---

## 📐 Deep Dive: System Architecture

### 1. Frontend Architecture (React + Vite)
- **State Management**: **Redux Toolkit** is used to manage global state such as the currently authenticated user session.
- **Routing**: Client-side routing is handled via **React Router DOM v7** using the `createBrowserRouter` approach, protecting specific routes with a custom `<RequireAuth>` component.
- **UI & Styling**: Uses **Bootstrap 5** for grid layouts, modals, and carousels, supplemented by custom CSS and **Bootstrap Icons**.
- **Geospatial Processing**: **Turf.js** processes GeoJSON data purely on the client side, running calculations (like point-to-point distance in kilometers) efficiently without hitting the backend.

### 2. Backend Architecture (Node.js + Express)
- **Database**: **MongoDB** coupled with **Mongoose**. Schemas are strictly typed (`Campground`, `User`, `Review`, `Booking`) and heavily utilize Mongoose middleware hooks (e.g., cascading deletes: deleting a campground deletes all associated reviews and Cloudinary images).
- **Authentication Strategy**: 
  - **Passport.js** manages authentication.
  - The system utilizes a hybrid approach: **Local Strategy** for initial login (validating hashed passwords using `passport-local-mongoose`) and **JWT Strategy** for maintaining stateless, secure API sessions.
- **Data Validation**: **Joi** schemas validate incoming HTTP requests strictly on the server side before hitting the database, preventing NoSQL injection and malformed data.
- **Error Handling**: Custom `catchAsync` wrappers eliminate `try/catch` boilerplate, funneling all asynchronous database/API errors down to a centralized Express error-handling middleware.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite**
- **Redux Toolkit** (State Management)
- **React Router DOM**
- **Bootstrap 5** & **React Icons**
- **MapTiler SDK** & **Turf.js** (Mapping and Geospatial)
- **react-day-picker** (Date Selection)
- **Axios** (API Client)

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **Passport.js** + **JSON Web Tokens (JWT)**
- **Cloudinary** + **Multer** (File Storage)
- **Joi** (Data Validation)

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)
- Accounts and API Keys for:
  - [MapTiler](https://www.maptiler.com/)
  - [Cloudinary](https://cloudinary.com/)

### 1. Clone the repository

```bash
git clone <repository-url>
cd Explorion
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory:

```env
PORT=3000
MONGO_URL=<your_mongodb_connection_string>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
CLOUDINARY_KEY=<your_cloudinary_api_key>
CLOUDINARY_SECRET=<your_cloudinary_api_secret>
JWT_SECRET=<your_jwt_secret>
MAPTILER_API_KEY=<your_maptiler_api_key>
GEMINI_API_KEY=<your_gemini_api_key>
```

Start the backend server:
```bash
npm start
# or for development mode:
# npm run dev
```

### 3. Frontend Setup

Open a new terminal window/tab:

```bash
cd client
npm install
```

Create a `.env` file in the `/client` directory:

```env
VITE_MAPTILER_API_KEY=<your_maptiler_api_key>
VITE_API_URL=http://localhost:3000
```

Start the Vite development server:
```bash
npm run dev
```

### 4. Open the App
Navigate to `http://localhost:5173` (or the port provided by Vite).

---

## 🧠 What I Learned

Building Explorion was a comprehensive journey through modern full-stack development. Key takeaways include:

- **Complex State Management:** Successfully integrating Redux Toolkit alongside local component state to handle authentication and interactive features seamlessly.
- **Geospatial Data Processing:** Gained deep experience with GeoJSON, turf.js, and MapTiler SDK to create dynamic, interactive maps and route calculations.
- **Third-Party API Integration:** Effectively orchestrated multiple APIs (Cloudinary for media, MapTiler for geocoding, Stripe for payments, Gemini for AI features).
- **Secure Authentication:** Implemented a robust hybrid authentication system using Passport.js with both Local and JWT strategies.
- **Production Readiness:** Focused on clean code, comprehensive JSDoc commenting, and structured environments to prepare the app for seamless deployment on Vercel and Render/Railway.

---

## 🚀 Deployment Guide

### Frontend (Vercel)
1. Link your GitHub repository to Vercel.
2. Ensure the Framework Preset is set to **Vite**.
3. Add the following Environment Variables in Vercel settings:
   - `VITE_API_URL` (Points to your deployed backend, e.g., `https://explorion-api.onrender.com`)
   - `VITE_MAPTILER_API_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
4. The included `client/vercel.json` ensures that Single Page Application (SPA) routing works correctly.

### Backend (Render / Railway)
1. Deploy the `server/` directory as a Node.js Web Service.
2. Set the Build Command to `npm install` and the Start Command to `node src/index.js` (or `npm start` if running from the root directory but pathing is set).
3. Populate the Environment Variables from the `.env.sample` into the platform's secret manager.
4. Ensure your MongoDB Atlas Network Access is set to allow connections from your deployed server's IP (or `0.0.0.0/0`).

---

## 📖 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
