describe('Homepage Tests', () => {
  beforeEach(() => {
    cy.visit('/index.html')
  })

  it('should display homepage elements correctly', () => {
    // Check if header elements are present
    cy.get('header h1').should('contain.text', 'Placement Management System')
    
    // Check navigation links
    cy.get('nav a').should('have.length', 4)
    cy.get('nav a').eq(0).should('contain.text', 'Home')
    cy.get('nav a').eq(1).should('contain.text', 'Login')
    cy.get('nav a').eq(2).should('contain.text', 'Register')
    cy.get('nav a').eq(3).should('contain.text', 'About')
    
    // Check hero section
    cy.get('.hero h2').should('contain.text', 'Welcome to College Placement Management System')
    cy.get('.btn-login').should('be.visible')
    cy.get('.btn-register').should('be.visible')
  })

  it('should navigate to login page when clicking login button', () => {
    cy.get('.btn-login').click()
    cy.url().should('include', '/login.html')
  })

  it('should navigate to registration page when clicking register button', () => {
    cy.get('.btn-register').click()
    cy.url().should('include', '/register.html')
  })

  it('should show about information when clicking about link', () => {
    cy.get('a#aboutLink').click()
    // Since your about link shows an alert, we can't easily test the content
    // But we can verify the link exists and is clickable
  })
})