// Команда для установки моковой авторизации
Cypress.Commands.add('mockAuth', () => {
  cy.setCookie('accessToken', 'mock-access-token');
  localStorage.setItem('refreshToken', 'mock-refresh-token');
  
  cy.intercept('GET', '**/api/auth/user', {
    fixture: 'user.json'
  }).as('getUser');
});

// Команда для очистки авторизации
Cypress.Commands.add('clearAuth', () => {
  cy.clearCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

// Команда для добавления ингредиента
Cypress.Commands.add('addIngredient', (ingredientName: string) => {
  cy.contains(ingredientName)
    .parents('.burger-ingredient')
    .find('button')
    .click();
});

// Объявление типов для TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      mockAuth(): Chainable<void>;
      clearAuth(): Chainable<void>;
      addIngredient(ingredientName: string): Chainable<void>;
    }
  }
}

export {};
