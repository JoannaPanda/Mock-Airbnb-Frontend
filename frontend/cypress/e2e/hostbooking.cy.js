describe('Booking Management for Admin', () => {
  // preparation: register the host, create, publish a listing
  // register the user to book the listing
  it('Perparing host and booking', () => {
    // Visit the registration page
    cy.visit('localhost:3000/register');
    // Fill in the registration form
    cy.get('input[placeholder="Enter your username"]').type('Host101');
    cy.get('input[placeholder="Enter your email"]').type('host101@example.com');
    cy.get('input[placeholder="Enter your password"]').type('TestPassword1!');
    cy.get('input[placeholder="Re-enter your password"]').type('TestPassword1!');
    // Submit the form
    cy.get('button[type="submit"]').click();

    cy.visit('localhost:3000/hosted-create');

    // Fill in the create listing form
    cy.get('input[placeholder="Enter your title"]').type('AAAAAAA Test Listing 101');
    cy.get('#street').type('101 yes St');
    cy.get('#city').type('Test City');
    cy.get('#state').type('Test State');
    cy.get('#country').type('Test Country');
    cy.get('#postcode').type('1212');

    // Select thumbnail type
    cy.get('#select-thumbnail-type').select('youtube');

    // Add thumbnail video
    cy.get('input[placeholder="Enter YouTube Video URL"]').type('https://www.youtube.com/watch?v=EKaHDu5ebqg');

    cy.get('#create-price').type('200');
    cy.get('#select-prop-type').click();
    cy.contains('Townhouse').click();
    cy.get('#select-bathroom').click();
    cy.contains('1').click()
    cy.get('#increase-doubed').click();

    cy.get('input[name="WiFi"]').check();

    // Submit the form
    cy.get('.form-submit').click();

    // Navigate to the hosted-listings page
    cy.visit('localhost:3000/hosted-listings');

    // Click on the Publish button of the first listing
    cy.get('button[aria-label="Publish Listing"]').click();

    // Wait for the dialog to open
    cy.wait(1000);

    // Select two dates in the calendar
    cy.get('div[tabindex="-1"][aria-label="Choose Monday November 27 of 2023"]').click();
    cy.get('div[tabindex="-1"][aria-label="Choose Wednesday November 29 of 2023"]').click();

    // Click on the Publish button in the dialog
    cy.get('#publish-submit').click();

    // Check if the publish is successful
    cy.url().should('include', '/hosted-listings');
    // Log out the first user
    cy.get('button.btn.logout').click();
    // Register with the second user account

    cy.visit('localhost:3000/register');
    // Fill in the registration form
    cy.get('input[placeholder="Enter your username"]').type('Book101');
    cy.get('input[placeholder="Enter your email"]').type('book101@example.com');
    cy.get('input[placeholder="Enter your password"]').type('TestPassword1!');
    cy.get('input[placeholder="Re-enter your password"]').type('TestPassword1!');
    // Submit the form
    cy.get('button[type="submit"]').click();

    // Navigate to the published listings page
    // Click on the listing to view details
    cy.get('.published-card').first().click();

    // Click on the "Book Now" button
    cy.get('.bookButton').click();

    // Input date range
    cy.get('#start-date-input').type('2023-11-27');
    cy.get('#end-date-input').type('2023-11-28');

    // Submit the booking form
    cy.get('#submit-booking-button').click();

    // Refresh the page
    cy.reload();

    // Check if the booking is successful
    cy.contains('Booking Status: pending, Date Range: 27/11/2023 to 28/11/2023').should('be.visible');
    cy.get('button.btn.logout').click();
  });

  // step 1 Host Login
  it('Host logs in successfully', () => {
    // Visit the login page
    cy.visit('localhost:3000/login');

    // Fill in the login form
    cy.get('input[placeholder="Enter your email"]').type('host101@example.com');
    cy.get('input[placeholder="Enter your password"]').type('TestPassword1!');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check if login is successful
    cy.url().should('include', '/home');
  });

  // step 2 Booking request
  it('Host access booking requests page successful!', () => {
    cy.visit('localhost:3000/hosted-listings');
    cy.wait(2000);
    // Click on the view booking button
    cy.get('.viewBooking').click();

    // Check if successful
    cy.contains('Booking Requests for Listing').should('be.visible');
  });

  // step 3 accept booking
  it('Accept Booking successful!', () => {
    cy.wait(2000);
    cy.get('button[aria-label="Accept Booking"]').click();
    cy.wait(1000);
    cy.contains('accepted').should('be.visible');
  });

  // step 4 Remove Live Listings
  it('Remove (unpublish) listing successful!', () => {
    cy.visit('localhost:3000/hosted-listings');
    cy.wait(1000);
    // Click on the Unpublish Listing button
    cy.get('button[aria-label="Unpublish Listing"]').click();

    // Check if the URL includes '/hosted-listings'
    cy.url().should('include', '/hosted-listings');

    // Success scriteria: Check if the Unpublish Listing button does not exist
    cy.get('button[aria-label="Unpublish Listing"]').should('not.exist');
  });

  // step 5 View Profit Analytics
  it('View profit line chart successful!', () => {
    // Click on the view booking button
    cy.visit('localhost:3000/hosted-listings');
    cy.contains('Listing Profits Graph').should('be.visible');
  });

  // step 6 logout
  it('Log out successfully', () => {
    // Click on the Logout button
    cy.get('button.btn.logout').click();
    // Check if the page redirects to the login page
    cy.url().should('include', '/login');
  });
})
