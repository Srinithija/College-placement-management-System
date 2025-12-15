describe('Navigation Tests', () => {
  it('should navigate between pages correctly', () => {
    // Start at homepage
    cy.visit('/index.html')
    
    // Navigate to login
    cy.get('a[href="login.html"]').click()
    cy.url().should('include', '/login.html')
    
    // Go back to homepage using browser back
    cy.go('back')
    cy.url().should('include', '/index.html')
    
    // Navigate to register from index
    cy.get('a[href="register.html"]').click()
    cy.url().should('include', '/register.html')
    
    // Go back to homepage using browser back
    cy.go('back')
    cy.url().should('include', '/index.html')
  })

  it('should have consistent page titles', () => {
    // Check homepage
    cy.visit('/index.html')
    cy.title().should('contain', 'College Placement Management System')
    
    // Check login page
    cy.visit('/login.html')
    cy.title().should('contain', 'College Placement System')
    
    // Check registration page
    cy.visit('/register.html')
    cy.title().should('contain', 'Register')
  })
})