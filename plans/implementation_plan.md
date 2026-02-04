# Calendar Booking Feature - Implementation Plan

Add a date picker calendar to the campground detail page allowing users to select check-in/check-out dates and create bookings. Uses `react-day-picker` for the calendar UI. Also displays user's booking history on their profile.

---

## Proposed Changes

### Backend - Booking Schema & Model

#### [NEW] [bookingSchema.js](file:///d:/Campground_Finder_React/server/schemas/bookingSchema.js)

Create booking schema with:
- `startDate` (Date, required) - Check-in date
- `endDate` (Date, required) - Check-out date  
- `campground` (ObjectId ref to Campground, required)
- `user` (ObjectId ref to User, required)
- `totalPrice` (Number) - Calculated from nights × price
- `status` (String enum: 'pending', 'confirmed', 'cancelled')
- `createdAt` (Date, default: now)

#### [NEW] [booking.js](file:///d:/Campground_Finder_React/server/models/booking.js)

Export mongoose model for Booking.

#### [MODIFY] [userSchema.js](file:///d:/Campground_Finder_React/server/schemas/userSchema.js)

Add `bookings` array field (ObjectId ref to Booking) - follows existing `campgrounds` pattern.

---

### Backend - Routes & Controllers

#### [NEW] [bookings.js](file:///d:/Campground_Finder_React/server/controllers/bookings.js)

Controller functions:
- `createBooking` - Validate dates, check availability, create booking, push to user's bookings array
- `getBookingsForCampground` - Return all bookings for a campground (for calendar)
- `cancelBooking` - Allow user to cancel their booking

#### [NEW] [booking.js](file:///d:/Campground_Finder_React/server/routes/booking.js)

Routes:
```
POST   /campgrounds/:id/bookings     → createBooking
GET    /campgrounds/:id/bookings     → getBookingsForCampground  
DELETE /bookings/:bookingId          → cancelBooking
```

#### [MODIFY] [user.js](file:///d:/Campground_Finder_React/server/controllers/user.js)

Update `showUserInfo` to also populate `bookings` (with campground info) - single line change.

#### [MODIFY] [index.js](file:///d:/Campground_Finder_React/server/index.js)

Register booking routes with the Express app.

---

### Frontend - Calendar Component

#### [NEW] [BookingCalendar.jsx](file:///d:/Campground_Finder_React/client/components/BookingCalendar.jsx)

React component with:
- `react-day-picker` in range mode for selecting check-in/check-out
- Display 2 months side-by-side
- Disable past dates and already-booked date ranges
- Show selected range summary with total nights and price
- "Book Now" button (only for logged-in users)

#### [NEW] [BookingCalendar.css](file:///d:/Campground_Finder_React/client/css/BookingCalendar.css)

Custom styling to match Bootstrap theme.

---

### Frontend - Integration

#### [MODIFY] [Campground.jsx](file:///d:/Campground_Finder_React/client/components/Campground.jsx)

Changes:
- Import `BookingCalendar` component
- Add state for `bookedDates` (fetched from API)
- Fetch existing bookings on load via `GET /campgrounds/:id/bookings`
- Render `<BookingCalendar>` in the right column (after price info)
- Handle booking submission

#### [MODIFY] [UserProfile.jsx](file:///d:/Campground_Finder_React/client/components/UserProfile.jsx)

Add "My Bookings" section below profile card (follows existing campgrounds section pattern):
- Display list of user's bookings with campground name, dates, price, status
- Link to campground detail page
- Cancel booking button (if status not cancelled)

#### [MODIFY] [package.json](file:///d:/Campground_Finder_React/client/package.json)

Add dependency: `react-day-picker`

---

## Summary of Changes

| File | Change Type | Complexity |
|------|-------------|------------|
| `server/schemas/bookingSchema.js` | NEW | Simple |
| `server/models/booking.js` | NEW | 2 lines |
| `server/schemas/userSchema.js` | MODIFY | 1 line add |
| `server/controllers/bookings.js` | NEW | Medium |
| `server/routes/booking.js` | NEW | Simple |
| `server/controllers/user.js` | MODIFY | 1 line change |
| `server/index.js` | MODIFY | 2 lines add |
| `client/components/BookingCalendar.jsx` | NEW | Medium |
| `client/css/BookingCalendar.css` | NEW | Simple |
| `client/components/Campground.jsx` | MODIFY | Add import + state + render |
| `client/components/UserProfile.jsx` | MODIFY | Add bookings section (~30 lines) |
| `client/package.json` | MODIFY | 1 line add |

---

## Verification Plan

1. Test calendar displays on campground page
2. Test booking creation with date validation
3. Test booked dates are disabled on calendar
4. Test user bookings display on profile page
5. Test booking cancellation

> [!IMPORTANT]
> Ready to proceed with implementation. Confirm or request changes.
