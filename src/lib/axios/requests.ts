// 호출 가능한 api를 한 파일에서 관리!

const requests = {
  fetchTest: `/noticeTest`,
  fetchHome: `/home/parent`, // TODO: /home/parent => 자녀 0, /home/noChild => 자녀 0, 자녀 대시보드 생성 후 /home 으로 통합 예정
  login: `/auth/login`,
  signup: `/auth/signup`,
  verifySimplePassword: `/auth/simplePassword/verify`,
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


  fetchAccountHistory: `/account/history`,
  fetchTransactionDetail: `/account/history/detail`,
  fetchChildCard: `/account/card`,

  verifyPhoneNumber: `/allowance/verify-identity`

};

export default requests;
