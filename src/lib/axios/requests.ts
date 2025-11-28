// 호출 가능한 api를 한 파일에서 관리!

import { p } from "framer-motion/client";

const requests = {
  fetchTest: `/noticeTest`,
  fetchHome: `/home`,
  login: `/auth/login`,
  signup: `/auth/signup`,
  fetchProfileInfo: `/profile/info`,
  passwordRequest: `/auth/password`,
  authEmail: `/auth/email`,
  refresh: `/auth/refresh`,
  updatePush: `/auth/push`,
  simplePassword: `/auth/simple-password`,
  verifyFamilyOtp: `/auth/otp`, // OTP 검증
  fetchGoal: `/goal`,
  fetchProgress: "/quiz/progresses",
  fetchQuiz: "/quiz/info",
  investmentsSummary: `/investments/summary`,
  fetchGoalConfirm: `/goal/account/create`,
  myStocks: `/investments/my-stocks`,
  myStocksTop3: `/investments/my-stocks/top3`,
  stockDetail: `/investments/stockDetail`,
  investAccount: `/investments/check-account`,

  updateGoal: `/goal/update`,
  sellStock: `/investments/sellStock`,
  tradeOrder: `/investments/tradeOrder`,
  fetchChild: `/account/children`,
  fetchTotalAccount: `/account/total-accounts`,
  fetchAutoTransfer: `/account/auto-transfers`,
  portfolio: `/investments/my-stocks/portfolio`,

  fetchNotice: `/notice`,

  koreainvestmentStockList: `/uapi/domestic-stock/v1/quotations/intstock-multprice`,
  koreainvestmentStockDetail: `/uapi/domestic-stock/v1/quotations/inquire-price`,

  fetchAccountHistory: `/account/history`,
  fetchTransactionDetail: `/account/history/detail`,
  fetchChildCard: `/account/card`,

  verifyPhoneNumber: `/auth/identity`,
  submitChildInfo: `/allowance/accounts`,
  submitCardInfo: `/allowance/cards`,

  fetchProfile: `/profile`,

  fetchReport: `allowance/report`,

  // Kakao OAuth
  kakaoLogin: `/auth/oauth/kakao/login`,
  kakaoSignup: `/auth/oauth/kakao/signup`,
};

export default requests;
