describe('Admin Process - happy path', () => {
  // step 1
  it('Registers successfully', () => {
    // Visit the registration page
    cy.visit('localhost:3000/register');

    // Fill in the registration form
    cy.get('input[placeholder="Enter your username"]').type('TestUser27');
    cy.get('input[placeholder="Enter your email"]').type('testuser27@example.com');
    cy.get('input[placeholder="Enter your password"]').type('TestPassword1!');
    cy.get('input[placeholder="Re-enter your password"]').type('TestPassword1!');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check if registration is successful
    cy.url().should('include', '/home');
  });

  // step 2
  it('Creates a new listing successfully', () => {
    cy.visit('localhost:3000/hosted-create');

    // Fill in the create listing form
    cy.get('input[placeholder="Enter your title"]').type('Test Listing 27a');
    cy.get('#street').type('17a Main St');
    cy.get('#city').type('Test City');
    cy.get('#state').type('Test State');
    cy.get('#country').type('Test Country');
    cy.get('#postcode').type('4327');

    // Select thumbnail type
    cy.get('#select-thumbnail-type').select('youtube');

    // Add thumbnail video
    cy.get('input[placeholder="Enter YouTube Video URL"]').type('https://www.youtube.com/watch?v=EKaHDu5ebqg');

    cy.get('#create-price').type('300');
    cy.get('#select-prop-type').click();
    cy.contains('Townhouse').click();
    cy.get('#select-bathroom').click();
    cy.contains('1').click()
    cy.get('#increase-doubed').click();

    cy.get('input[name="WiFi"]').check();

    // Submit the form
    cy.get('.form-submit').click();

    cy.wait(1000);

    // Check if listing creation is successful
    cy.url().should('include', '/hosted-listings');
  });

  // step 3
  it('Updates the thumbnail and title of the listing successfully', () => {
    // User have a listing on the hosted-listings page
    // Navigate to the hosted-listings page
    cy.visit('localhost:3000/hosted-listings');

    cy.wait(1000);

    // Click on the Edit button
    cy.get('#edit-listing').click();

    // On the edit-listing page, update the thumbnail
    // Select thumbnail type
    cy.get('#select-thumbnail-type').select('youtube');
    // Add thumbnail video (edit form)
    cy.get('#edit-thumbnail-youtube').type('https://www.youtube.com/watch?v=CLeZyIID9Bo');

    // Update the title
    cy.get('input[placeholder="Enter your title"]').clear().type('New Title');

    // Submit the form
    cy.get('.edit-submit').click();

    cy.wait(1000)

    // Check if the update is successful
    cy.url().should('include', '/hosted-listings');

    cy.contains('New Title'); // Check if the new title is displayed
  });

  // step 4
  it('Publishes a listing successfully with date range selection', () => {
    // Navigate to the hosted-listings page
    cy.visit('localhost:3000/hosted-listings');

    // Click on the Publish button of the first listing
    cy.get('button[aria-label="Publish Listing"]').click();

    // Wait for the dialog to open
    cy.wait(1000)

    // Select two dates in the calendar
    cy.get('div[tabindex="-1"][aria-label="Choose Monday November 27 of 2023"]').click();
    cy.get('div[tabindex="-1"][aria-label="Choose Wednesday November 29 of 2023"]').click();

    // Click on the Publish button in the dialog
    cy.get('#publish-submit').click();

    // Check if the publish is successful
    cy.url().should('include', '/hosted-listings');
    cy.get('button[aria-label="Publish Listing"]').should('not.exist');
  });

  // step 5
  it('Unpublishes a listing successfully', () => {
    // Navigate to the hosted-listings page
    cy.visit('localhost:3000/hosted-listings');

    // Click on the Unpublish Listing button
    cy.get('button[aria-label="Unpublish Listing"]').click();

    // Check if the URL includes '/hosted-listings'
    cy.url().should('include', '/hosted-listings');

    // Success scriteria: Check if the Unpublish Listing button does not exist
    cy.get('button[aria-label="Unpublish Listing"]').should('not.exist');
  });

  // Register and login another user account
  it('Registers and logs into another user account', () => {
    // registration
    cy.visit('localhost:3000/register');

    // Fill in the registration form
    cy.get('input[placeholder="Enter your username"]').type('TestUser28');
    cy.get('input[placeholder="Enter your email"]').type('testuser28@example.com');
    cy.get('input[placeholder="Enter your password"]').type('TestPassword2!');
    cy.get('input[placeholder="Re-enter your password"]').type('TestPassword2!');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check if registration is successful
    cy.url().should('include', '/home');
  });

  // Publish a listing using this second user account
  it('Publishes a listing successfully', () => {
    cy.visit('localhost:3000/hosted-create');

    // Fill in the create listing form
    cy.get('input[placeholder="Enter your title"]').type('Test Listing 27b');
    cy.get('#street').type('127b Main St');
    cy.get('#city').type('Testb City 2');
    cy.get('#state').type('Test State 2');
    cy.get('#country').type('Test Country 2');
    cy.get('#postcode').type('1234');

    // Select thumbnail type
    cy.get('#select-thumbnail-type').select('youtube');

    // Add thumbnail video
    cy.get('input[placeholder="Enter YouTube Video URL"]').type('https://www.youtube.com/watch?v=EKaHDu5ebqg');

    cy.get('#create-price').type('500');
    cy.get('#select-prop-type').click();
    cy.contains('Townhouse').click();
    cy.get('#select-bathroom').click();
    cy.contains('1').click()
    cy.get('#increase-doubed').click();

    cy.get('input[name="TV"]').check();

    // Submit the form
    cy.get('.form-submit').click();

    // Check if listing creation is successful
    cy.get('button[aria-label="Publish Listing"]').click();

    // Wait for the dialog to open
    cy.wait(1000)

    // Select two dates in the calendar
    cy.get('div[tabindex="-1"][aria-label="Choose Monday November 27 of 2023"]').click();
    cy.get('div[tabindex="-1"][aria-label="Choose Wednesday November 29 of 2023"]').click();

    // Click on the Publish button in the dialog
    cy.get('#publish-submit').click();

    // Check if the publish is successful
    cy.url().should('include', '/hosted-listings');
    cy.get('button[aria-label="Publish Listing"]').should('not.exist');
  });

  // step 6: Make a booking using the first user account
  it('Makes a booking successfully', () => {
    // Log out the first user
    cy.get('button.btn.logout').click();
    // Log in with the second user account
    cy.visit('localhost:3000/login');

    // Fill in the login form
    cy.get('input[placeholder="Enter your email"]').type('testuser27@example.com');
    cy.get('input[placeholder="Enter your password"]').type('TestPassword1!');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check if login is successful
    cy.url().should('include', '/home');
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
  });

  // step 7
  it('Log out successfully', () => {
    // Click on the Logout button
    cy.get('button.btn.logout').click();
    // Check if the page redirects to the login page
    cy.url().should('include', '/login');
  });

  // step 8
  it('Log back in successfully', () => {
    // Visit the login page
    // cy.visit('localhost:3000/login');

    // Fill in the login form
    cy.get('input[placeholder="Enter your email"]').type('testuser27@example.com');
    cy.get('input[placeholder="Enter your password"]').type('TestPassword1!');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check if login is successful
    cy.url().should('include', '/home');
  });
});
