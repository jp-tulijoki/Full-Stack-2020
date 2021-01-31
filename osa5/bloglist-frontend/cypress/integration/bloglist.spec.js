describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'App tester',
      username: 'tester',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is displayed', function() {
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function() {
    it('login succeeds with correct credentials', function() {
      cy.get('#username').type('tester')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('Logged in as App tester')
    })

    it('login fails with invalid credentials', function() {
      cy.get('#username').type('hacker')
      cy.get('#password').type('invalidpassword')
      cy.get('#login-button').click()

      cy.get('.error').contains('invalid username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.get('#username').type('tester')
        cy.get('#password').type('password')
        cy.get('#login-button').click()
      })

      it('A blog can be created', function() {
        cy.get('#show-blog-form').click()
        cy.get('#title').type('test blog')
        cy.get('#author').type('test author')
        cy.get('#url').type('test url')
        cy.get('#blog-form-submit').click()

        cy.contains('test blog')
      })

      describe('When blogs exist', function() {
        beforeEach(function() {
          cy.get('#show-blog-form').click()
          cy.get('#title').type('test blog')
          cy.get('#author').type('test author')
          cy.get('#url').type('test url')
          cy.get('#blog-form-submit').click()
        })

        it('A blog can be liked', function() {
          cy.get('#show-details').click()
          cy.get('#like-blog').click()
          cy.contains('likes: 1')
        })

        it('A blog can be deleted', function() {
          cy.get('#show-details').click()
          cy.get('#delete-blog').click()
          cy.get('html').should('not.contain', 'test blog')
        })
      })
    })
  })
})