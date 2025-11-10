"use client"
import { InvestStatus } from "@/components/ui/invest/InvestStatus";
import { StockList } from "@/components/ui/invest/StockList";

// app/saving/page.tsx
export default function Page() {
  const stocks = [
    {
      id: "1",
      name: "우리금융지주",
      code: "11200020",
      price: 62500,
      changePercent: 57,
    },
    {
      id: "2",
      name: "삼성전자",
      code: "11200020",
      price: 62500,
      changePercent: 57,
    },
    {
      id: "3",
      name: "SK 하이닉스",
      code: "11200020",
      price: 62500,
      changePercent: 57,
    },
    {
      id: "4",
      name: "엔비디아",
      code: "11200020",
      price: 62500,
      changePercent: 57,
    },
  ]

  const handleSell = (stockId: string) => {
    console.log("Selling stock:", stockId)
  }

  return (
    <main className="min-h-screen flex  bg-monochrome-lightgray">
      <div className="flex flex-col gap-12 items-center pt-6">
        <InvestStatus
            userName="민트"
            currentAmount={20000}
            changeAmount={23000}
            changePercent={2.03}
            availableAmount={30000}
            />
        
        <StockList stocks={stocks} onSell={handleSell} btnLab="사기"/>
      </div>
    </main>
  )
}