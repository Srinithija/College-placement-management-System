describe('Staff Dashboard Tests', () => {
  // Handle uncaught exceptions to prevent test failures from JavaScript errors in the app
  Cypress.on('uncaught:exception', (err, runnable) => {
    // Return false to prevent Cypress from failing the test
    return false;
  });

  it('should redirect to login page when not authenticated', () => {
    // Visit the staff dashboard without authentication
    cy.visit('/staff_dashboard.html', {
      onBeforeLoad(win) {
        // Clear any existing session storage
        win.sessionStorage.clear();
      }
    });
    
    // Should be redirected to login page
    cy.url().should('include', '/login.html');
  });

  it('should display staff dashboard elements when authenticated', () => {
    cy.visit('/staff_dashboard.html', {
      onBeforeLoad(win) {
        // Set a mock token before the page loads
        win.sessionStorage.setItem('token', 'mock-token');
        
        // Stub all fetch API calls to prevent actual API requests and return mock data
        cy.stub(win, 'fetch').as('fetchStub').callsFake((url, options) => {
          // Mock different API responses based on URL
          if (url && url.includes('/api/staff/me')) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve({ 
                name: 'Test Staff', 
                email: 'staff@test.com' 
              })
            });
          } else if (url && url.includes('/api/staff/students')) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve([
                { name: 'Student 1', email: 'student1@test.com', department: 'CSE' },
                { name: 'Student 2', email: 'student2@test.com', department: 'ECE' }
              ])
            });
          } else if (url && url.includes('/api/staff/jobs')) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve([
                { _id: 'job1', title: 'Software Engineer', company: 'Tech Corp', description: 'Entry level position' }
              ])
            });
          } else if (url && url.includes('/api/staff/trainings')) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve([
                { _id: 'train1', title: 'JavaScript Training', trainer: 'John Doe', date: '2025-12-01' }
              ])
            });
          } else if (url && url.includes('/api/staff/announcements')) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve([
                { _id: 'ann1', title: 'Important Notice', message: 'Please check your emails', date: '2025-11-01' }
              ])
            });
          } else if (url && url.includes('/api/staff/applications')) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve([
                { 
                  _id: 'app1',
                  studentId: { name: 'Student 1' }, 
                  jobId: { title: 'Software Engineer', company: 'Tech Corp' },
                  status: 'applied'
                }
              ])
            });
          }
          
          // Default response for any other endpoints
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({})
          });
        });
      }
    });

    // Check that we're on the staff dashboard (not redirected)
    cy.url().should('include', '/staff_dashboard.html');
    
    // Check main heading
    cy.get('h1').should('contain.text', 'Staff Dashboard');
    
    // Check sidebar navigation elements
    cy.get('aside').should('be.visible');
    cy.get('button[onclick*="profile"]').should('be.visible');
    cy.get('button[onclick*="students"]').should('be.visible');
    cy.get('button[onclick*="jobs"]').should('be.visible');
    cy.get('button[onclick*="trainings"]').should('be.visible');
    cy.get('button[onclick*="announcements"]').should('be.visible');
    cy.get('button[onclick*="applications"]').should('be.visible');
    cy.get('button[onclick="logout()"]').should('be.visible');
  });

  it('should switch between dashboard sections', () => {
    cy.visit('/staff_dashboard.html', {
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
    cy.url().should('include', '/staff_dashboard.html');
    
    // Click on different sections
    cy.get('button[onclick*="students"]').should('be.visible').click();
    cy.get('#students').should('be.visible');
    
    cy.get('button[onclick*="jobs"]').should('be.visible').click();
    cy.get('#jobs').should('be.visible');
    
    cy.get('button[onclick*="trainings"]').should('be.visible').click();
    cy.get('#trainings').should('be.visible');
    
    cy.get('button[onclick*="announcements"]').should('be.visible').click();
    cy.get('#announcements').should('be.visible');
    
    cy.get('button[onclick*="applications"]').should('be.visible').click();
    cy.get('#applications').should('be.visible');
  });
})