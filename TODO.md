# Fix end_coord validation error in booking location update

## Steps:
- [x] Step 1: Update src/pages/dashboard/screens/bookings/requestDetails.tsx to pass complete initialData with coords
- [x] Step 2: Create this TODO.md (done)
- [x] Step 3: Update src/pages/dashboard/screens/bookings/UpdateLocationModal.tsx handleSubmit to geocode missing end_coord from dropoff_address
- [x] Step 4: Test the location update flow
- [x] Step 5: Mark complete and attempt_completion

**Goal:** Ensure updateBookingLocation always sends valid end_coord.latitude number, using initial/geocoded from address if not set.

