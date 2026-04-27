describe('Проверка загрузки страницы', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('страница должна загружаться и отображать ингредиенты', () => {
    // Проверяем, что страница не пустая
    cy.get('body').should('be.visible');
    
    // Проверяем, что есть заголовок
    cy.contains('Соберите бургер').should('be.visible');
    
    // Проверяем, что ингредиенты отображаются
    cy.contains('Краторная булка N-200i').should('be.visible');
    
    // Выводим HTML для отладки
    cy.get('body').then(($body) => {
      cy.log($body.html());
    });
  });

  it('должна быть кнопка добавления ингредиента', () => {
    // Ищем кнопку "Добавить" рядом с булкой
    cy.contains('Краторная булка N-200i')
      .closest('li')
      .find('button')
      .should('exist');
  });
});
