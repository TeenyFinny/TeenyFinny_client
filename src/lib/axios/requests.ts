// 호출 가능한 api를 한 파일에서 관리!

const requests = {
  // 공통
  fetchTest: `/noticeTest`,
  fetchHome: `/home`,

  // Auth
  login: `/auth/login`,
  signup: `/auth/signup`,
  passwordRequest: `/auth/password`,
  authEmail: `/auth/email`,
  refresh: `/auth/refresh`,
  simplePassword: `/auth/simple-password`,
  verifyPhoneNumber: `/auth/identity`,
  verifyFamilyOtp: `/auth/otp`, // OTP 검증

  // ID/PW 찾기
  findEmail: `/auth/find-email`,
  resetPassword: `/auth/reset-password`,

  // Kakao OAuth
  kakaoLogin: `/auth/oauth/kakao/login`,
  kakaoSignup: `/auth/oauth/kakao/signup`,

  // Profile
  fetchProfileInfo: `/profile/info`,
  updateProfileInfo: `/profile/info`,
  fetchPushSettings: `/profile/push`,
  updatePush: `/profile/push`,
  fetchProfile: `/profile`,

  // Goal 관련 (feat/goal-be-connect + dev 통합)
  fetchGoal: (goalId?: number | string) =>
    goalId ? `/goal/${goalId}` : `/goal`,
  createGoal: `/goal`,
  fetchGoalForUpdate: (goalId: number | string) => `/goal/${goalId}/edit`,
  updateGoal: (goalId: number | string) => `/goal/${goalId}`,
  requestCancel: (goalId: number | string) => `/goal/${goalId}/request-cancel`,
  requestComplete: (goalId: number | string) =>
    `/goal/${goalId}/request-complete`,
  confirmCancel: (goalId: number | string) => `/goal/${goalId}/confirm-cancel`,
  confirmComplete: (goalId: number | string) =>
    `/goal/${goalId}/confirm-complete`,
  approveGoal: (goalId: number | string) => `/goal/${goalId}/approve`,
  fetchChildGoal: (childId: number | string) =>
    `/goal/child/${childId}/ongoing`,
  fetchChildPendingGoal: (childId: number | string) =>
    `/goal/child/${childId}/pending`,
  fetchGoalConfirm: (goalId: number | string) => `/goal/account/create?goalId=${goalId}`,
  fetchMyOngoingGoal: `/goal/ongoing`,

  // Quiz
  fetchProgress: "/quiz/progresses",
  fetchQuiz: "/quiz/info",
  fetchChildQuiz: (childId: number) => `/quiz/${childId}/progresses`,

  // Investments
  investmentsSummary: `/investments/summary`,
  investMyAccount: `/investments/account`,
  investDashboard: `/investments/dashboard`,
  investAccount: `/investments/account/check-account`,
  portfolioDates: "/investments/portfolio/dates",

  updateGoal: `/goal/update`,
  sellStock: `/investments/sellStock`,
  tradeBuy: `/investments/trade/buy`,
  tradeSell: `/investments/trade/sell`,
  fetchChild: `/account/children`,
  portfolio: `/investments/portfolio`,

  fetchNotice: `/notice`,

  stocks: `/investments/stocks`,
  stocksBuy: `/investments/stocks/buy`,
  stocksSell: `/investments/stocks/sell`,
  stockDetail: (code: string) => `/investments/stocks/detail/${code}`,

  // Children / Account
  fetchChild: `/account/children`,
  fetchMyHistory: "/account/history",
  fetchChildHistory: (childId: number) => `/account/${childId}/history`,
  fetchTransactionDetail: (transactionId: string) =>
    `/account/history/${transactionId}`,
  fetchChildCard: (childId?: number) =>
    childId ? `/account/${childId}/card` : `/account/card`,
  fetchTotalAccount: (childId: number) => `/account/${childId}/summary`,
  fetchAutoTransferById: (childId: number) =>
    `/account/${childId}/auto-transfer`,

  // Allowance
  submitChildInfo: `/allowance/accounts`,
  submitCardInfo: `/allowance/cards`,
  fetchReport: (childId?: number) =>
    childId ? `/allowance/${childId}/report` : `/allowance/report`,

  // Notice
  fetchNotice: `/notice`,
  fetchNotices: `/notices`,
  markAsRead: (id: number | string) => `/notices/${id}/read`,
};

export default requests;
