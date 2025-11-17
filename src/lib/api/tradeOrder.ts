// src/lib/api/tradeOrder.ts
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"
import { HttpError } from "@/types/axios/httpError.t"

/**
 * 매도/매수 주문 공통 요청
 * @param {string} stck_shrn_iscd - 종목 코드 (예: "005930")
 * @param {string} hts_kor_isnm - 종목명 (예: "삼성전자")
 * @param {string} stck_prpr - 단가
 * @param {number} quantity - 수량
 * @param {number}  - 총 가격
 * @param {"BUY" | "SELL"} type - 거래 구분
 */
export const createTradeOrder = async (
  stck_shrn_iscd: string,
  hts_kor_isnm: string,
  stck_prpr: string,
  quantity: number,
  type: "BUY" | "SELL"
) => {
  try {
    const orderData = {
      cano: "1234", // TODO: 추후 사용자 계좌번호로 대체
      user_id: 1000123, // 추후 로그인 유저 ID로 대체
      tr_id: type,
      pdno: stck_shrn_iscd,
      prdt_name: hts_kor_isnm,
      ord_qty: quantity,
      ord_unpr: stck_prpr,
      exec_id_dvsn_cd: "KRX",
      status: "REQUESTED",
    }

    const res = await api.post(requests.tradeOrder, orderData)
    console.log(`${type} 요청 결과:`, res)
    return res
  } catch (e) {
    const err = e as HttpError
    console.error(`${type} 주문 실패:`, err)
    throw err
  }
}
