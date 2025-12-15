describe('Registration Page Tests', () => {
  beforeEach(() => {
    cy.visit('/register.html')
  })

  it('should display registration form elements', () => {
    cy.get('input#name').should('be.visible')
    cy.get('input#email').should('be.visible')
    cy.get('input#password').should('be.visible')
    cy.get('input#confirmPassword').should('be.visible')
    cy.get('select#role').should('be.visible')
    cy.get('select#departmentField').should('not.be.visible') // Hidden by default
    cy.get('button[type="submit"]').should('be.visible')
    cy.get('h2').should('contain.text', 'Create Account')
  })

  it('should allow user to fill registration form', () => {
    cy.get('input#name').type('Test User')
    cy.get('input#name').should('have.value', 'Test User')
    
    cy.get('input#email').type('test@example.com')
    cy.get('input#email').should('have.value', 'test@example.com')
    
    cy.get('input#password').type('password123')
    cy.get('input#password').should('have.value', 'password123')
    
    cy.get('input#confirmPassword').type('password123')
    cy.get('input#confirmPassword').should('have.value', 'password123')
    
    cy.get('select#role').select('student')
    cy.get('select#role').should('have.value', 'student')
  })

  it('should show department field when student role is selected', () => {
    cy.get('select#departmentField').should('not.be.visible')
    cy.get('select#role').select('student')
    cy.get('select#departmentField').should('be.visible')
  })

  it('should hide department field when non-student role is selected', () => {
    // First show it by selecting student
    cy.get('select#role').select('student')
    cy.get('select#departmentField').should('be.visible')
    
    // Then hide it by selecting staff
    cy.get('select#role').select('staff')
    cy.get('select#departmentField').should('not.be.visible')
  })

  it('should navigate to login page when clicking login link', () => {
    cy.contains('a', 'Login here').click()
    cy.url().should('include', '/login.html')
  })
})