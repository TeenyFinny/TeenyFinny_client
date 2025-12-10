# TeenyFinny

어린이를 위한 금융 교육 플랫폼 클라이언트 애플리케이션입니다. 부모와 자녀가 함께 사용하는 목표 저금, 투자, 용돈 관리 서비스를 제공합니다.

## 📋 목차

- [기술 스택](#기술-스택)
- [주요 기능](#주요-기능)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [환경 변수 설정](#환경-변수-설정)
- [스크립트](#스크립트)
- [테스트](#테스트)
- [프로젝트 구조 상세](#프로젝트-구조-상세)

## 🛠 기술 스택

### 프레임워크 & 라이브러리

- **Next.js 16.0.7** - React 기반 풀스택 프레임워크
- **React 19.2.0** - UI 라이브러리
- **TypeScript 5** - 타입 안전성
- **Tailwind CSS 4.1.16** - 유틸리티 기반 CSS 프레임워크
- **Zustand 5.0.8** - 상태 관리
- **Axios 1.13.2** - HTTP 클라이언트
- **Framer Motion 12.23.24** - 애니메이션 라이브러리
- **Recharts 3.5.1** - 차트 라이브러리

### UI 컴포넌트

- **Radix UI** - 접근성 있는 UI 컴포넌트 프리미티브
  - Alert Dialog
  - Dialog
  - Dropdown Menu
  - Progress
  - Switch
- **shadcn/ui** - 컴포넌트 시스템 (New York 스타일)
- **Lucide React** - 아이콘 라이브러리

### 테스트

- **Cypress 15.7.1** - E2E 테스트 프레임워크

### 기타

- **event-source-polyfill** - Server-Sent Events (SSE) 폴리필

## ✨ 주요 기능

### 1. 인증 시스템

- 이메일/비밀번호 로그인
- 카카오 OAuth 소셜 로그인
- 부모/자녀 역할별 회원가입
- 간단 비밀번호 (Simple Password) 설정
- 본인 인증 (휴대폰 번호, OTP)
- 자동 토큰 갱신 (Refresh Token)

### 2. 목표 저금 (Goal)

- 목표 설정 및 저축 계획 수립
- 부모 승인 프로세스
- 자동이체 설정
- 목표별 계좌 개설
- 목표 수정/삭제 (부모 승인 필요)
- 목표 달성 요청 및 확인

### 3. 용돈 관리 (Allowance)

- 용돈 계좌 개설
- 용돈 카드 발급
- 자동이체 설정
- 용돈 리포트 및 피드백
- 거래 내역 관리

### 4. 투자 (Investment)

- 투자 계좌 개설
- 주식 매수/매도
- 포트폴리오 관리
- 주식 상세 정보 조회
- 투자 대시보드
- 주식 크레딧 시스템

### 5. 금융 퀴즈 (Quiz)

- 금융 지식 퀴즈
- 진행 상황 추적
- 크레딧 획득
- 투자 계좌 개설 요청 연동

### 6. 계좌 관리

- 계좌 내역 조회
- 거래 내역 상세
- 자동이체 설정
- 계좌 요약 정보

### 7. 가족 관리

- 부모-자녀 연결
- OTP 검증을 통한 가족 인증
- 자녀 계정 관리

### 8. 알림 (Notification)

- Server-Sent Events (SSE) 기반 실시간 알림
- 푸시 알림 설정
- 읽음 처리

### 9. 프로필 관리

- 프로필 정보 수정
- 비밀번호 변경
- 간단 비밀번호 변경
- 약관 동의 관리

## 📁 프로젝트 구조

```
TeenyFinny_client/
├── public/                 # 정적 파일
│   ├── icons/             # 아이콘 이미지
│   ├── images/            # 일러스트 이미지
│   ├── logos/             # 로고 파일
│   └── terms/             # 약관 HTML
├── src/
│   ├── app/               # Next.js App Router 페이지
│   │   ├── (auth)/        # 인증 관련 페이지
│   │   ├── (main)/        # 메인 페이지 (헤더/푸터 포함)
│   │   ├── (main-backless)/ # 메인 페이지 (푸터 없음)
│   │   ├── (no-footer)/   # 푸터 없는 페이지
│   │   └── (no-header)/   # 헤더 없는 페이지
│   ├── components/        # React 컴포넌트
│   │   ├── custom/        # 커스텀 컴포넌트
│   │   ├── layout/        # 레이아웃 컴포넌트
│   │   └── ui/            # UI 컴포넌트 (shadcn/ui)
│   ├── hooks/             # 커스텀 훅
│   ├── lib/               # 유틸리티 및 라이브러리
│   │   ├── api/           # API 관련
│   │   ├── auth/          # 인증 관련
│   │   ├── axios/         # Axios 설정 및 요청
│   │   └── utils/         # 유틸리티 함수
│   ├── store/             # Zustand 상태 관리
│   └── types/             # TypeScript 타입 정의
├── cypress/               # Cypress E2E 테스트
│   ├── e2e/               # 테스트 파일
│   └── support/           # 테스트 지원 파일
├── next.config.ts         # Next.js 설정
├── tsconfig.json          # TypeScript 설정
├── tailwind.config.js     # Tailwind CSS 설정
└── package.json           # 프로젝트 의존성
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## ⚙️ 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# API 베이스 URL
NEXT_PUBLIC_BASE_URL=http://localhost:8080

# 카카오 OAuth (필요한 경우)
NEXT_PUBLIC_KAKAO_CLIENT_ID=your_kakao_client_id
```

## 📜 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# Cypress UI 모드 실행
npm run cypress:open

# Cypress 헤드리스 모드 실행
npm run cypress:run

# E2E 테스트 실행
npm run test:e2e

# E2E 테스트 실행 (브라우저 표시)
npm run test:e2e:headed
```

## 🧪 테스트

이 프로젝트는 Cypress를 사용한 E2E 테스트를 지원합니다.

### 테스트 실행

```bash
# 개발 서버 실행 (별도 터미널)
npm run dev

# Cypress UI 실행
npm run cypress:open

# 또는 헤드리스 모드
npm run test:e2e
```

### 테스트 파일 위치

- `cypress/e2e/` - E2E 테스트 파일
- `cypress/support/` - 테스트 지원 파일 및 커스텀 명령어

자세한 내용은 [cypress/README.md](./cypress/README.md)를 참조하세요.

## 📖 프로젝트 구조 상세

### 라우팅 구조

Next.js App Router를 사용하여 다음과 같은 라우트 그룹으로 구성되어 있습니다:

- `(auth)` - 인증 관련 페이지 (로그인, 회원가입, 랜딩)
- `(main)` - 메인 페이지 (네비게이션 바 포함)
- `(main-backless)` - 메인 페이지 (푸터 없음)
- `(no-footer)` - 푸터 없는 페이지 (목표, 용돈, 투자 계좌 개설 등)
- `(no-header)` - 헤더 없는 페이지 (퀴즈 등)

### 상태 관리

Zustand를 사용한 전역 상태 관리:

- `userStore` - 사용자 정보
- `registerStore` - 회원가입 폼 상태
- `selectedChildStore` - 선택된 자녀 정보
- `quizStore` - 퀴즈 진행 상태
- `notificationStore` - 알림 상태

### API 통신

- `src/lib/axios/axios.ts` - Axios 인스턴스 및 인터셉터 설정
- `src/lib/axios/requests.ts` - API 엔드포인트 정의
- 자동 토큰 갱신 및 에러 처리 포함

### 보안

- Content Security Policy (CSP) 설정
- X-Frame-Options, X-Content-Type-Options 등 보안 헤더
- 토큰 기반 인증 및 자동 갱신
- HTTPS 통신 강제

## 🔧 개발 가이드

### 컴포넌트 작성 규칙

- 클라이언트 컴포넌트는 `"use client"` 지시어 사용
- shadcn/ui 컴포넌트는 `src/components/ui/`에 위치
- 커스텀 컴포넌트는 `src/components/custom/`에 위치

### 스타일링

- Tailwind CSS 유틸리티 클래스 사용
- CSS 변수를 통한 테마 관리
- 반응형 디자인 적용 (모바일 우선)

### 타입 정의

- TypeScript를 통한 타입 안전성 보장
- `src/types/` 디렉토리에 타입 정의

## 👥 기여자

| <img alt="profile" src ="https://github.com/yes2489.png" width ="100px"> | <img alt="profile" src ="https://github.com/JBL28.png" width ="100px"> | <img alt="profile" src ="https://github.com/mingQ28.png" width ="100px"> | <img alt="profile" src ="https://github.com/hyojeongbae.png" width ="100px"> | <img alt="profile" src ="https://github.com/yangyanghyunjung.png" width ="100px"> | <img alt="profile" src ="https://github.com/CHICHIT.png" width ="100px"> |
| :----------------------------------------------------------------------: | :--------------------------------------------------------------------: | :----------------------------------------------------------------------: | :--------------------------------------------------------------------------: | :-------------------------------------------------------------------------------: | :----------------------------------------------------------------------: |
|                               양은서 (PM)                                |                               이정복(PL)                               |                                  박민서                                  |                                    배효정                                    |                                      양현정                                       |                                  이의섭                                  |
|                  [yes2489](https://github.com/yes2489)                   |                   [JBL28](https://github.com/JBL28)                    |                  [mingQ28](https://github.com/mingQ28)                   |                [hyojeongbae](https://github.com/hyojeongbae)                 |              [yangyanghyunjung](https://github.com/yangyanghyunjung)              |                  [CHICHIT](https://github.com/CHICHIT)                   |

---

자세한 API 문서나 추가 정보가 필요하신 경우 프로젝트 관리자에게 문의하세요.
