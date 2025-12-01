"use client";

import { useEffect, useState } from "react";
import ChildAllowanceCard from "./ChildAllowanceCard";
import { AccountCard } from "@/components/custom/account/AccountCard";
import { getHomeData } from "@/lib/api/home";
import { UserDto } from "@/types/home";
import LoadingScreenSkeletonDashboard from "@/components/ui/LoadingScreenSkeletonDashboard";
import requests from "@/lib/axios/requests";
import { ApiResponse } from "@/types/axios/apiRes.t";
import api from "@/lib/axios/axios";
import { useRouter } from "next/navigation";
import { CardDetail } from "../../allowance/card/CardDetail";

type CardInfo = {
  hasCard: boolean;
  name: string;
  cardNumber: string;
  expiredAt: string;
  cvc: string;
};
/**
 * 자녀 대시보드 컴포넌트
 *
 * 사용자의 계좌 요약과 카드/상세보기 버튼, 소비 리포트 버튼을 렌더링합니다.
 * API를 호출하여 실시간 데이터를 표시합니다.
 */
export default function ChildDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [cardOpen, setCardOpen] = useState(false);
  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHomeData();
        setUser(data.user);
      } catch (error) {
        console.error("데이터를 불러오지 못했습니다.:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingScreenSkeletonDashboard />;
  }

  if (!user) {
    return <div>데이터를 불러올 수 없습니다.</div>;
  }

  /**
   * 상세 내역 보기 클릭 이벤트
   *
   * @param {string} accountType - 클릭한 계좌 타입
   */
  const handleViewDetails = (accountType: string) => {
    router.push(`/account/history?accountType=${accountType}`);
  };

  /**
   * 카드 뱃지 클릭 이벤트
   */
  const handleViewCard = () => {
    (async () => {
      try {
        const endpoint = requests.fetchChildCard(); // 자녀 본인 → /account/card
        const res = await api.get<ApiResponse<CardInfo>>(endpoint);
        const card = res.data as CardInfo;
        if (card.hasCard) {
          setCardInfo(card);
          setCardOpen(true);
        }
        // 카드가 없으면 아무 동작도 하지 않음 (void 처리)
      } catch (e) {
        console.error(e);
      }
    })();
  };
  /**
   * 리포트 페이지 이동 이벤트
   */
  const reportHandler = () => {
    router.push(`/allowance/report`);
  };

  return (
    <div className="max-h-screen px-[17px]">
      <div className="max-w-md mx-auto space-y-3">
        {/* 계좌 제목 */}
        <div className="pl-[7px] h-[21px] flex justify-between items-center">
          <p className="text-head-03 font-bold text-neutral-3 mb-[10px] mt-[20px]">
            {user.name}의 계좌
          </p>
        </div>

        {/* 총 잔액 */}
        <div className="pl-[7px] text-head-00 font-bold text-neutral-1 mb-5">
          {user.totalBalance ?? "0"} 원
        </div>

        {/* 계좌 카드: 용돈 계좌 */}
        <ChildAllowanceCard
          accountName="용돈 계좌"
          balance={user.depositBalance ?? "0"}
          showCard={true}
          onViewDetails={() => handleViewDetails("용돈 계좌")}
          onCardClick={() => handleViewCard()}
        />

        <CardDetail
          open={cardOpen}
          setOpen={setCardOpen}
          cardName={cardInfo?.name ?? ""}
          cardNumber={cardInfo?.cardNumber ?? ""}
          expiry={cardInfo?.expiredAt ?? ""}
          cvc={cardInfo?.cvc ?? ""}
        />

        {/* 계좌 카드: 투자 계좌 */}
        <AccountCard
          accountName="투자 계좌"
          balance={user.investmentBalance ?? "0"}
          onViewDetails={() => router.push("/invest")}
          onCardClick={() => null}
        />

        {/* 계좌 카드: 목표 적금 */}
        <AccountCard
          accountName="목표 적금"
          balance={user.savingBalance ?? "0"}
          onViewDetails={() => {
            const savingBalance = user.savingBalance ?? "0";
            if (savingBalance === "-1") {
              router.push("/goal/intro");
            } else {
              router.push("/goal");
            }
          }}
          onCardClick={() => null}
        />

        {/* 소비 리포트 버튼 */}
        <button
          className="flex justify-start w-[335px] h-[48px] border-1 border-monochrome-gray
                     bg-neutral-7 rounded-4xl text-body-04 items-center mt-0"
          onClick={() => reportHandler()}
        >
          <img
            src="/images/account/illust_account_report.png"
            alt="리포트 아이콘"
            className="ml-[12px] mr-[7px] w-[40px] h-[40px]"
          />
          소비 리포트 보러가기
        </button>
      </div>
    </div>
  );
}
