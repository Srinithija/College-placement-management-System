describe('Student Dashboard Tests', () => {
  it('should redirect to login page when not authenticated', () => {
    // Visit the student dashboard without authentication
    cy.visit('/student_dashboard.html', {
      onBeforeLoad(win) {
        // Clear any existing session storage
        win.sessionStorage.clear();
      }
    });
    
    // Should be redirected to login page
    cy.url().should('include', '/login.html');
    // Note: Cypress might not catch the alert in all cases, so we focus on the redirect
  });

  it('should display dashboard elements when authenticated', () => {
    cy.visit('/student_dashboard.html', {
      onBeforeLoad(win) {
        // Set a mock token before the page loads
        win.sessionStorage.setItem('token', 'mock-token');
        
        // Stub fetch API calls to prevent actual API requests
        cy.stub(win, 'fetch').as('fetchStub').callsFake((url, options) => {
          // Mock different API responses based on URL
          if (url && url.includes('/api/student/me')) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve({ 
                name: 'Test Student', 
                email: 'student@test.com', 
                department: 'CSE' 
              })
            });
          }
          
          // Return empty arrays for other endpoints to prevent errors
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([])
          });
        });
      }
    });

    // Check that we're on the student dashboard (not redirected)
    cy.url().should('include', '/student_dashboard.html');
    
    // Check sidebar navigation elements
    cy.get('aside').should('be.visible');
    cy.get('button[onclick*="profile"]').should('be.visible');
    cy.get('button[onclick*="jobs"]').should('be.visible');
    cy.get('button[onclick*="trainings"]').should('be.visible');
    cy.get('button[onclick*="announcements"]').should('be.visible');
    cy.get('button[onclick*="applications"]').should('be.visible');
    cy.get('button[onclick="logout()"]').should('be.visible');
    
    // Check main content
    cy.get('h1').should('contain.text', 'Student Dashboard');
  });

  it('should switch between dashboard sections', () => {
    cy.visit('/student_dashboard.html', {
      onBeforeLoad(win) {
        // Set a mock token
        win.sessionStorage.setItem('token', 'mock-token');
        
        // Stub fetch to prevent API calls
        cy.stub(win, 'fetch').callsFake(() => {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([])
          });
        });
      }
    });

    // Wait for page to load
    cy.url().should('include', '/student_dashboard.html');
    
    // Click on different sections
    cy.get('button[onclick*="jobs"]').should('be.visible').click();
    cy.get('#jobs').should('be.visible');
    
    cy.get('button[onclick*="trainings"]').should('be.visible').click();
    cy.get('#trainings').should('be.visible');
    
    cy.get('button[onclick*="announcements"]').should('be.visible').click();
    cy.get('#announcements').should('be.visible');
    
    cy.get('button[onclick*="applications"]').should('be.visible').click();
    cy.get('#applications').should('be.visible');
  });

  it('should display profile form', () => {
    cy.visit('/student_dashboard.html', {
      onBeforeLoad(win) {
        // Set a mock token
        win.sessionStorage.setItem('token', 'mock-token');
        
        // Stub fetch to return profile data
        cy.stub(win, 'fetch').callsFake((url) => {
          if (url && url.includes('/api/student/me')) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve({ 
                name: 'Test Student', 
                email: 'student@test.com', 
                department: 'CSE' 
              })
            });
          }
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([])
          });
        });
      }
    });

    // Wait for page to load
    cy.url().should('include', '/student_dashboard.html');
    
    // Check profile section elements
    cy.get('#profile').should('be.visible');
    cy.get('form#profileForm').should('be.visible');
    cy.get('input#pname').should('be.visible');
    cy.get('input#pemail').should('be.visible');
    cy.get('input#pdepartment').should('be.visible');
    cy.get('input#ppass').should('be.visible');
  });
})