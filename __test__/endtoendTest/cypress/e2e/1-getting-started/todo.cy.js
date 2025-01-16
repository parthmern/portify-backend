describe('Testing app', () => {

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/

// Cypress.on('uncaught:exception', (err) => {
//     /* returning false here prevents Cypress from failing the test */
//     if (resizeObserverLoopErrRe.test(err.message)) {
//         return false
//     }
// })

// Cypress.on('uncaught:exception', (err) => {
//   // returning false here prevents Cypress from
//   // failing the test
//   cy.log('Cypress detected uncaught exception: ', err);
//   console.log('Cypress detected uncaught exception: ', err);
//   return false;
// });



// Cypress.on(
//   'uncaught:exception',
//   (err) => !err.message.includes('ResizeObserver loop limit exceeded')
// );


  Cypress.on('uncaught:exception', (err) => {
    if (
      err.message.includes('Minified React error #418') ||
      err.message.includes('Error: Minified React error #423') || 
      err.message.includes('ResizeObserver loop completed with undelivered notifications') ||
      resizeObserverLoopErrRe.test(err.message) ||
      err.message.includes('ResizeObserver loop limit exceeded') || 
      err.message.includes('ResizeObserver loop completed with undelivered notifications.') || 
      err.message.includes('')
    ) {
      return false;
    }
    // Enable uncaught exception failures for other errors
  });
  
  
  // 2. Re-enable Cypress uncaught exception failures from React hydration errors
  Cypress.on('uncaught:exception', () => {});
  

  // Runs before each test in the describe block
  beforeEach(() => {
    cy.visit('https://portify.live/');
  });

  it('is able to log in', () => {
    
    cy.contains("button", "Build for Free", { timeout: 10000 }) 
      .should("exist")
      .click(); 

    cy.contains("Login to Portify", { timeout: 10000 }) 
      .should("exist")
      .click();

    cy.contains("button", "Sign in with Google", { timeout: 10000 }) 
      .should("exist") 
      .click(); 

    // Google Login Redirection: Email Input
    // cy.url().should('contain', 'accounts.google.com')
    //   .get('input[type="email"]').type('your-email-here')
    //   .type('{enter}').wait(3000);

    // // Google Login Redirection: Password Input
    // cy.url().should('contain', 'accounts.google.com')
    //   .get('input[type="password"]').type('your-password-here')
    //   .type('{enter}').wait(3000);

    cy.origin('https://accounts.google.com', () => {

      Cypress.on('uncaught:exception', (err) => {
        if (
          err.message.includes('Minified React error #418') ||
          err.message.includes('Error: Minified React error #423') || 
          err.message.includes('ResizeObserver loop completed with undelivered notifications') ||
          resizeObserverLoopErrRe.test(err.message) ||
          err.message.includes('ResizeObserver loop limit exceeded') || 
          err.message.includes('ResizeObserver loop completed with undelivered notifications.') || 
          err.message.includes('')
        ) {
          return false;
        }
        // Enable uncaught exception failures for other errors
      });

      cy.get('input[type="email"]').should('be.visible').type('parthcadextra@gmail.com');
      cy.get('button').contains('Next').should('be.visible').click();

      cy.wait(3000);
      cy.get('input[type="password"]').should('be.visible').type('password');
      cy.get('button').contains('Next').should('be.visible').click();

      cy.wait(3000);



    });

    cy.contains("button", "Sign in with Google", { timeout: 10000 }) 
      .should("exist") 
      .click(); 

      cy.wait(4000);

    cy.contains("parthcadextra@gmail.com", { timeout: 10000 })

    cy.wait(3000);
    

    
    

    
    


    


      


      
    
    

    

    

  });

  
});
