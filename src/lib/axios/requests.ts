// 호출 가능한 api를 한 파일에서 관리!

import { p } from "framer-motion/client";

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
  fetchProgress: "/quiz/progresses",
  updateProgress: (user_id: number) => `/quiz/progresses/${user_id}`,
  fetchQuiz: "/quiz/info",
  stockList: `/investments/stockList`,
  investmentsSummary: `/investmentsments/summary`,
  dashMyStockList: `/investments/my-stock`,
  fetchGoalConfirm: `/goal/account/create/confirm`,
  stockDetail: `/investments/stockDetail`,

  updateGoal: `/goal/update`,
  sellStock: `/investments/sellStock`,
  tradeOrder: `/investments/tradeOrder`,
  fetchChild: `/account/children`,
  fetchTotalAccount: `/account/total-accounts`,
  fetchAutoTransfer: `/account/auto-transfers`,
  portfolio: `/invest/portfolio`,
  fetchNotice: `/notice`,

  koreainvestmentStockList: `/uapi/domestic-stock/v1/quotations/intstock-multprice`,
  koreainvestmentStockDetail: `/uapi/domestic-stock/v1/quotations/inquire-price`,

  fetchAccountHistory: `/account/history`,
  fetchTransactionDetail: `/account/history/detail`,
  fetchChildCard: `/account/card`,

  verifyPhoneNumber: `/allowance/verify-identity`,

  fetchProfile: `/profile`


};

export default requests;
