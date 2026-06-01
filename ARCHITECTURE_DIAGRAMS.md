# Explorion — Architecture & Control Flow Diagrams

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph CLIENT["🖥️ Frontend — React + Vite :5173"]
        BROWSER["Browser"]
        ROUTER["React Router DOM v7"]
        REDUX["Redux Toolkit Store"]
        COMPONENTS["React Components"]
        MAPTILER_SDK["MapTiler SDK + Turf.js"]
        AXIOS["Axios HTTP Client"]
    end

    subgraph SERVER["⚙️ Backend — Express.js :3000"]
        EXPRESS["Express App"]
        PASSPORT["Passport.js"]
        MIDDLEWARE["Middleware Chain"]
        CONTROLLERS["Controllers"]
        MONGOOSE["Mongoose ODM"]
    end

    subgraph EXTERNAL["☁️ External Services"]
        MONGODB[("MongoDB Atlas")]
        CLOUDINARY["Cloudinary CDN"]
        MAPTILER_API["MapTiler Geocoding API"]
        OPENMETEO["Open-Meteo Weather API"]
    end

    BROWSER --> ROUTER
    ROUTER --> COMPONENTS
    COMPONENTS --> REDUX
    COMPONENTS --> AXIOS
    COMPONENTS --> MAPTILER_SDK
    COMPONENTS -->|"Weather fetch"| OPENMETEO
    AXIOS -->|"HTTP Requests + JWT"| EXPRESS
    EXPRESS --> PASSPORT
    PASSPORT --> MIDDLEWARE
    MIDDLEWARE --> CONTROLLERS
    CONTROLLERS --> MONGOOSE
    CONTROLLERS -->|"Forward Geocoding"| MAPTILER_API
    MONGOOSE --> MONGODB
    CONTROLLERS -->|"Upload / Delete"| CLOUDINARY

    style CLIENT fill:#1a1a2e,color:#e0e0e0,stroke:#16213e
    style SERVER fill:#0f3460,color:#e0e0e0,stroke:#1a1a2e
    style EXTERNAL fill:#533483,color:#e0e0e0,stroke:#2b2d42
```

---

## 2. Frontend — Routing & Component Tree

```mermaid
graph TD
    ROOT["createRoot → StrictMode"]
    ROOT --> PROVIDER["Redux Provider"]
    PROVIDER --> ROUTERPROV["RouterProvider"]

    ROUTERPROV --> R1["/ → Layout"]
    ROUTERPROV --> R2["/campgrounds → Layout"]
    ROUTERPROV --> R3["/user → Layout"]

    R1 --> LAYOUT1["Navbar + Outlet + Footer"]
    LAYOUT1 --> LANDING["Landing.jsx"]

    R2 --> LAYOUT2["Navbar + Outlet + Footer"]
    LAYOUT2 --> HOME["/campgrounds → Home.jsx"]
    LAYOUT2 --> NEW["/campgrounds/new → RequireAuth → Newcamp.jsx"]
    LAYOUT2 --> EDIT["/campgrounds/edit/:id → RequireAuth → UpdateCamp.jsx"]
    LAYOUT2 --> SHOW["/campgrounds/:id → Campground.jsx"]

    R3 --> LAYOUT3["Navbar + Outlet + Footer"]
    LAYOUT3 --> LOGIN["/user/login → Login.jsx"]
    LAYOUT3 --> REGISTER["/user/register → Register.jsx"]
    LAYOUT3 --> PROFILE["/user/:id → RequireAuth → UserProfile.jsx"]

    SHOW --> HOSTPROFILE["HostProfile.jsx"]
    SHOW --> WEATHER["WeatherWidget.jsx"]
    SHOW --> BOOKING["BookingCalendar.jsx"]
    SHOW --> MAPVIEW["MapTiler 3D Map"]
    SHOW --> REVIEWS["Review List + Form"]

    style ROOT fill:#e63946,color:white
    style ROUTERPROV fill:#457b9d,color:white
    style LAYOUT1 fill:#264653,color:white
    style LAYOUT2 fill:#264653,color:white
    style LAYOUT3 fill:#264653,color:white
    style NEW fill:#e9c46a,color:black
    style EDIT fill:#e9c46a,color:black
    style PROFILE fill:#e9c46a,color:black
```

> [!NOTE]
> Yellow nodes require authentication — they are wrapped by `RequireAuth`, which checks Redux state + `localStorage` for a JWT token. If absent, user is redirected to `/user/login`.

---

## 3. Backend — File Structure Map

```mermaid
graph LR
    subgraph SERVER_SRC["server/src/"]
        INDEX["index.js<br/>Express App Entry"]

        subgraph ROUTES["routes/"]
            R_CAMP["campground.js"]
            R_REVIEW["reviews.js"]
            R_USER["user.js"]
            R_BOOKING["booking.js"]
        end

        subgraph CONTROLLERS["controllers/"]
            C_CAMP["campgrounds.js"]
            C_REVIEW["review.js"]
            C_USER["user.js"]
            C_BOOKING["bookings.js"]
        end

        subgraph MIDDLEWARES["middlewares/"]
            MW_MAIN["middleware.js"]
            MW_IMG["validateImages.js"]
            MW_UIMG["validateUserImage.js"]
        end

        subgraph SCHEMAS["schemas/ — Mongoose"]
            S_CAMP["campgroundSchema.js"]
            S_USER["userSchema.js"]
            S_REVIEW["reviewSchema.js"]
            S_BOOKING["bookingSchema.js"]
            S_POINT["pointSchema.js"]
        end

        subgraph MODELS["models/ — Hooks + Export"]
            M_CAMP["campground.js"]
            M_USER["user.js"]
            M_REVIEW["review.js"]
            M_BOOKING["booking.js"]
        end

        subgraph CONFIG["config/"]
            CF_CLOUD["cloudinary.js"]
            CF_PASS["passport.js"]

        end

        subgraph HELPER["helper/"]
            H_CATCH["catchAsync.js"]
            H_ERROR["error-class.js"]
        end
    end

    INDEX --> R_CAMP & R_REVIEW & R_USER & R_BOOKING
    R_CAMP --> MW_MAIN & MW_IMG & C_CAMP
    R_REVIEW --> MW_MAIN & C_REVIEW
    R_USER --> MW_MAIN & MW_UIMG & C_USER
    R_BOOKING --> MW_MAIN & C_BOOKING
    C_CAMP & C_REVIEW & C_USER & C_BOOKING --> M_CAMP & M_USER & M_REVIEW & M_BOOKING
    M_CAMP --> S_CAMP
    M_USER --> S_USER
    M_REVIEW --> S_REVIEW
    M_BOOKING --> S_BOOKING
    S_CAMP & S_USER --> S_POINT

    style INDEX fill:#e63946,color:white
    style ROUTES fill:#264653,color:white
    style CONTROLLERS fill:#2a9d8f,color:white
    style MIDDLEWARES fill:#e9c46a,color:black
    style SCHEMAS fill:#f4a261,color:black
    style MODELS fill:#e76f51,color:white
```

---

## 4. Backend — Complete Request Lifecycle

Every HTTP request passes through the following pipeline:

```mermaid
flowchart TD
    REQ["Incoming HTTP Request"] --> DEBUG["Debug Logger Middleware<br/><i>logs method + URL</i>"]
    DEBUG --> CORS["CORS Middleware<br/><i>app.use-cors-</i>"]
    CORS --> PARSE["Body Parsers<br/><i>urlencoded + json</i>"]
    PARSE --> PASSPORT_INIT["passport.initialize()"]
    PASSPORT_INIT --> ROUTE{"Route Matching<br/>/campgrounds<br/>/campgrounds/:id/reviews<br/>/user, /bookings"}

    ROUTE -->|"No match"| ERR_404["404 — falls through"]
    ROUTE -->|"Match"| MW_CHAIN["Middleware Chain<br/><i>per-route</i>"]
    MW_CHAIN --> CONTROLLER["Controller Function<br/><i>wrapped in catchAsync</i>"]
    CONTROLLER -->|"Success"| RES_OK["JSON Response<br/>200/201"]
    CONTROLLER -->|"Error thrown"| CATCH["catchAsync catches error<br/>calls next-err-"]
    CATCH --> ERR_MW["Centralized Error Handler<br/><i>sets status + JSON message</i>"]
    ERR_MW --> RES_ERR["Error JSON Response<br/>400/403/404/500"]

    style REQ fill:#457b9d,color:white
    style ROUTE fill:#e9c46a,color:black
    style ERR_MW fill:#e63946,color:white
    style RES_OK fill:#2a9d8f,color:white
    style RES_ERR fill:#e63946,color:white
```

---

## 5. Route → Middleware → Controller — Per Endpoint

### 5a. Campground Routes

```mermaid
flowchart LR
    subgraph "GET /campgrounds"
        G1["loadAllCampground"]
    end

    subgraph "POST /campgrounds"
        P1["isLoggedIn<br/><i>JWT check</i>"] --> P2["multer.array-image-<br/><i>upload to Cloudinary</i>"]
        P2 --> P3["validateImages<br/><i>max 5 images</i>"]
        P3 --> P4["verifyCampgrounds<br/><i>Joi validation</i>"]
        P4 --> P5["createNewCampground"]
    end

    subgraph "GET /campgrounds/:id"
        G2["showOneCampground<br/><i>populate reviews + author</i>"]
    end

    subgraph "PATCH /campgrounds/:id"
        U1["isLoggedIn"] --> U2["isAuthor<br/><i>ownership check</i>"]
        U2 --> U3["multer.array-image-"]
        U3 --> U4["validateImages"]
        U4 --> U5["verifyCampgrounds"]
        U5 --> U6["updateCampground"]
    end

    subgraph "DELETE /campgrounds/:id"
        D1["isLoggedIn"] --> D2["isAuthor"]
        D2 --> D3["deleteCampground<br/><i>triggers post hook</i>"]
    end

    style P1 fill:#e9c46a,color:black
    style P2 fill:#f4a261,color:black
    style P3 fill:#f4a261,color:black
    style P4 fill:#e9c46a,color:black
    style U1 fill:#e9c46a,color:black
    style U2 fill:#e76f51,color:white
    style D1 fill:#e9c46a,color:black
    style D2 fill:#e76f51,color:white
```

### 5b. Review Routes

```mermaid
flowchart LR
    subgraph "POST /campgrounds/:id/reviews"
        PR1["isLoggedIn"] --> PR2["verifyReviews<br/><i>Joi: rating + body</i>"]
        PR2 --> PR3["createReview<br/><i>push to camp.reviews[]</i>"]
    end

    subgraph "DELETE /campgrounds/:id/reviews/:reviewId"
        DR1["isLoggedIn"] --> DR2["isReviewAuthor<br/><i>ownership check</i>"]
        DR2 --> DR3["deleteReview<br/><i>$pull from camp</i>"]
    end

    style PR1 fill:#e9c46a,color:black
    style DR2 fill:#e76f51,color:white
```

### 5c. User Routes

```mermaid
flowchart LR
    subgraph "POST /user/register"
        R1["multer.single-image-"] --> R2["validateUserImage"]
        R2 --> R3["verifyUser<br/><i>Joi validation</i>"]
        R3 --> R4["registerUser<br/><i>hash password + issue JWT</i>"]
    end

    subgraph "POST /user/login"
        L1["passport.authenticate-local-<br/><i>verify username + password</i>"]
        L1 --> L2["loginUser<br/><i>issue JWT token</i>"]
    end

    subgraph "GET /user/:id"
        S1["isLoggedIn"] --> S2["showUserInfo<br/><i>populate campgrounds + bookings</i>"]
    end

    subgraph "POST /user/:id — Update"
        UP1["isLoggedIn"] --> UP2["isAccountOwner"]
        UP2 --> UP3["multer.single-image-"]
        UP3 --> UP4["validateUserImage"]
        UP4 --> UP5["verifyUser"]
        UP5 --> UP6["updateUserInfo"]
    end

    style L1 fill:#2a9d8f,color:white
    style UP2 fill:#e76f51,color:white
```

### 5d. Booking Routes

```mermaid
flowchart LR
    subgraph "GET /campgrounds/:id/bookings"
        BG1["getBookingsForCampground<br/><i>returns active future bookings</i>"]
    end

    subgraph "POST /campgrounds/:id/bookings"
        BP1["isLoggedIn"] --> BP2["createBooking<br/><i>overlap check + price calc</i>"]
    end

    subgraph "DELETE /bookings/:bookingId"
        BD1["isLoggedIn"] --> BD2["cancelBooking<br/><i>set status = cancelled</i>"]
    end

    style BP1 fill:#e9c46a,color:black
    style BD1 fill:#e9c46a,color:black
```

---

## 6. Authentication Flow

### 6a. Registration

```mermaid
sequenceDiagram
    actor User
    participant React as React (Register.jsx)
    participant Redux as Redux Store
    participant API as Express Server
    participant Passport as passport-local-mongoose
    participant DB as MongoDB
    participant Cloud as Cloudinary

    User->>React: Fill form + upload image
    React->>API: POST /user/register<br/>(multipart/form-data)
    API->>Cloud: multer uploads image
    Cloud-->>API: { url, public_id }
    API->>API: validateUserImage()
    API->>API: verifyUser() — Joi validation
    API->>API: Check: role !== 'admin'
    API->>DB: User.findOne({ email })
    DB-->>API: null (no duplicate)
    API->>Passport: User.register(user, password)
    Passport->>DB: Save user with hashed password
    DB-->>Passport: registeredUser
    Passport-->>API: registeredUser
    API->>API: jwt.sign({ id, username })
    API-->>React: { token, user }
    React->>Redux: dispatch(login({ user, token }))
    React->>React: localStorage.setItem('token')
    React->>React: localStorage.setItem('user')
    React->>User: Redirect to /campgrounds
```

### 6b. Login

```mermaid
sequenceDiagram
    actor User
    participant React as React (Login.jsx)
    participant Redux as Redux Store
    participant API as Express Server
    participant Passport as Passport Local Strategy
    participant DB as MongoDB

    User->>React: Enter username + password
    React->>API: POST /user/login
    API->>Passport: passport.authenticate('local')
    Passport->>DB: User.findOne({ username })
    DB-->>Passport: user document
    Passport->>Passport: Verify password hash
    Passport-->>API: Attach req.user
    API->>API: jwt.sign({ id, username }, JWT_SECRET)
    API-->>React: { token, user: { id, username, email, image } }
    React->>Redux: dispatch(login({ user, token }))
    React->>React: localStorage.setItem('token') + ('user')
    React->>User: Navigate to saved location or /campgrounds
```

### 6c. JWT Authentication on Protected Routes

```mermaid
sequenceDiagram
    participant React as React Component
    participant API as Express Server
    participant Passport as Passport JWT Strategy
    participant DB as MongoDB

    React->>API: Request + Header: Authorization: Bearer <token>
    API->>Passport: passport.authenticate('jwt')
    Passport->>Passport: ExtractJwt.fromAuthHeaderAsBearerToken()
    Passport->>Passport: Verify token signature with JWT_SECRET
    Passport->>DB: User.findById(jwt_payload.id)
    DB-->>Passport: user document
    Passport-->>API: Attach req.user
    API->>API: Next middleware / controller runs
    API-->>React: JSON response
```

### 6d. Session Rehydration on Page Refresh

```mermaid
sequenceDiagram
    participant Browser as Browser Refresh
    participant Layout as Layout.jsx
    participant LS as localStorage
    participant Redux as Redux Store

    Browser->>Layout: Component mounts
    Layout->>LS: getItem('token') + getItem('user')
    LS-->>Layout: token + user JSON
    Layout->>Redux: dispatch(login({ user: JSON.parse(user), token }))
    Note over Redux: isLoggedIn = true<br/>user + token restored
```

---

## 7. Database — Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String username UK
        String email UK
        Date joined
        String bio
        String phoneNum
        String role "camper | host | host+camper | admin"
        Object image "{ url, imageId }"
        Point geometry "optional GeoJSON"
        String hash "auto by passport-local-mongoose"
        String salt "auto by passport-local-mongoose"
    }

    CAMPGROUND {
        ObjectId _id PK
        String name
        Number price
        String description
        String location "text address"
        Point campLocation "GeoJSON coordinates"
        String checkin
        String checkout
        StringArray camprules
        StringArray amenity
        String authorDesc
        ObjectArray image "[ { url, imageId } ]"
        ObjectId author FK
        ObjectIdArray reviews FK
    }

    REVIEW {
        ObjectId _id PK
        Date date "default: now"
        String body
        Number rating "1-5"
        ObjectId author FK
    }

    BOOKING {
        ObjectId _id PK
        Date startDate
        Date endDate
        Number totalPrice
        String status "pending | confirmed | cancelled"
        Date createdAt
        ObjectId campground FK
        ObjectId user FK
    }

    USER ||--o{ CAMPGROUND : "hosts (virtual)"
    USER ||--o{ REVIEW : "writes"
    USER ||--o{ BOOKING : "makes (virtual)"
    CAMPGROUND ||--o{ REVIEW : "has"
    CAMPGROUND ||--o{ BOOKING : "receives"
```

> [!NOTE]
> `campgrounds` and `bookings` on User are **Mongoose virtuals** — they don't exist as stored fields. They are computed at query-time via `localField: '_id'` → `foreignField: 'author'/'user'`.

---

## 8. Campground Creation — Full End-to-End Flow

```mermaid
sequenceDiagram
    actor Host
    participant React as Newcamp.jsx
    participant API as Express Server
    participant Multer as Multer + Cloudinary
    participant Joi as Joi Validator
    participant MapTiler as MapTiler Geocoding
    participant DB as MongoDB

    Host->>React: Fill form (name, price, location,<br/>description, amenities, images)
    React->>API: POST /campgrounds<br/>multipart/form-data + JWT

    Note over API: Middleware Chain Begins

    API->>API: 1. isLoggedIn — verify JWT
    API->>Multer: 2. multer.array('image')
    Multer->>Multer: Check MIME type (image/* only)
    Multer->>Multer: Check file size (≤ 5MB)
    Multer-->>API: req.files = [{ url, public_id }]

    API->>API: 3. validateImages — max 5 images
    API->>Joi: 4. verifyCampgrounds — validate req.body

    Note over API: Controller Begins

    API->>API: 5. Check role: host | host+camper | admin
    API->>MapTiler: 6. geocoding.forward(location string)
    MapTiler-->>API: GeoJSON { type: 'Point', coordinates: [lng, lat] }
    API->>DB: 7. new Campground({ ...data, campLocation, author })
    API->>DB: 8. camp.save()
    DB-->>API: Saved document
    API-->>React: 201 { message, _id }
    React->>React: navigate to /campgrounds/:id
```

---

## 9. Campground Deletion — Cascade Flow

```mermaid
flowchart TD
    REQ["DELETE /campgrounds/:id"] --> MW1["isLoggedIn"]
    MW1 --> MW2["isAuthor<br/><i>camp.author === req.user._id?</i>"]
    MW2 --> CTRL["deleteCampground<br/><i>Campground.findByIdAndDelete(id)</i>"]

    CTRL --> HOOK["Mongoose post-findOneAndDelete Hook<br/><i>campground.js model</i>"]

    HOOK --> DEL_REVIEWS["Delete all associated reviews<br/><i>Review.deleteMany({ _id: { $in: doc.reviews } })</i>"]
    HOOK --> DEL_IMAGES["Destroy all Cloudinary images<br/><i>for each img → cloudinary.uploader.destroy(img.imageId)</i>"]

    DEL_REVIEWS --> DONE["✅ Campground + Reviews + Images cleaned up"]
    DEL_IMAGES --> DONE

    style HOOK fill:#e76f51,color:white
    style DONE fill:#2a9d8f,color:white
```

---

## 10. Booking Flow

```mermaid
sequenceDiagram
    actor Camper
    participant Calendar as BookingCalendar.jsx
    participant API as Express Server
    participant DB as MongoDB

    Note over Calendar: On mount: fetch existing bookings
    Calendar->>API: GET /campgrounds/:id/bookings
    API->>DB: Booking.find({ campground, status ≠ cancelled, endDate ≥ now })
    DB-->>API: [{ startDate, endDate }, ...]
    API-->>Calendar: Booked date ranges
    Calendar->>Calendar: Disable booked dates in DayPicker

    Camper->>Calendar: Select date range (from → to)
    Calendar->>Calendar: Calculate: nights × pricePerNight = totalPrice
    Calendar->>Calendar: Display booking summary

    Camper->>Calendar: Click "Book Now"
    Calendar->>API: POST /campgrounds/:id/bookings<br/>{ startDate, endDate } + JWT

    API->>API: Validate: startDate ≥ today, endDate > startDate
    API->>DB: Check overlap: Booking.findOne({<br/>  startDate < end, endDate > start,<br/>  status ≠ cancelled })
    DB-->>API: null (no overlap)
    API->>DB: new Booking({ start, end, campground, user, totalPrice, status: 'confirmed' })
    DB-->>API: Saved booking
    API-->>Calendar: 201 { booking }
    Calendar->>Calendar: Show success alert
    Calendar->>Calendar: Refresh disabled dates
```

---

## 11. Review Flow

```mermaid
flowchart TD
    subgraph "Create Review"
        CR1["User submits form in Campground.jsx"]
        CR1 --> CR2["POST /campgrounds/:id/reviews<br/>{ review: { rating, body } }"]
        CR2 --> CR3["isLoggedIn"]
        CR3 --> CR4["verifyReviews — Joi validation"]
        CR4 --> CR5["createReview controller"]
        CR5 --> CR6["Find Campground by ID"]
        CR6 --> CR7["new Review({ rating, body, author: req.user._id })"]
        CR7 --> CR8["campground.reviews.push(review)"]
        CR8 --> CR9["review.save() + campground.save()"]
        CR9 --> CR10["review.populate-author-"]
        CR10 --> CR11["201 → re-fetch campground → update UI"]
    end

    subgraph "Delete Review"
        DR1["User clicks trash icon"]
        DR1 --> DR2["DELETE /campgrounds/:id/reviews/:reviewId"]
        DR2 --> DR3["isLoggedIn"]
        DR3 --> DR4["isReviewAuthor<br/><i>review.author === req.user._id?</i>"]
        DR4 --> DR5["Campground.findByIdAndUpdate<br/><i>$pull review from array</i>"]
        DR5 --> DR6["Review.findByIdAndDelete"]
        DR6 --> DR7["200 → re-fetch campground → update UI"]
    end

    style CR3 fill:#e9c46a,color:black
    style CR4 fill:#e9c46a,color:black
    style DR4 fill:#e76f51,color:white
```

---

## 12. Image Upload Pipeline

```mermaid
flowchart LR
    FORM["Form with<br/>input type=file"] -->|"multipart/form-data"| MULTER["Multer Middleware"]

    MULTER --> CHECK_MIME{"MIME type<br/>starts with<br/>image/?"}
    CHECK_MIME -->|"No"| REJECT["❌ Error: only images allowed"]
    CHECK_MIME -->|"Yes"| CHECK_SIZE{"File size<br/>≤ 5MB?"}
    CHECK_SIZE -->|"No"| REJECT2["❌ Error: file too large"]
    CHECK_SIZE -->|"Yes"| CLOUD_UPLOAD["Upload to Cloudinary<br/><i>multer-storage-cloudinary</i>"]

    CLOUD_UPLOAD --> VALIDATE["validateImages Middleware"]
    VALIDATE --> CHECK_COUNT{"Total images<br/>≤ 5?"}
    CHECK_COUNT -->|"No"| CLEANUP["🧹 Destroy uploaded files<br/>from Cloudinary"]
    CLEANUP --> REJECT3["❌ 400 Error"]
    CHECK_COUNT -->|"Yes"| NEXT["✅ Proceed to controller"]

    NEXT --> SAVE["Save { url, imageId }<br/>to MongoDB document"]

    style REJECT fill:#e63946,color:white
    style REJECT2 fill:#e63946,color:white
    style REJECT3 fill:#e63946,color:white
    style NEXT fill:#2a9d8f,color:white
    style CLOUD_UPLOAD fill:#3a86ff,color:white
```

---

## 13. Redux State Management

```mermaid
stateDiagram-v2
    [*] --> LoggedOut: App initializes

    state LoggedOut {
        user_null: user = { id: null, username: '', email: '' }
        token_empty: jwtToken = ''
        logged_false: isLoggedIn = false
    }

    state LoggedIn {
        user_data: user = { id, username, email, image }
        token_set: jwtToken = 'eyJhbG...'
        logged_true: isLoggedIn = true
    }

    LoggedOut --> LoggedIn: dispatch(login({ user, token }))\n— On Register / Login / Page Refresh rehydration
    LoggedIn --> LoggedOut: dispatch(logout())\n— On Logout button click\n— localStorage.removeItem('token')
```

```mermaid
flowchart TD
    subgraph "State Read Points"
        NAVBAR["Navbar.jsx<br/><i>show/hide Login vs Profile link</i>"]
        REQUIREAUTH["RequireAuth.jsx<br/><i>gate protected routes</i>"]
        CAMPGROUND["Campground.jsx<br/><i>show edit/delete if owner</i>"]
        USERPROFILE["UserProfile.jsx<br/><i>show edit/logout if own profile</i>"]
        BOOKINGCAL["BookingCalendar.jsx<br/><i>show Book Now vs Login link</i>"]
    end

    STORE["Redux Store<br/><i>state.user</i>"] --> NAVBAR
    STORE --> REQUIREAUTH
    STORE --> CAMPGROUND
    STORE --> USERPROFILE
    STORE --> BOOKINGCAL

    subgraph "State Write Points"
        LOGIN_PAGE["Login.jsx → dispatch(login)"]
        REGISTER_PAGE["Register.jsx → dispatch(login)"]
        LAYOUT_MOUNT["Layout.jsx useEffect → dispatch(login)<br/><i>rehydrate from localStorage</i>"]
        LOGOUT_BTN["UserProfile.jsx → dispatch(logout)"]
    end

    LOGIN_PAGE --> STORE
    REGISTER_PAGE --> STORE
    LAYOUT_MOUNT --> STORE
    LOGOUT_BTN --> STORE

    style STORE fill:#7209b7,color:white
```

---

## 14. Middleware Function Reference

```mermaid
flowchart TD
    subgraph "Authentication Middlewares"
        ISLOGGEDIN["isLoggedIn<br/><i>passport.authenticate('jwt', { session: false })</i><br/>Extracts JWT from Authorization header<br/>Attaches user to req.user"]
    end

    subgraph "Authorization Middlewares"
        ISAUTHOR["isAuthor<br/><i>Campground.findById(id)</i><br/><i>camp.author.equals(req.user._id)?</i><br/>→ 403 if not owner"]
        ISREVIEWAUTHOR["isReviewAuthor<br/><i>Review.findById(reviewId)</i><br/><i>review.author.equals(req.user._id)?</i><br/>→ 403 if not owner"]
        ISACCOUNTOWNER["isAccountOwner<br/><i>User.findById(id)</i><br/><i>user._id.equals(req.user._id)?</i><br/>→ 403 if not owner"]
    end

    subgraph "Validation Middlewares"
        VERIFYCAMP["verifyCampgrounds<br/><i>Joi schema validation on req.body</i><br/><i>Normalizes camprules to array</i>"]
        VERIFYREVIEW["verifyReviews<br/><i>Joi schema validation on req.body.review</i>"]
        VERIFYUSER["verifyUser<br/><i>Joi schema validation on req.body</i><br/><i>Default role = 'camper'</i>"]
    end

    subgraph "File Upload Middlewares"
        MULTER_ARR["multer.array('image')<br/><i>Multi-file upload to Cloudinary</i><br/><i>5MB limit, image/* only</i>"]
        MULTER_SINGLE["multer.single('image')<br/><i>Single file upload to Cloudinary</i>"]
        VALIMG["validateImages<br/><i>POST: max 5 new images</i><br/><i>PATCH: current - deleted + new ≤ 5</i>"]
        VALUIMG["validateUserImage<br/><i>Single user profile image validation</i>"]
    end

    style ISLOGGEDIN fill:#e9c46a,color:black
    style ISAUTHOR fill:#e76f51,color:white
    style ISREVIEWAUTHOR fill:#e76f51,color:white
    style ISACCOUNTOWNER fill:#e76f51,color:white
    style VERIFYCAMP fill:#2a9d8f,color:white
    style VERIFYREVIEW fill:#2a9d8f,color:white
    style VERIFYUSER fill:#2a9d8f,color:white
    style MULTER_ARR fill:#3a86ff,color:white
    style MULTER_SINGLE fill:#3a86ff,color:white
```

---

## 15. Map & Geospatial Flow (Campground Detail Page)

```mermaid
flowchart TD
    MOUNT["Campground.jsx mounts"] --> FETCH["Fetch campground data<br/><i>GET /campgrounds/:id</i>"]
    FETCH --> INIT_MAP["Initialize MapTiler Map<br/><i>globe projection, HYBRID style</i><br/><i>terrain exaggeration 1.5x</i><br/><i>milkyway-bright background</i>"]
    INIT_MAP --> MARKER["Place Marker at<br/>camp.campLocation.coordinates"]
    INIT_MAP --> ADD_SOURCE["Add empty 'route' GeoJSON source<br/>+ dashed line layer"]

    INIT_MAP --> GEO["navigator.geolocation<br/>.getCurrentPosition()"]
    GEO --> USER_MARKER["Place User Marker<br/>at user's coordinates"]
    GEO --> CALC_DIST["Turf.js distance()<br/><i>user → campground</i><br/><i>in kilometers</i>"]
    CALC_DIST --> BADGE1["Display: '12.5 km away'"]

    INIT_MAP --> CLICK["User clicks anywhere on map"]
    CLICK --> CLICK_MARKER["Place red Marker<br/>at clicked coordinates"]
    CLICK --> CALC_CLICK["Turf.js distance()<br/><i>campground → clicked point</i>"]
    CALC_CLICK --> BADGE2["Display: 'Selected: 8.3 km'"]
    CLICK --> DRAW_LINE["Update route source<br/><i>turf.lineString<br/>campground → clicked point</i>"]

    MOUNT --> WEATHER["WeatherWidget fetches<br/><i>Open-Meteo API</i><br/><i>using camp coordinates</i>"]

    style INIT_MAP fill:#3a86ff,color:white
    style GEO fill:#2a9d8f,color:white
    style WEATHER fill:#e9c46a,color:black
```

---

## 16. Role-Based Access Control Matrix

```mermaid
flowchart TD
    subgraph ROLES["User Roles"]
        CAMPER["🏕️ Camper"]
        HOST["🏠 Host"]
        HOSTCAMPER["🏕️🏠 Host + Camper"]
        ADMIN["👑 Admin"]
    end

    subgraph ACTIONS["Available Actions"]
        BROWSE["Browse campgrounds"]
        BOOK["Book campgrounds"]
        REVIEW["Write reviews"]
        CREATE["Create campgrounds"]
        EDIT["Edit own campgrounds"]
        DELETE["Delete own campgrounds"]
        MANAGE["Manage all content"]
    end

    CAMPER --> BROWSE & BOOK & REVIEW
    HOST --> BROWSE & CREATE & EDIT & DELETE
    HOSTCAMPER --> BROWSE & BOOK & REVIEW & CREATE & EDIT & DELETE
    ADMIN --> BROWSE & BOOK & REVIEW & CREATE & EDIT & DELETE & MANAGE

    style CAMPER fill:#2a9d8f,color:white
    style HOST fill:#e9c46a,color:black
    style HOSTCAMPER fill:#f4a261,color:black
    style ADMIN fill:#e63946,color:white
```

> [!IMPORTANT]
> The `admin` role is enforced at registration (cannot self-assign) but currently has **no special admin-only functionality** beyond what `host+camper` can do. The `MANAGE` action exists in concept but has no routes or UI.
