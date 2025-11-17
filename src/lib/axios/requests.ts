// 호출 가능한 api를 한 파일에서 관리!

const requests = {
  fetchTest: `/noticeTest`,
  fetchHome: `/home`,
  childDashboard: `/home/child`,
  parentDashboard: `/home/parent`,
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
};

export default requests;
