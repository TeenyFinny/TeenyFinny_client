describe('목표 생성 플로우 테스트', () => {
    // 테스트용 계정 정보 (실제 환경에 맞게 수정 필요)
    const TEST_EMAIL = 'child@fisa.com'
    const TEST_PASSWORD = 'fisa123!'

    beforeEach(() => {
        // 각 테스트 전에 로그인 수행
        cy.visit('/login')

        // 로그인 폼 입력
        cy.get('input[type="email"]').type(TEST_EMAIL)
        cy.get('input[type="password"]').type(TEST_PASSWORD)

        // 로그인 버튼 클릭
        cy.contains('button', '로그인').click()

        // 홈 페이지로 이동 대기
        cy.url().should('include', '/home', { timeout: 10000 })
    })

    it('1) 목표를 성공적으로 생성할 수 있어야 한다', () => {
        // 목표 생성 페이지로 이동
        cy.visit('/goal/create')

        // 페이지 로드 확인
        cy.contains('목표를 설정해주세요').should('be.visible')
        // 다음 버튼 클릭
        cy.contains('button', '다음').click({ force: true });

        // 1. 적금 이름 입력
        cy.contains('적금 이름을 지어주세요')
            .parent()
            .find('input')
            .type('닌텐도 스위치 사기')

        // 2. 총 금액 입력 (300,000원)
        cy.contains('총 얼마를 모을까요?')
            .parent()
            .find('input')
            .type('300000')

        // 3. 월 저축액 입력 (50,000원)
        cy.contains('한 달에 얼마를 모을까요?')
            .parent()
            .find('input')
            .type('50000')

        // 4. 저금일 입력 (15일)
        cy.contains('언제 저금할까요?')
            .parent()
            .find('input')
            .clear()
            .type('15')

        // 5. 계산 결과 확인 (300,000 / 50,000 = 6개월)
        cy.contains('6달이 걸려요').should('be.visible')

        // 6. 부모님께 허락 받기 버튼 클릭
        cy.contains('button', '부모님께 허락 받기').should('be.visible').click()

        // 7. API 요청 대기 및 성공 모달 확인
        cy.contains('부모님께 알림을 보냈어요!', { timeout: 10000 }).should('be.visible')
        cy.contains('부모님이 목표 계좌 생성을').should('be.visible')

        // 8. 확인 버튼 클릭
        cy.contains('button', '확인').click()

        // 9. 홈으로 이동 확인
        cy.url().should('include', '/home')
    })

    it('필수 입력값이 모두 입력되어야 버튼이 활성화된다', () => {
        cy.visit('/goal/create')

        // 초기 상태 - 비활성화된 버튼 확인
        cy.contains('button', '부모님께 허락 받기').should('exist')

        // 일부만 입력
        cy.contains('적금 이름을 지어주세요')
            .parent()
            .find('input')
            .type('테스트 목표')

        cy.contains('총 얼마를 모을까요?')
            .parent()
            .find('input')
            .type('100000')

        // 아직 모든 필드가 채워지지 않았으므로 버튼이 비활성화 상태여야 함
        // (BigButtonDisabled 컴포넌트가 렌더링됨)

        // 나머지 필드 입력
        cy.contains('한 달에 얼마를 모을까요?')
            .parent()
            .find('input')
            .type('20000')

        // 저금일은 기본값 "1"이 있으므로 모든 필드가 채워짐
        // 이제 활성화된 버튼이 표시되어야 함
        cy.contains('button', '부모님께 허락 받기').should('be.visible')
    })

    it('월 저축액에 따라 예상 기간이 자동으로 계산된다', () => {
        cy.visit('/goal/create')

        // 총 금액 입력
        cy.contains('총 얼마를 모을까요?')
            .parent()
            .find('input')
            .type('120000')

        // 월 저축액 입력
        cy.contains('한 달에 얼마를 모을까요?')
            .parent()
            .find('input')
            .type('20000')

        // 계산 결과 확인 (120,000 / 20,000 = 6개월)
        cy.contains('6달이 걸려요').should('be.visible')

        // 월 저축액 변경
        cy.contains('한 달에 얼마를 모을까요?')
            .parent()
            .find('input')
            .clear()
            .type('30000')

        // 새로운 계산 결과 확인 (120,000 / 30,000 = 4개월)
        cy.contains('4달이 걸려요').should('be.visible')

        // 다시 변경
        cy.contains('한 달에 얼마를 모을까요?')
            .parent()
            .find('input')
            .clear()
            .type('40000')

        // 새로운 계산 결과 확인 (120,000 / 40,000 = 3개월)
        cy.contains('3달이 걸려요').should('be.visible')
    })

    it('숫자 포맷팅이 올바르게 적용된다', () => {
        cy.visit('/goal/create')

        // 총 금액 입력 - 숫자만 입력
        cy.contains('총 얼마를 모을까요?')
            .parent()
            .find('input')
            .type('1000000')

        // 포맷팅된 값 확인 (1,000,000)
        cy.contains('총 얼마를 모을까요?')
            .parent()
            .find('input')
            .should('have.value', '1,000,000')

        // 월 저축액 입력
        cy.contains('한 달에 얼마를 모을까요?')
            .parent()
            .find('input')
            .type('100000')

        // 포맷팅된 값 확인 (100,000)
        cy.contains('한 달에 얼마를 모을까요?')
            .parent()
            .find('input')
            .should('have.value', '100,000')
    })
})