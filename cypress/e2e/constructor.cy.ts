describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    // Перехват запроса на получение ингредиентов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Открываем главную страницу
    cy.visit('/');
    
    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
    cy.wait(1000);
  });

  describe('Добавление ингредиента в конструктор', () => {
    it('должна добавляться булка в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .first()
        .click({ force: true });

      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });

    it('должна добавляться начинка в конструктор', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .first()
        .click({ force: true });

      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открываться модальное окно при клике на ингредиент', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.contains('Детали ингредиента').should('be.visible');
    });

    it('должно отображать данные именно того ингредиента, по которому кликнули', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.get('body').type('{esc}');
      
      cy.contains('Биокотлета из марсианской Магнолии').click();
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      cy.get('body').type('{esc}');
      
      cy.contains('Соус Spicy-X').click();
      cy.contains('Соус Spicy-X').should('be.visible');
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
  });

  describe('Создание заказа', () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'password123';

    before(() => {
      // Регистрация пользователя перед тестом
      cy.request({
        method: 'POST',
        url: 'https://norma.education-services.ru/api/auth/register',
        body: {
          email: testEmail,
          password: testPassword,
          name: 'Test User'
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log('Registration response:', response.status);
      });
    });

    it('должен успешно создаваться заказ', () => {
      // Авторизация через API запрос
      cy.request({
        method: 'POST',
        url: 'https://norma.education-services.ru/api/auth/login',
        body: {
          email: testEmail,
          password: testPassword
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        // Устанавливаем токены
        cy.setCookie('accessToken', response.body.accessToken);
        localStorage.setItem('refreshToken', response.body.refreshToken);
      });

      // Перезагружаем страницу после авторизации
      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait(1000);
      
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .first()
        .click({ force: true });

      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .first()
        .click({ force: true });

      // Проверяем что кнопка активна
      cy.contains('Оформить заказ').should('be.enabled');

      // Перехват запроса на создание заказа
      cy.intercept('POST', '**/api/orders', {
        statusCode: 200,
        body: {
          success: true,
          name: 'Флюоресцентный бургер',
          order: {
            number: 12345
          }
        }
      }).as('createOrder');

      // Нажимаем кнопку "Оформить заказ"
      cy.contains('Оформить заказ').click();

      // Ждем ответа от API
      cy.wait('@createOrder', { timeout: 10000 });

      // Проверяем номер заказа
      cy.contains('12345', { timeout: 10000 }).should('be.visible');

      // Закрываем модалку
      cy.get('#modals button').click();

      // Проверяем, что конструктор очистился
      cy.contains('Выберите булки').should('be.visible');
    });
  });
});
