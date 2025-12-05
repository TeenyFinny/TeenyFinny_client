/// <reference types="cypress" />

describe('회원가입 플로우', () => {
    const timestamp = Date.now();

    // 유효한 주민등록번호/생년월일 (2000년 1월 1일생 남자)
    const validBirthFront = '000101';
    const validBirthBack = '3';

    it('홈페이지 접속 → 회원가입 버튼 클릭 → 회원가입 완료', () => {
        // 1. 홈페이지 접속
        cy.visit('/');
        cy.wait(2000);

        // 2. 회원가입 버튼 클릭
        cy.get('body').then(($body) => {
            if ($body.find('a[href*="signup"]').length > 0) {
                cy.get('a[href*="signup"]').first().click();
            } else if ($body.text().includes('회원가입')) {
                cy.contains('회원가입').click();
            } else {
                cy.visit('/signup');
            }
        });

        // 회원가입 페이지 확인
        cy.url({ timeout: 5000 }).should('include', '/signup');
        cy.wait(1000);

        // 3. 약관 동의
        cy.get('button:has(img[alt="전체 동의"])').should('be.visible').click();
        cy.wait(1000);

        cy.contains('button', '다음').click();
        cy.wait(100);

        // 4. 역할 선택 (부모)
        cy.get('button[type="button"]').contains('부모').click();
        cy.wait(1000);
        cy.contains('button', '다음').click();
        cy.wait(1000);

        // 5. 본인인증 (VerificationForm 컴포넌트 테스트)
        // 휴대폰 번호 입력
        cy.contains('label', '휴대폰 번호')
            .closest('div')
            .find('input')
            .clear()
            .type("01012345678");

        // 주민등록번호 앞 6자리 입력
        cy.contains('label', '주민등록번호')
            .closest('div')
            .find('input')
            .first()
            .clear()
            .type(validBirthFront); // '000101'
        
        // 주민등록번호 뒤 1자리 입력
        cy.contains('label', '주민등록번호')
            .closest('div')
            .find('input')
            .eq(1)
            .clear()
            .type(validBirthBack); // '3'
            
        // 이름 입력
        cy.contains('label', '이름')
            .closest('div')
            .find('input')
            .clear()
            .type('테스트유저');
        
        // --- 5-2. 인증번호 받기 및 추출 ---
        
        // '인증번호 입력하기' 버튼 클릭
        cy.contains('button', '인증번호 입력하기').click();
        cy.wait(1000); 

        // 팝업 알림에서 OTP 번호 추출 및 입력
        cy.get('p:contains("인증번호를 입력해주세요")')
            .invoke('text')
            .then((text) => {
                // OTP 추출
                const match = text.match(/인증번호를 입력해주세요:\s*(\d{6})/);
                const extractedOtp = match ? match[1] : '123456';
                
                cy.log(`🔑 추출된 OTP: ${extractedOtp}`);
                
                // 바텀 시트 내부 OTP input 찾기
                cy.get('input[aria-label^="OTP"]')
                    .should('have.length', 6)
                    .each(($input, index) => {
                        // 각 input에 OTP 숫자 입력
                        cy.wrap($input).clear().type(extractedOtp[index]);
                    });
                
                // 바텀 시트 내 '확인' 버튼 클릭
                cy.contains('button', '확인').click({ force: true });
            });


        // 바텀 시트 닫힘 확인 (인증 성공)
        cy.get('[role="dialog"]').should('not.exist');

        // --- 5-4. 다음 단계로 이동 ---
        cy.contains('button', '다음') // "다음" 버튼은 이제 활성화됨
            .should('be.enabled')
            .click();
        cy.wait(1000);

        // 6. 사용자 정보 입력 (Step 6)
        cy.log('➡️ Step 6: 사용자 정보 입력 시작');
        
        // 이메일
        cy.contains('label', '이메일')
            .closest('div')
            .find('input')
            .clear()
            .type('test@test.com');

        // 비밀번호
        cy.contains('label', '비밀번호')
            .closest('div')
            .find('input')
            .clear()
            .type("fisa123!");

        // 비밀번호 확인
        cy.contains('label', '비밀번호 확인')
            .closest('div')
            .find('input')
            .clear()
            .type("fisa123!");

        cy.contains('button', '다음').click();
        cy.wait(1000);

        // 7. 간편 비밀번호 안내 (있으면 스킵)
        cy.get('body').then(($body) => {
            // "간편 비밀번호를 등록해 주세요" 텍스트가 있고, 이미지(img)가 있으면 안내 페이지(Step 5)
            if ($body.text().includes('간편 비밀번호를 등록해 주세요') && $body.find('img[alt="password-instruction"]').length > 0) {
                cy.log('✅ 간편 비밀번호 안내 페이지(Step 5) 감지');
                
                // 페이지 하단으로 스크롤
                cy.scrollTo('bottom');
                cy.wait(500);
                
                // 다음 버튼 클릭
                cy.contains('button', '다음').click({ force: true });
            }
        });

        // // 8. 간편 비밀번호 입력 (Step 6)
        // // Step 6 진입 확인: "간편 비밀번호 확인" 텍스트가 보여야 함 (입력 필드 라벨)
        // cy.contains('간편 비밀번호 확인', { timeout: 10000 }).should('be.visible');
        // cy.log('✅ 간편 비밀번호 입력 페이지(Step 6) 진입');

        // // 바텀시트가 열릴 때까지 대기 (키패드 버튼이 보여야 함)
        // cy.contains('button', '1', { timeout: 5000 }).should('be.visible');
        // cy.wait(1000); // 애니메이션 안정화 대기

        // // 비밀번호 입력 (123456)
        // '123456'.split('').forEach((digit) => {
        //     cy.contains('button', digit).click();
        //     cy.wait(200);
        // });

        // cy.wait(1000);

        // // 9. 간편 비밀번호 확인 입력
        // // 확인 바텀시트가 열릴 때까지 대기
        // cy.contains('button', '1', { timeout: 5000 }).should('be.visible');
        
        // '123456'.split('').forEach((digit) => {
        //     cy.contains('button', digit).click();
        //     cy.wait(200);
        // });

        // // 10. 회원가입 완료 확인
        // cy.url({ timeout: 15000 }).should('include', '/complete');
    
    });
});
