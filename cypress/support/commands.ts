/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login as a user
       * @example cy.login('username', 'password')
       */
      login(username: string, password: string): Chainable<void>
      
      /**
       * Custom command to get element by data-testid
       * @example cy.getByTestId('submit-button')
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>
      
      /**
       * Custom command to login as child via API
       * @example cy.loginAsChild()
       */
      loginAsChild(): Chainable<void>
      
      /**
       * Custom command to login as parent via API
       * @example cy.loginAsParent()
       */
      loginAsParent(): Chainable<void>
      
      /**
       * Custom command to logout
       * @example cy.logout()
       */
      logout(): Chainable<void>
      
      /**
       * Custom command to create a goal request
       * @example cy.createGoalRequest({ name: '아이패드', totalAmount: '1200000', monthlyAmount: '200000', savingDay: '10' })
       */
      createGoalRequest(goalData: { name: string; totalAmount: string; monthlyAmount: string; savingDay: string; expectedMonths: number }): Chainable<void>
    }
  }
}

// Custom command to login (UI-based)
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session([username, password], () => {
    cy.visit('/login')
    cy.get('input[name="username"]').type(username)
    cy.get('input[name="password"]').type(password)
    cy.get('button[type="submit"]').click()
    cy.url().should('not.include', '/login')
  })
})

// Custom command to get by data-testid
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`)
})

// Custom command to login as child (API-based)
Cypress.Commands.add('loginAsChild', () => {
  const baseUrl = 'http://localhost:8080/channel';
  const userData = {
    email: 'child@fisa.com',
    password: 'fisa123!',
    name: '자녀',
    role: 'CHILD',
    birthDate: '020202',
    gender: '1',
    phoneNumber: '01011112222',
    simplePassword: '123456'
  };
  
  cy.request({
    method: 'POST',
    url: `${baseUrl}/auth/login`,
    body: {
      email: userData.email,
      password: userData.password
    },
    failOnStatusCode: false
  }).then((res) => {
    if (res.status === 401) {
      cy.log('⚠️ 로그인 실패, 회원가입 시도...');
      // 회원가입 시도
      cy.request({
        method: 'POST',
        url: `${baseUrl}/auth/signup`,
        body: userData
      }).then(() => {
        cy.log('✅ 회원가입 성공, 다시 로그인...');
        // 다시 로그인
        cy.request({
          method: 'POST',
          url: `${baseUrl}/auth/login`,
          body: {
            email: userData.email,
            password: userData.password
          }
        }).then((loginRes) => {
          saveToken(loginRes.body.data);
        });
      });
    } else {
      saveToken(res.body.data);
    }
  });
})

// Custom command to login as parent (API-based)
Cypress.Commands.add('loginAsParent', () => {
  const baseUrl = 'http://localhost:8080/channel';
  const userData = {
    email: 'parent@fisa.com',
    password: 'fisa123!',
    name: '부모',
    role: 'PARENT',
    birthDate: '020202',
    gender: '2',
    phoneNumber: '01033334444',
    simplePassword: '123456'
  };
  
  cy.request({
    method: 'POST',
    url: `${baseUrl}/auth/login`,
    body: {
      email: userData.email,
      password: userData.password
    },
    failOnStatusCode: false
  }).then((res) => {
    if (res.status === 401) {
      cy.log('⚠️ 로그인 실패, 회원가입 시도...');
      // 회원가입 시도
      cy.request({
        method: 'POST',
        url: `${baseUrl}/auth/signup`,
        body: userData
      }).then(() => {
        cy.log('✅ 회원가입 성공, 다시 로그인...');
        // 다시 로그인
        cy.request({
          method: 'POST',
          url: `${baseUrl}/auth/login`,
          body: {
            email: userData.email,
            password: userData.password
          }
        }).then((loginRes) => {
          saveToken(loginRes.body.data);
        });
      });
    } else {
      saveToken(res.body.data);
    }
  });
})

// Helper function to save token
const saveToken = (data: any) => {
  cy.window().then((win) => {
    win.localStorage.setItem('accessToken', data.accessToken);
    if (data.tokenType) {
      win.localStorage.setItem('tokenType', data.tokenType);
    }
  });
  cy.log('✅ 로그인 완료');
};

// Custom command to logout
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('accessToken');
    win.localStorage.removeItem('tokenType');
  });
  
  cy.clearCookies();
  cy.log('✅ 로그아웃 완료');
})

// Custom command to create goal request
Cypress.Commands.add('createGoalRequest', (goalData: { name: string; totalAmount: string; monthlyAmount: string; savingDay: string; expectedMonths: number }) => {
  // 홈 페이지에서 시작
  cy.visit('/home');
  cy.wait(1000);

  // 목표 적금 카드 클릭
  cy.contains('목표 적금', { timeout: 10000 }).should('be.visible').click();
  cy.wait(1000);

  // 모달이 뜨는지 확인 (승인 대기 중인 경우)
  cy.get('body').then($body => {
    const hasDialog = $body.find('[role="dialog"]').length > 0 || $body.find('[data-slot="alert-dialog-content"]').length > 0;
    
    if (hasDialog && $body.text().includes('부모 승인 대기 중')) {
      cy.log("🔔 승인 대기 중 모달 발견 - 닫기");
      
      // 모달 내부의 확인 버튼 클릭
      cy.get('[role="dialog"], [data-slot="alert-dialog-content"]')
        .should('be.visible')
        .within(() => {
          cy.contains('button', '확인').click();
        });

      cy.wait(1000);
      cy.log("모달 닫기 완료");
      
      // 모달 닫힌 후 다시 목표 적금 클릭
      cy.contains('목표 적금').click();
      cy.wait(1000);
    }
    else{
  // intro 페이지로 이동 확인
  cy.url({ timeout: 10000 }).should('include', '/goal/intro');

  cy.contains('button', '목표 생성하기')
    .should('be.visible')
    .click();

  cy.url({ timeout: 10000 }).should('include', '/goal/create');

  // 목표 작성
  cy.contains('적금 이름을 지어주세요').parent().find('input').clear().type(goalData.name);
  cy.contains('총 얼마를 모을까요?').parent().find('input').clear().type(goalData.totalAmount);
  cy.contains('한 달에 얼마를 모을까요?').parent().find('input').clear().type(goalData.monthlyAmount);
  cy.contains('언제 저금할까요?').parent().find('input').clear().type(goalData.savingDay);

  cy.contains(`${goalData.expectedMonths}달이 걸려요`).should('be.visible');

  cy.contains('button', '부모님께 허락 받기').click();

  cy.contains('부모님께 알림을 보냈어요!', { timeout: 8000 }).should('be.visible');

  // 모달 확인 버튼 클릭
  cy.get('[data-slot="alert-dialog-content"], [role="dialog"]')
    .find('button')
    .contains('확인')
    .click();
  }

  }
);
  cy.url().should('include', '/home');
  cy.log('✅ 목표 요청 완료');
})

export {}
