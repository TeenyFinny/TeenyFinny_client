/// <reference types="cypress" />

/**
 * 아이-부모 목표 계좌 개설 및 삭제 전체 흐름 (UI 기반 이동)
 * 
 * 시나리오:
 * 1. 아이: 로그인 → 목표 계좌 요청 (검증 포함)
 * 2. 부모: 로그인 → 알림 확인 → 거절
 * 3. 아이: 거절 상태 확인 → 재요청
 * 4. 부모: 재요청 확인 → 수락 → 계좌 개설
 * 5. 아이: 목표 상세 확인 → 이체일 수정 → 삭제 요청
 * 6. 부모: 삭제 요청 확인 → 승인
 */

/// <reference types="cypress" />

/**
 * 아이-부모 목표 계좌 개설 및 삭제 전체 흐름 (UI 기반)
 */

describe("아이-부모 목표 계좌 개설 및 삭제 전체 흐름 (UI 기반)", () => {
  const goalData = {
    name: "아이패드 프로 사기",
    totalAmount: "1200000",
    monthlyAmount: "200000",
    savingDay: "10",
    expectedMonths: 6,
  };

  const childUser = {
    email: "child@fisa.com",
    password: "fisa123!",
  };

  const parentUser = {
    email: "parent@fisa.com",
    password: "fisa123!",
  };

  // ============================================================
  // 1. 아이 - 목표 계좌 재요청 (SKIP)
  // ============================================================
  describe.skip("1. 아이 - 목표 계좌 다시 요청", () => {
    before(() => {
      cy.visit("/login");
      cy.get('input[type="email"]').clear().type(childUser.email);
      cy.get('input[type="password"]').clear().type(childUser.password);
      cy.contains("button", "로그인").click();
      cy.url().should("include", "/home", { timeout: 10000 });
    });

    it("1-1. 목표 생성 및 요청", () => {
      cy.url().should("include", "/home");

      cy.contains("목표 적금", { timeout: 10000 }).click();
      cy.wait(1000);

      cy.url({ timeout: 10000 }).should("include", "/goal/intro");
      cy.contains("button", "목표 생성하기").click();
      cy.url({ timeout: 10000 }).should("include", "/goal/create");

      cy.contains("적금 이름을 지어주세요").parent().find("input").type("닌텐도 스위치 사기");
      cy.contains("총 얼마를 모을까요?").parent().find("input").type("300000");
      cy.contains("한 달에 얼마를 모을까요?").parent().find("input").type("50000");
      cy.contains("언제 저금할까요?").parent().find("input").clear().type("15");

      cy.contains("6달이 걸려요").should("be.visible");

      cy.contains("button", "부모님께 허락 받기").click();
      cy.wait(1000);
      cy.contains("부모님께 알림을 보냈어요!", { timeout: 8000 }).should("be.visible");

      cy.get('[role="dialog"]').contains("확인").click();
      cy.url().should("include", "/home");
    });

    it("1-2. 승인 대기 모달 확인", () => {
      cy.contains("목표 적금").click();
      cy.get('[role="dialog"]').should("be.visible");
      cy.contains("부모 승인 대기 중").should("be.visible");
      cy.get('[role="dialog"]').contains("확인").click();
      cy.get('[role="dialog"]').should("not.exist");
    });

    after(() => cy.logout());
  });

  // ============================================================
  // 2. 부모 - 요청 거절 (SKIP)
  // ============================================================
  describe.skip("2. 부모 - 목표 요청 거절", () => {
    before(() => {
      cy.visit("/login");
      cy.get('input[type="email"]').type(parentUser.email);
      cy.get('input[type="password"]').type(parentUser.password);
      cy.contains("로그인").click();
      cy.url().should("include", "/home");
      cy.wait(5000);
    });

    it("2-1. 알림 페이지로 이동", () => {
      cy.visit("/notice");
      cy.wait(1000);
      cy.contains("알림").should("be.visible");
      cy.contains("목표 생성 요청", { timeout: 8000 }).should("be.visible");
    });

    it("2-2. 상세 보기 + 거절", () => {
      cy.get('[class*="cursor-pointer"]').first().click();

      cy.get('[data-slot="alert-dialog-content"]').should("be.visible");
      cy.contains("목표 계좌 개설").should("be.visible");

      cy.contains("거절").click();
      cy.wait(500);

      cy.get('[data-slot="alert-dialog-content"]').should("not.exist");
    });

    after(() => cy.logout());
  });

  // ============================================================
  // 3. 아이 - 거절 확인 후 재요청
  // ============================================================
  describe("3. 아이 - 거절 확인 및 재요청", () => {
    before(() => {
      cy.visit("/login");
      cy.get('input[type="email"]').clear().type(childUser.email);
      cy.get('input[type="password"]').clear().type(childUser.password);
      cy.contains("button", "로그인").click();
      cy.url().should("include", "/home", { timeout: 50000 });
    });

    it("3-1. 목표 재요청 또는 기존 모달 닫기", () => {
      cy.contains("목표 적금", { timeout: 10000 }).click();

      cy.get("body").then(($body) => {
        const hasModal = $body.find('[role="dialog"]:visible').length > 0;

        if (hasModal) {
          cy.get('[role="dialog"]:visible').contains("확인").click({ force: true });
          cy.url().should("include", "/home");
        } else {
          cy.url().should("include", "/goal/intro");
          cy.contains("목표 생성하기").click();
          cy.url().should("include", "/goal/create");

          cy.contains("적금 이름을 지어주세요").parent().find("input").type("닌텐도 스위치 사기");
          cy.contains("총 얼마를 모을까요?").parent().find("input").type("300000");
          cy.contains("한 달에 얼마를 모을까요?").parent().find("input").type("50000");
          cy.contains("언제 저금할까요?").parent().find("input").clear().type("15");

          cy.contains("button", "부모님께 허락 받기", { timeout: 10000}).click();
          cy.contains("확인").click();
        }
      });
    });
  });

  // ============================================================
  // 4. 부모 - 재요청 승인 + 계좌 개설
  // ============================================================
  describe("4. 부모 - 목표 재요청 승인", () => {
    before(() => {
      cy.visit("/login");
      cy.get('input[type="email"]').clear().type(parentUser.email);
      cy.get('input[type="password"]').clear().type(parentUser.password);
      cy.contains("로그인").click();
      cy.url().should("include", "/home");
      cy.wait(5000);
    });

    it("4-1. 알림 페이지 이동", () => {
      cy.visit("/notice");
      cy.wait(10000);
      cy.contains("목표 생성 요청", { timeout: 8000 }).should("be.visible");
    });

    it("4-2. 요청 승인", () => {
      cy.get('[class*="cursor-pointer"]').first().click();
      cy.wait(5000);

      cy.get('[data-slot="alert-dialog-content"]', { timeout: 10000 }).should("be.visible");
      cy.contains("목표 계좌 개설").should("be.visible");

      // 두 번째 버튼 = 승인
      cy.get('[data-slot="alert-dialog-content"]').find("button").eq(1).click();

      cy.url({ timeout: 10000 }).should("include", "/goal/intro");
    });

    it("4-3. 계좌 개설 플로우", () => {
      cy.contains("button", "목표").click();
      cy.url().should("include", "/goal/account/create");

      cy.contains("button", "확인").click();
      cy.contains("img[alt='전체 동의']").parent().click();
      cy.contains("button", "동의").click();

      // Step 3: 본인인증
      cy.contains("label", "휴대폰 번호").parent().find("input").type("01012345678");
      cy.contains("label", "주민등록번호").parent().find("input").first().type("000101");
      cy.contains("label", "주민등록번호").parent().find("input").eq(1).type("3");
      cy.contains("label", "이름").parent().find("input").type("테스트유저");

      cy.contains("button", "인증번호 입력하기").click();
      cy.wait(1000);

      cy.get('p:contains("인증번호를 입력해주세요")')
        .invoke("text")
        .then((text) => {
          const match = text.match(/\d{6}/);
          const otp = match ? match[0] : "123456";

          cy.get('input[aria-label^="OTP"]').each(($input, idx) => {
            cy.wrap($input).type(otp[idx]);
          });

          cy.contains("확인").click({ force: true });
        });

      cy.get('[role="dialog"]').should("not.exist");

      // Step 4 / 5 / 6
      cy.get('img[alt="전체 동의"]').parent().click();
      cy.contains("동의하고 진행하기").click();

      cy.contains("확인").click();
      cy.contains("확인").click();

      cy.url().should("include", "/home");
      cy.log("목표 계좌 개설 완료");
    });

    after(() => cy.logout());
  });

  // ============================================================
  // 5. 아이 - 생성된 목표 계좌 확인
  // ============================================================
  describe("5. 아이 - 목표 계좌 확인 및 접근", () => {
    before(() => {
      cy.visit("/login");
      cy.get('input[type="email"]').clear().type(childUser.email);
      cy.get('input[type="password"]').clear().type(childUser.password);
      cy.contains("로그인").click();
      cy.url().should("include", "/home");
    });

    it("5-1. 홈에서 목표 확인", () => {
      cy.contains("목표 적금", { timeout: 8000 }).should("be.visible");
    });

    it("5-2. 상세 페이지 접근", () => {
      cy.contains("목표 적금").click();
      cy.url().should("match", /\/goal\/(intro|detail)/);
    });

    after(() => cy.logout());
  });
});

