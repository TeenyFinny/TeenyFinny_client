// 호출 가능한 api를 한 파일에서 관리!

const requests = {
  fetchTest: `/noticeTest`,
  fetchHome: `/home`,
  devParentHome: `/home/parent`,
  devChildHome: `/home/child`,
  login: `/auth/login`,
  signup: `/auth/signup`,
  verifySimplePassword: `/auth/simple-password/verify`,
  verifyFamilyOtp: `/auth/otp`, // OTP 검증
  fetchGoal: `/goal`,
  fetchProgress: "/quiz/progress",
  updateProgress: (user_id: number) => `/quiz/progresses/${user_id}`,
  fetchQuiz: "/quiz/info",
  stockList: `/invest/stockList`,
  investSummary: `/invest/investSummary`,
  dashMyStockList: `/invest/myStockList`,
  fetchGoalConfirm: `/goal/account/create/confirm`,
  stockDetail: `/invest/stockDetail`,

  updateGoal: `/goal/update`,
  sellStock: `/invest/sellStock`,
  tradeOrder: `/invest/tradeOrder`,
  getChild: `/account/children`,
  getTotalAccount: `/account/totalAccounts`,
  fetchNotice: `/notice`,

  // ============ 한국 투자증권 주식 리스트 API =============
  koreainvestmentStockList: `/uapi/domestic-stock/v1/quotations/intstock-multprice`,
  koreainvestmentStockDetail: `/uapi/domestic-stock/v1/quotations/inquire-price`,

  fetchAccountHistory: `/account/history`,
  fetchTransactionDetail: `/account/history/detail`,
  fetchChildCard: `/account/card`,
};

export default requests;
