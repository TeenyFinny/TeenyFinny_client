import { TradeHistory } from "@/components/ui/tx-history-ui/TradeHistory";
import { TransactionHistory } from "@/components/ui/tx-history-ui/TransactionHistory";


export default function HistoryTest() {
    return (
        <main className="min-h-screen bg-[#ffffff] ">
            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <h1 className="text-head-01 text-[#000000] mb-6 pl-3">TradeHistory 컴포넌트 테스트</h1>

                    <div className="bg-[#ffffff]  border-[#e0e0e0] divide-[#e0e0e0]">
                        {/** 양수 등락률 테스트 */}
                        <div>
                            <div >
                                <TradeHistory
                                    stockName="우리금융지주"
                                    stockCode="거래량 11200020"
                                    currentPrice="62,500 원"
                                    changeRate={57}
                                />
                            </div>
                        </div>

                        {/** 음수 등락률 테스트 */}
                        <div>
                            <div>
                                <TradeHistory
                                    stockName="삼성전자"
                                    stockCode="거래량 8500000"
                                    currentPrice="71,200 원"
                                    changeRate={-3.5}
                                />
                            </div>
                        </div>

                        {/** 0% 테스트 */}
                        <div>
                            <div>
                                <TradeHistory stockName="현대차" stockCode="거래량 2100000" currentPrice="195,000 원" changeRate={0} />
                            </div>
                        </div>

                        {/** 0% 테스트 */}
                        <div>
                            <div className="w-[80%]">
                                <TradeHistory stockName="현대차" stockCode="거래량 2100000" currentPrice="195,000 원" changeRate={0} />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h1 className="text-head-01 text-[#000000] mb-6 pl-3">TransactionHistory 컴포넌트 테스트</h1>

                    <div className="bg-[#ffffff]  border-[#e0e0e0] divide-[#e0e0e0]">
                        {/** 양수 등락률 테스트 */}
                        <div>
                            <div >
                                <TransactionHistory
                                    transactionName="계좌 입금"
                                    time="2025.10.20 16:34:23"
                                    Price="62,000 원"
                                    isDeposit={true}
                                />
                            </div>
                        </div>

                        {/** 음수 등락률 테스트 */}
                        <div>
                            <div>
                                <TransactionHistory
                                    transactionName="계좌 출금"
                                    time="2025.10.20 16:34:23"
                                    Price="-62,000 원"
                                    isDeposit={false}
                                />
                            </div>
                        </div>

                        {/** 0% 테스트 */}
                        <div>
                            <div>
                                <TransactionHistory
                                    transactionName="계좌 입금"
                                    time="2025.10.20 16:34:23"
                                    Price="62,000 원"
                                    isDeposit={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
