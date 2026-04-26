describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    // Перехват запроса на получение ингредиентов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Перехват запроса на получение данных пользователя
    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    // Открываем главную страницу
    cy.visit('/');
    
    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиента в конструктор', () => {
    it('должна добавляться булка в конструктор', () => {
      // Находим булку и нажимаем "Добавить"
      cy.contains('Краторная булка N-200i')
        .parents('.burger-ingredient')
        .find('button')
        .click();

      // Проверяем, что булка отобразилась в конструкторе
      cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      cy.contains('Краторная булка N-200i (низ)').should('be.visible');
    });

    it('должна добавляться начинка в конструктор', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('.burger-ingredient')
        .find('button')
        .click();

      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открываться модальное окно при клике на ингредиент', () => {
      cy.contains('Краторная булка N-200i').click();

      cy.get('#modals').should('be.visible');
      cy.get('#modals').contains('Детали ингредиента').should('be.visible');
    });

    it('должно отображать данные именно того ингредиента, по которому кликнули', () => {
      // Кликаем на булку
      cy.contains('Краторная булка N-200i').click();
      cy.get('#modals').contains('Краторная булка N-200i').should('be.visible');
      cy.get('#modals').contains('1255').should('be.visible');
      
      // Закрываем модалку
      cy.get('#modals').find('button').click();
      
      // Кликаем на начинку
      cy.contains('Биокотлета из марсианской Магнолии').click();
      cy.get('#modals').contains('Биокотлета из марсианской Магнолии').should('be.visible');
      cy.get('#modals').contains('424').should('be.visible');
    });

    it('должно закрываться модальное окно при клике на крестик', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('#modals').should('be.visible');
      cy.get('#modals').find('button').click();
      cy.get('#modals').should('be.empty');
    });

    it('должно закрываться модальное окно при клике на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('#modals').should('be.visible');
      cy.get('[class*="overlay"]').click();
      cy.get('#modals').should('be.empty');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Устанавливаем фейковые токены авторизации
      cy.setCookie('accessToken', 'fake-access-token');
      localStorage.setItem('refreshToken', 'fake-refresh-token');

      // Перехват запроса на создание заказа
      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');
    });

    afterEach(() => {
      // Очищаем токены после теста
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });

    it('должен успешно создаваться заказ', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parents('.burger-ingredient')
        .find('button')
        .click();

      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('.burger-ingredient')
        .find('button')
        .click();

      // Добавляем соус
      cy.contains('Соус Spicy-X')
        .parents('.burger-ingredient')
        .find('button')
        .click();

      // Нажимаем кнопку "Оформить заказ"
      cy.contains('Оформить заказ').click();

      // Ждем ответа от API
      cy.wait('@createOrder');

      // Проверяем, что модальное окно открылось с верным номером заказа
      cy.get('#modals').should('be.visible');
      cy.get('#modals').contains('12345').should('be.visible');
      cy.get('#modals').contains('идентификатор заказа').should('be.visible');

      // Закрываем модальное окно
      cy.get('#modals').find('button').click();

      // Проверяем, что конструктор очистился
      cy.contains('Краторная булка N-200i (верх)').should('not.exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('not.exist');
      cy.contains('Соус Spicy-X').should('not.exist');
      
      // Проверяем, что кнопка снова неактивна
      cy.contains('Оформить заказ').should('be.disabled');
    });
  });
});
