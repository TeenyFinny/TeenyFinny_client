# Cypress 테스트 가이드

이 프로젝트는 Cypress를 사용하여 E2E(End-to-End) 테스트를 수행합니다.

## 📋 목차

- [설치](#설치)
- [테스트 실행](#테스트-실행)
- [테스트 작성](#테스트-작성)
- [커스텀 명령어](#커스텀-명령어)
- [디렉토리 구조](#디렉토리-구조)

## 🚀 설치

Cypress는 이미 프로젝트에 설치되어 있습니다. 만약 새로 설치가 필요한 경우:

```bash
npm install --save-dev cypress
```

## 🧪 테스트 실행

### 1. Cypress UI 모드로 실행 (권장)

개발 중에는 Cypress UI를 사용하는 것이 편리합니다:

```bash
npm run cypress:open
```

이 명령어를 실행하면 Cypress 테스트 러너가 열리고, 테스트를 선택하여 실행할 수 있습니다.

### 2. 헤드리스 모드로 실행

CI/CD 환경이나 빠른 테스트 실행이 필요한 경우:

```bash
# 모든 테스트 실행
npm run cypress:run

# E2E 테스트만 실행
npm run test:e2e

# 브라우저를 표시하면서 실행
npm run test:e2e:headed
```

### 3. 개발 서버와 함께 실행

테스트를 실행하기 전에 개발 서버가 실행 중이어야 합니다:

```bash
# 터미널 1: 개발 서버 실행
npm run dev

# 터미널 2: Cypress 실행
npm run cypress:open
```

## ✍️ 테스트 작성

### 기본 테스트 구조

```typescript
describe('테스트 스위트 이름', () => {
  beforeEach(() => {
    // 각 테스트 전에 실행
    cy.visit('/')
  })

  it('테스트 케이스 설명', () => {
    // 테스트 코드
    cy.get('button').click()
    cy.url().should('include', '/expected-path')
  })
})
```

### 테스트 파일 위치

E2E 테스트는 `cypress/e2e/` 디렉토리에 작성합니다:

```
cypress/
  └── e2e/
      ├── home.cy.ts
      ├── invest.cy.ts
      └── child-dashboard.cy.ts
```

### 예제: 로그인 테스트

```typescript
describe('로그인 테스트', () => {
  it('올바른 자격증명으로 로그인할 수 있어야 함', () => {
    cy.visit('/login')
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    cy.url().should('not.include', '/login')
    cy.contains('환영합니다').should('be.visible')
  })
})
```

## 🛠️ 커스텀 명령어

프로젝트에는 다음과 같은 커스텀 Cypress 명령어가 정의되어 있습니다:

### `cy.login(username, password)`

사용자 로그인을 수행합니다:

```typescript
cy.login('testuser', 'password123')
```

### `cy.getByTestId(testId)`

`data-testid` 속성으로 요소를 선택합니다:

```typescript
cy.getByTestId('submit-button').click()
```

**컴포넌트에 data-testid 추가 예제:**

```tsx
<button data-testid="submit-button">제출</button>
```

## 📁 디렉토리 구조

```
cypress/
├── e2e/                    # E2E 테스트 파일
│   ├── home.cy.ts
│   ├── invest.cy.ts
│   └── child-dashboard.cy.ts
├── support/                # 지원 파일
│   ├── commands.ts         # 커스텀 명령어
│   ├── e2e.ts             # E2E 설정
│   └── component.ts        # 컴포넌트 테스트 설정 (현재 비활성화)
├── videos/                 # 테스트 실행 비디오 (자동 생성)
├── screenshots/            # 실패한 테스트 스크린샷 (자동 생성)
└── downloads/              # 테스트 중 다운로드된 파일

cypress.config.ts           # Cypress 설정 파일
```

## 🎯 베스트 프랙티스

### 1. data-testid 사용

CSS 클래스나 ID 대신 `data-testid`를 사용하세요:

```tsx
// ✅ 좋은 예
<button data-testid="login-button">로그인</button>

// ❌ 나쁜 예
<button className="btn-primary">로그인</button>
```

### 2. 명확한 테스트 설명

테스트 설명은 무엇을 테스트하는지 명확하게 작성하세요:

```typescript
// ✅ 좋은 예
it('투자 계좌가 없을 때 계좌 생성 모달이 표시되어야 함', () => {})

// ❌ 나쁜 예
it('테스트 1', () => {})
```

### 3. beforeEach 활용

반복되는 설정은 `beforeEach`에 작성하세요:

```typescript
describe('대시보드 테스트', () => {
  beforeEach(() => {
    cy.login('testuser', 'password')
    cy.visit('/dashboard')
  })

  it('테스트 1', () => {})
  it('테스트 2', () => {})
})
```

### 4. 적절한 대기

명시적 대기 대신 Cypress의 자동 재시도를 활용하세요:

```typescript
// ✅ 좋은 예
cy.get('[data-testid="loading"]').should('not.exist')
cy.get('[data-testid="content"]').should('be.visible')

// ❌ 나쁜 예
cy.wait(5000)
```

## 🔧 설정

### cypress.config.ts

주요 설정 옵션:

- `baseUrl`: 기본 URL (http://localhost:3000)
- `viewportWidth`: 뷰포트 너비 (1280px)
- `viewportHeight`: 뷰포트 높이 (720px)
- `specPattern`: 테스트 파일 패턴

## 📚 추가 리소스

- [Cypress 공식 문서](https://docs.cypress.io)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress TypeScript 가이드](https://docs.cypress.io/guides/tooling/typescript-support)

## ⚠️ 주의사항

### 컴포넌트 테스트

현재 React 19 호환성 문제로 인해 컴포넌트 테스트는 비활성화되어 있습니다. `@cypress/react19`가 출시되면 활성화할 수 있습니다.

### 환경 변수

테스트에서 환경 변수가 필요한 경우 `cypress.config.ts`에서 설정하거나 `cypress.env.json` 파일을 생성하세요.

## 🐛 문제 해결

### 테스트가 실행되지 않는 경우

1. 개발 서버가 실행 중인지 확인하세요 (`npm run dev`)
2. `baseUrl`이 올바른지 확인하세요
3. Cypress 캐시를 삭제하고 재설치하세요:
   ```bash
   npx cypress cache clear
   npm install --save-dev cypress
   ```

### 타임아웃 에러

`cypress.config.ts`에서 타임아웃 설정을 조정하세요:

```typescript
export default defineConfig({
  e2e: {
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
  },
})
```
