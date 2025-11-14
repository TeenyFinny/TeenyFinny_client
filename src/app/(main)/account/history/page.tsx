"use client"

import AccountTransactionHistory from "./AccountTransactionHistory"

export default function Page() {
  // Sample transaction data
  const transactionsByMonth = {
    "2025-09": [
      {
        id: "1",
        type: "withdrawal" as const,
        merchant: "CU",
        amount: 1500,
        balanceAfter: 98500,
        timestamp: "2025.09.28. 14:22:10",
      },
    ],
    "2025-10": [
      {
        id: "2",
        type: "withdrawal" as const,
        merchant: "CU",
        amount: 2400,
        balanceAfter: 10600,
        timestamp: "2025.10.29. 16:43:28",
      },
      {
        id: "33",
        type: "withdrawal" as const,
        merchant: "CU",
        amount: 2400,
        balanceAfter: 10600,
        timestamp: "2025.10.29. 16:43:28",
      },
      {
        id: "23",
        type: "withdrawal" as const,
        merchant: "CU",
        amount: 2400,
        balanceAfter: 10600,
        timestamp: "2025.10.29. 16:43:28",
      },
      {
        id: "27",
        type: "withdrawal" as const,
        merchant: "CU",
        amount: 2400,
        balanceAfter: 10600,
        timestamp: "2025.10.29. 16:43:28",
      },
      {
        id: "29",
        type: "withdrawal" as const,
        merchant: "CU",
        amount: 2400,
        balanceAfter: 10600,
        timestamp: "2025.10.29. 16:43:28",
      },
      {
        id: "57",
        type: "withdrawal" as const,
        merchant: "CU",
        amount: 2400,
        balanceAfter: 10600,
        timestamp: "2025.10.29. 16:43:28",
      },
      {
        id: "98",
        type: "withdrawal" as const,
        merchant: "GS25",
        amount: 3800,
        balanceAfter: 6800,
        timestamp: "2025.10.29. 18:13:54",
      },
      {
        id: "4",
        type: "deposit" as const,
        merchant: "용돈",
        amount: 10000,
        balanceAfter: 16800,
        timestamp: "2025.10.30. 09:00:00",
      },
      {
        id: "5",
        type: "withdrawal" as const,
        merchant: "스타벅스",
        amount: 5600,
        balanceAfter: 11200,
        timestamp: "2025.10.30. 12:42:33",
      },
    ],
    "2025-11": [
      {
        id: "6",
        type: "deposit" as const,
        merchant: "용돈",
        amount: 50000,
        balanceAfter: 61200,
        timestamp: "2025.11.01. 09:00:00",
      },
      {
        id: "7",
        type: "withdrawal" as const,
        merchant: "맥도날드",
        amount: 8700,
        balanceAfter: 52500,
        timestamp: "2025.11.02. 13:20:41",
      },
    ],
  }

  return (
    <AccountTransactionHistory
      accountType="용돈"
      childName="김티니"
      currentBalance={52500}
      transactionsByMonth={transactionsByMonth}
      initialMonth="2025-11"
      onBackClick={() => console.log("뒤로가기 클릭됨")}
      onNotificationClick={() => console.log("알림 클릭됨")}
    />
  )
}
