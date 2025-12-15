describe('Admin Dashboard Tests', () => {
  beforeEach(() => {
    cy.visit('/admin_dashboard.html')
  })

  it('should display admin dashboard elements', () => {
    cy.get('h1').should('contain.text', 'Admin Dashboard')
    // Add more specific assertions based on your admin dashboard content
  })

  it('should have admin navigation elements', () => {
    // Check for admin-specific navigation elements
    cy.get('nav').should('exist')
    cy.get('button[onclick="logout()"]').should('be.visible')
  })
})