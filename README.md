# Campground Finder

A full-stack, responsive web application designed for outdoor enthusiasts to discover, review, and share their favorite camping spots. Built using the MERN-ish stack (React, Node.js, Express, MongoDB) alongside several powerful third-party integrations, it offers a rich user experience ranging from interactive 3D maps to user-authenticated booking systems.

---

## 🚀 Key Features

- **Advanced Interactive Mapping**
  - Built on **MapTiler** with 3D terrain exaggeration and Milky Way backgrounds.
  - Calculates real-time distance using **Turf.js** between your current geolocated position and the campground.
  - Click anywhere on the map to draw a route and measure distance from the campground to the clicked point.
  
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
cd Campground_Finder_React
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
```

Start the Vite development server:
```bash
npm run dev
```

### 4. Open the App
Navigate to `http://localhost:5173` (or the port provided by Vite).

---

## 📖 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
