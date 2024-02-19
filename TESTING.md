# UI tests


## "happy path"

1. Registers successfully
2. Creates a new listing successfully
3. Updates the thumbnail and title of the listing successfully
4. Publish a listing successfully
5. Unpublish a listing successfully
6. Make a booking successfully
7. Logs out of the application successfully
8. Logs back into the application successfully



## UI test - Alternate Path: Booking Management for Admin

1. **Login as Admin:**
   - Navigate to the login screen.
   - Enter admin credentials.
   - Click the login button.

2. **View Booking Requests:**
   - Click on a button to access the booking management screen.
   - This screen displays a list of all booking requests for the listing host own.

3. **Accept or Deny Booking Requests:**
   - For each booking request, the admin can either accept or deny the request.
   - Accepting a request confirms the booking of the listing.

4. **Remove Live Listings (unpublish):**
   - Remove a live listing.
   - Removing/unpublishing a listing hides it from other users.

5. **View Booking History and Profit Analytics:**
   - View information such as how long the listing has been online, booking request history, and financial details.

6. **Logout:**
   - Include a logout button on any screen within the admin dashboard.
   - Clicking the logout button should redirect the admin to the login screen.

### Rationale:
This alternate path focuses on the day-to-day management tasks of an Airbrb admin (host), especially regarding booking requests. It allows the admin to efficiently handle booking requests, make decisions on accepting or denying bookings, and manage the overall performance of their listings. 

This path is designed to demonstrate the admin's role in interacting with guests, maintaining the quality of listings, and viewing booking history & analytics.
