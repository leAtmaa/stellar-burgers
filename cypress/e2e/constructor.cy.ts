/// <reference types="cypress" />

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    // Моковые данные из fixtures для всех backend-ответов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    // Моковые токены авторизации
    cy.setCookie('accessToken', 'Bearer mock-access-token');
    localStorage.setItem('refreshToken', 'mock-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
    cy.wait(2000);
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('должна добавляться булка в конструктор', () => {
    cy.contains('Краторная булка N-200i')
      .parents('li')
      .find('button')
      .click();

    // Поиск внутри контейнера по data-testid
    cy.get('[data-testid="burger-constructor"]').within(() => {
      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });
  });

  it('должна добавляться начинка в конструктор', () => {
    cy.contains('Краторная булка N-200i')
      .parents('li')
      .find('button')
      .click();

    cy.contains('Биокотлета из марсианской Магнолии')
      .parents('li')
      .find('button')
      .click();

    // Поиск внутри контейнера по data-testid
    cy.get('[data-testid="burger-constructor"]').within(() => {
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    });

    // Проверка стоимости
    cy.contains('2934').should('be.visible');
  });

  it('должно открываться модальное окно при клике на ингредиент', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента', { timeout: 10000 }).should('be.visible');
  });

  it('должно закрываться модальное окно при клике на крестик', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('be.visible');
    cy.get('#modals button').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('должно закрываться модальное окно при клике на оверлей', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('be.visible');
    cy.get('body').click(0, 0);
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('должен успешно создаваться заказ', () => {
    // Собираем бургер
    cy.contains('Краторная булка N-200i')
      .parents('li')
      .find('button')
      .click();

    cy.contains('Биокотлета из марсианской Магнолии')
      .parents('li')
      .find('button')
      .click();

    // Оформляем заказ
    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');

    // Проверяем номер заказа
    cy.contains('12345', { timeout: 10000 }).should('be.visible');

    // Закрываем модалку
    cy.get('#modals button').click();

    // Проверяем полную очистку конструктора внутри контейнера
    cy.get('[data-testid="burger-constructor"]').within(() => {
      // Проверяем, что булка удалилась
      cy.contains('Краторная булка N-200i (верх)').should('not.exist');
      cy.contains('Краторная булка N-200i (низ)').should('not.exist');
      // Проверяем, что начинка удалилась
      cy.contains('Биокотлета из марсианской Магнолии').should('not.exist');
      // Проверяем плейсхолдеры
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });
});
