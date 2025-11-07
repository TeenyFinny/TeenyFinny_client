"use client"

/**
 * TransactionHistoryProps
 * @typedef {Object} TransactionHistoryProps
 * @property {string} transactionName - 거래(항목) 이름입니다. 예: '편의점 결제', '이체-김철수'.
 * @property {string} time - 표시용 거래 시각 문자열입니다. 예: '2025.10.20 16:34:23'.
 * @property {string} Price - 표시용 금액 문자열입니다. 예: '+10,000원', '-5,200원'.
 * @property {boolean} isDeposit - 입금 여부 플래그입니다. `true`면 입금(빨강), `false`면 출금(파랑).
 */
interface TransactionHistoryProps {
  transactionName: string
  time: string
  Price: string
  isDeposit: boolean
}

/**
 * TransactionHistory
 *
 * 단일 거래 내역(입출금/결제 등)을 한 줄(Row)로 표현하는 컴포넌트입니다.
 * 왼쪽의 인디케이터 점 색상은 `isDeposit`(입금/출금)에 따라 달라집니다.
 *
 * - 좌측: 인디케이터(입금=빨강, 출금=파랑)
 * - 가운데: 거래명, 거래 시각
 * - 우측: 금액(문자열 그대로 표시)
 *
 * @component
 * @param {TransactionHistoryProps} props - 거래 내역 렌더링에 필요한 속성
 * @returns {React.ReactElement} 하나의 거래 행 요소
 *
 * @example
 * // 입금 예시
 * <TransactionHistory
 *   transactionName="이체-김철수"
 *   time="2025.10.21 09:12:05"
 *   Price="+300,000원"
 *   isDeposit={true}
 * />
 *
 * @example
 * // 출금 예시
 * <TransactionHistory
 *   transactionName="편의점 결제"
 *   time="2025.10.20 16:34:23"
 *   Price="-5,200원"
 *   isDeposit={false}
 * />
 *
 * @remarks
 * - `time`, `Price`는 **표시용 문자열**로 전달됩니다. 실제 저장/정렬은 서버나 상위 레이어에서 처리하세요.
 * - 리스트로 사용하며 부모에 `divide-y`를 적용하는 경우, 이 컴포넌트 내부의 마지막 divider(`absolute ... h-px`)가
 *   이중으로 보일 수 있으니 하나만 사용하세요.
 */
export function TransactionHistory({ transactionName, time, Price, isDeposit }: TransactionHistoryProps) {
    const changeColor = isDeposit ? "#f55053" : "#0d77cf"

  return (
    <div
      className="
        relative flex h-[76px] w-[100%] items-start gap-3
        px-5 py-4
      "
    >
      {/** 인디케이터 점 */}
      <div className="h-3 w-3 rounded-full flex-shrink-0 mt-[6px]" style={{ backgroundColor: changeColor }}/>

      {/** 거래 정보 */}
      <div className="flex-1 min-w-0">
        <h3 className="text-head-04 text-neutral-1 whitespace-pre-line">{transactionName}</h3>
        <p className="text-body-07 text-neutral-3 whitespace-pre-line mt-[5px]">{time}</p>
      </div>

      {/** 금액 정보 */}
      <div className="flex flex-col items-end gap-[3px]">
        <p className="text-head-08 text-neutral-1 whitespace-nowrap">{Price}</p>
        <p>
          
        </p>
      </div>

      {/** Divider (inset 20px, 1px, inset -0.5 shadow) */}
      <div className="absolute bottom-0 left-5 right-5 h-px bg-neutral-5" />
    </div>
  )
}
