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
import { ConfirmationDialog } from "@/components/ui/modal/ConfirmationDialog";
import { AccountCardDisabled } from "../../account/AccountCardDisabled";
import { DeleteConfirmDialog } from "@/components/ui/modal/DeleteConfirmDialog";

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
  const [isCardWaitingOpen, setIsCardWaitingOpen] = useState(false);
  const [isReportWarningOpen, setIsReportWarningOpen] = useState(false); 
  const [isGoalWaitingOpen, setIsGoalWaitingOpen] = useState(false);

  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHomeData();
        console.log(data);
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
  const handleViewAllowance = () => {
    // TODO: 계좌 타입에 따라 다른 페이지로 이동
    router.push(`/account/history`);
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
        } else {
          setIsCardWaitingOpen(true);
        }
      } catch (e) {
        setIsCardWaitingOpen(true);
      }
    })();
  };

  const handleViewGoal = async () => {
    const savingBalance = user.savingBalance;
    if (savingBalance === "-1") {
      try {
        const pendingRes = await api.get(requests.fetchMyPendingGoal);
        setIsGoalWaitingOpen(true);
      } catch {
         router.push("/goal/intro");
      }
      return;
    }

    try {
      const res = await api.get(requests.fetchMyOngoingGoal);
      const goalId = res.data;
      router.push(`/goal/${goalId}`);
    } catch {
      router.push("/home");
    }
  };

  const handleViewInvest = () => {
    if(user.investmentBalance == "-1"){ // 투자 계좌가 없을 경우 퀴즈 풀기 모달
      setIsInvestDialogOpen(true);
    }
    else{ // 계좌가 있을 경우 포트폴리오로 이동
      router.push("/invest/portfolios");
    }
  };

  const handleQuizConfirm = () => {
    router.push("/quiz");
  };

  /**
   * 리포트 페이지 이동 이벤트
   */
  const handleViewReport = () => {
    // 카드가 없으면 경고 모달 표시
    if (!cardInfo?.hasCard) {
      setIsReportWarningOpen(true);
      return;
    }
    router.push(`/allowance/report`);
  };

   const hasInvest = user.investmentBalance !== "-1" && user.investmentBalance !== null;
  const hasGoal = user.savingBalance !== "-1" && user.savingBalance !== null;

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
          onViewDetails={() => handleViewAllowance()}
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


        {/* 투자 계좌 */}
        {hasInvest ? (
          <AccountCard
            accountName="투자 계좌"
            balance={user.investmentBalance ?? "0"}
            onCardClick={() => handleViewInvest()}
            onViewDetails={() => handleViewInvest()}
          />
        ) : (
          <AccountCardDisabled
            accountName="투자 계좌"
            onCardClick={() => handleViewInvest()}
          />
        )}

        {/* 목표 적금 */}
        {hasGoal ? (
          <AccountCard
            accountName="목표 적금"
            balance={user.savingBalance ?? "0"}
            onCardClick={() => handleViewGoal()}
            onViewDetails={() => handleViewGoal()}
          />
        ) : (
          <AccountCardDisabled
            accountName="목표 적금"
            onCardClick={() => handleViewGoal()}
          />
        )}

        {/* 소비 리포트 버튼 */}
        <button
          className="flex justify-start w-[335px] h-[48px] border-1 border-monochrome-gray
                     bg-neutral-7 rounded-4xl text-body-04 items-center mt-0"
          onClick={() => handleViewReport()}
        >
          <img
            src="/images/account/illust_account_report.png"
            alt="리포트 아이콘"
            className="ml-[12px] mr-[7px] w-[40px] h-[40px]"
          />
          소비 리포트 보러가기
        </button>
        {/* 카드 대기 모달 */}
        <ConfirmationDialog
          open={isCardWaitingOpen}
          onOpenChange={() => setIsCardWaitingOpen(false)}
          title="아직 카드가 없어요!"
          description="부모가 카드를 발급해줄 때까지 기다려주세요!"
          confirmText="확인"
        />

        {/* 리포트 접근 제한 모달 */}
        <ConfirmationDialog
          open={isReportWarningOpen}
          onOpenChange={() => setIsReportWarningOpen(false)}
          title="카드가 없어요!"
          description="카드를 발급해야 확인할 수 있습니다."
          confirmText="확인"
        />
        {/* 부모가 목표 통장 만들때까지 대기 모달 */}
        <ConfirmationDialog
          open={isGoalWaitingOpen}
          onOpenChange={() => setIsGoalWaitingOpen(false)}
          title="부모 승인 대기 중"
          description="부모가 목표 통장 만들때까지 기다려주세요!"
          confirmText="확인"
        />

        {/* 투자 계좌 퀴즈 유도 모달 */}
        <DeleteConfirmDialog
          open={isInvestDialogOpen}
          onOpenChange={setIsInvestDialogOpen}
          title="금융 퀴즈를 풀면 계좌를 만들 수 있어요!"
          description="퀴즈를 풀러 가볼까요?"
          ltBtnTxt="네"
          rtBtnTxt="아니요"
          onClickLtBtn={handleQuizConfirm}
          onClickRtBtn={() => setIsInvestDialogOpen(false)}
        />
      </div>
    </div>
  );
}
