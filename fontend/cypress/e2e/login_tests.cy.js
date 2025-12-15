describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('/login.html')
  })

  it('should display login form elements', () => {
    cy.get('select#role').should('be.visible')
    cy.get('input#email').should('be.visible')
    cy.get('input#password').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
    cy.get('h2').should('contain.text', 'Placement Management System')
  })

  it('should show error for empty form submission', () => {
    cy.get('button[type="submit"]').click()
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Please select a role before logging in.')
    })
  })

  it('should allow user to select different roles', () => {
    cy.get('select#role').select('student')
    cy.get('select#role').should('have.value', 'student')
    
    cy.get('select#role').select('staff')
    cy.get('select#role').should('have.value', 'staff')
    
    cy.get('select#role').select('admin')
    cy.get('select#role').should('have.value', 'admin')
  })

  it('should validate email format', () => {
    cy.get('input#email').type('invalid-email')
    cy.get('input#email').should('have.value', 'invalid-email')
    // Note: Your current implementation doesn't validate email format on frontend
  })
})