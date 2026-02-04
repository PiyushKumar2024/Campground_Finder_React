# Calendar Booking Feature - Task Breakdown

## Backend (Server)

- [ ] Create `bookingSchema.js` - Define booking model with dates, user, campground, status
- [ ] Create `booking.js` model - Export mongoose model
- [ ] Update `userSchema.js` - Add bookings reference array (1 line)
- [ ] Create `bookings.js` controller - Implement create, get, cancel booking logic
- [ ] Create `booking.js` routes - Define API endpoints
- [ ] Update `user.js` controller - Add `.populate('bookings')` to showUserInfo (1 line)
- [ ] Register booking routes in `server/index.js`

## Frontend (Client)

- [ ] Install `react-day-picker` dependency
- [ ] Create `BookingCalendar.jsx` component - Calendar with date range selection
- [ ] Create `BookingCalendar.css` - Styling for the calendar
- [ ] Update `Campground.jsx` - Integrate calendar component and booking UI
- [ ] Update `UserProfile.jsx` - Add "My Bookings" section (follows campgrounds pattern)

## Verification

- [ ] Test booking creation via calendar
- [ ] Test calendar displays blocked dates
- [ ] Test bookings display on user profile
- [ ] Test booking cancellation
