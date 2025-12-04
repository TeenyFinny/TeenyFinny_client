describe('홈페이지 테스트', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('페이지가 정상적으로 로드되어야 함', () => {
    cy.url().should('include', 'localhost:3000')
  })

  it('페이지 제목이 존재해야 함', () => {
    cy.get('h1').should('exist')
  })
})
