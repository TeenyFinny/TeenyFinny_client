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
  investMyAccount: `/investments/account`,
  investDashboard: `/investments/dashboard`,
  investAccount: `/investments/account/check-account`,

  updateGoal: `/goal/update`,
  sellStock: `/investments/sellStock`,
  tradeBuy: `/investments/trade/buy`,
  tradeSell: `/investments/trade/sell`,
  fetchChild: `/account/children`,
  portfolio: `/investments/my-stocks/portfolio`,

  fetchNotice: `/notice`,

  stocks: `/investments/stocks`,
  stockDetail: (code: string) => `/investments/stocks/${code}`,

  fetchReport: (childId: number) => childId ? `/allowance/${childId}/report` : `/allowance/report`,
  fetchMyHistory: "/account/history",
  fetchChildHistory: (childId: number) => `/account/${childId}/history`,
  fetchTransactionDetail: (transactionId: string) => `/account/history/${transactionId}`,
  fetchChildCard: (childId?: number) => childId ? `/account/${childId}/card` : `/account/card`,
  fetchTotalAccount: (childId?: number) => childId ? `/account/${childId}/summary` : `/account/summary`,
  fetchAutoTransfer: (childId?: number) => `/account/${childId}/auto-transfer`,
  fetchAutoTransferById: (childId: number, autoTransferId: number) =>  `/account/${childId}/auto-transfer/${autoTransferId}`,

  verifyPhoneNumber: `/auth/identity`,
  submitChildInfo: `/allowance/accounts`,
  submitCardInfo: `/allowance/cards`,

  fetchProfile: `/profile`,

  // Kakao OAuth
  kakaoLogin: `/auth/oauth/kakao/login`,
  kakaoSignup: `/auth/oauth/kakao/signup`,
};

export default requests;
