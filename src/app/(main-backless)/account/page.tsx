"use client";
import { AccountCard } from "@/components/custom/account/AccountCard";
import { AccountCardDisabled } from "@/components/custom/account/AccountCardDisabled";
import { CardDetail } from "@/components/custom/allowance/card/CardDetail";
import { ChildrenBadge } from "@/components/ui/badge/ChildrenBadge";
import { ConfirmationDialog } from "@/components/ui/modal/ConfirmationDialog";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useSelectedChildStore } from "@/store/selectedChildStore";
import { useUserStore } from "@/store/userStore";
import { ApiResponse } from "@/types/axios/apiRes.t";
import { HttpError } from "@/types/axios/httpError.t";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Child = {
  name: string;
  childId: number;
  gender: number;
};

type Accounts = {
  total: number | null;
  allowance: number | null;
  invest: number | null;
  saving: number | null;
  card: { hasCard: boolean };
};

type CardInfo = {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Store
  const { userType, userId } = useUserStore();
  const { setChildBaseInfo, setHistoryData } = useSelectedChildStore();

  // State
  const [data, setData] = useState<Child[] | null>(null);
  const [currentChild, setCurrentChild] = useState<number>(0);
  const [accountData, setAccountData] = useState<Accounts | null>(null);
  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [isInvestOpen, setIsInvestOpen] = useState(false);
  const [isSavingOpen, setIsSavingOpen] = useState(false);

  // URL에서 childId 파싱, 쿼리가 있을 때만 number로 변환
  const presetChildId = searchParams.get("childId") 
    ? Number(searchParams.get("childId")) 
    : null;

  /* ===== 이벤트 핸들러 ===== */
  
  const handleChildSelect = (id: number) => {
    setCurrentChild(id);
  };

  const handleViewDetails = (accountType: string) => {
    const typeMap: Record<string, string> = {
      "용돈 계좌": "allowance",
      "투자 계좌": "invest",
      "목표 적금": "saving",
    };

    const balanceMap: Record<string, number | null> = {
      "용돈 계좌": accountData?.allowance ?? null,
      "투자 계좌": accountData?.invest ?? null,
      "목표 적금": accountData?.saving ?? null,
    };

    const now = new Date();

    setHistoryData({
      accountName: accountType,
      accountType: typeMap[accountType],
      balance: balanceMap[accountType] ?? 0,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    });

    router.push("/account/history");
  };

  const handleViewCard = async () => {
    if (!accountData) return;

    if (!accountData.card.hasCard) {
      router.push(`/allowance/card/create`);
      return;
    }

    try {
      const res = await api.get<ApiResponse<CardInfo>>(
        requests.fetchChildCard,
        { params: { childId: currentChild } }
      );
      setCardInfo(res.data as CardInfo);
      setCardOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  /* ===== Effects ===== */

  // 1. 자녀 목록 조회
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await api.get<ApiResponse<Child[]>>(requests.fetchChild, {
          signal: controller.signal,
          params: { id: userId },
        });

        if (!controller.signal.aborted) {
          setData(res.data as Child[]);
        }
      } catch (e) {
        if (e instanceof HttpError && e.statusCode === 403) {
          router.push("/");
        }
      }
    })();

    return () => controller.abort();
  }, [userId, router]);

  // 2. 초기 자녀 선택 (URL 파라미터 우선 → 첫 번째 자녀)
  useEffect(() => {
    if (!data || data.length === 0) return;

    const isValidPreset =
      presetChildId !== null &&
      !Number.isNaN(presetChildId) &&
      data.some((child) => child.childId === presetChildId);

    if (isValidPreset) {
      setCurrentChild(presetChildId);
    } else {
      setCurrentChild(data[0].childId);
    }
  }, [data, presetChildId]);

  // 3. currentChild 변경 시 store에 자녀 정보 저장
  useEffect(() => {
    if (!data || !currentChild) return;

    const selectedChild = data.find((child) => child.childId === currentChild);

    if (selectedChild) {
      setChildBaseInfo(selectedChild.childId, selectedChild.name);
    }
  }, [currentChild, data, setChildBaseInfo]);

  // 4. 선택된 자녀의 계좌 정보 조회
  useEffect(() => {
    if (!currentChild) return;

    (async () => {
      try {
        const res = await api.get<ApiResponse<Accounts>>(
          requests.fetchTotalAccount,
          { params: { id: currentChild } }
        );
        setAccountData(res.data as Accounts);
      } catch (e) {
        if (e instanceof HttpError && e.statusCode === 403) {
          router.push("/");
        }
      }
    })();
  }, [currentChild, router]);

  /* ===== 렌더링 ===== */

  return (
    <div className="max-h-screen px-[17px]">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* 자녀 선택 */}
        <div className="flex justify-start">
          <div className="flex justify-evenly gap-[13px]">
            {data ? (
              data.map((child) => (
                <ChildrenBadge
                  key={child.childId}
                  name={child.name}
                  gender={child.gender}
                  childId={child.childId}
                  currentChild={currentChild}
                  setCurrentChild={() => handleChildSelect(child.childId)}
                />
              ))
            ) : (
              <span className="text-body-04 text-neutral-3">
                아이의 데이터를 불러오고 있어요!
              </span>
            )}
          </div>
        </div>

        {/* 총 잔액 헤더 */}
        <div className="h-[21px] flex justify-between items-center">
          <p className="text-head-03 text-neutral-3">총 잔액</p>
          {userType === "parent" && (
            <button
              className="w-[59px] h-[31px] text-body-03 bg-primary-2 rounded-2xl"
              onClick={() => router.push(`/account/auto-transfer/${currentChild}`)}
            >
              자동이체
            </button>
          )}
        </div>

        <div className="text-head-00 text-neutral-1 mb-4">
          {accountData?.total ?? 0} 원
        </div>

        {/* 용돈 계좌 */}
        {accountData?.allowance != null ? (
          <AccountCard
            accountName="용돈 계좌"
            balance={accountData.allowance}
            showCard
            onViewDetails={() => handleViewDetails("용돈 계좌")}
            onCardClick={handleViewCard}
          />
        ) : (
          <AccountCardDisabled
            accountName="용돈 계좌"
            onCardClick={() => router.push(`/allowance/account/create`)}
          />
        )}

        {/* 투자 계좌 */}
        {accountData?.invest != null ? (
          <AccountCard
            accountName="투자 계좌"
            balance={accountData.invest}
            onViewDetails={() => handleViewDetails("투자 계좌")}
            onCardClick={() => null}
          />
        ) : (
          <AccountCardDisabled
            accountName="투자 계좌"
            onCardClick={() => setIsInvestOpen(true)}
          />
        )}

        {/* 목표 적금 */}
        {accountData?.saving != null ? (
          <AccountCard
            accountName="목표 적금"
            balance={accountData.saving}
            onViewDetails={() => handleViewDetails("목표 적금")}
            onCardClick={() => null}
          />
        ) : (
          <AccountCardDisabled
            accountName="목표 계좌"
            onCardClick={() => setIsSavingOpen(true)}
          />
        )}

        {/* 소비 리포트 버튼 */}
        <button
          onClick={() => router.push(`/allowance/report`)}
          className="flex justify-start w-[335px] h-[48px] border border-monochrome-gray bg-neutral-7 rounded-4xl text-body-04 items-center mt-0"
        >
          <img
            src="/images/account/illust_account_report.png"
            alt="리포트 아이콘"
            className="ml-[12px] mr-[7px] w-[40px] h-[40px]"
          />
          소비 리포트 보러가기
        </button>
      </div>

      {/* 카드 상세 모달 */}
      <CardDetail
        open={cardOpen}
        setOpen={setCardOpen}
        cardName={cardInfo?.cardName ?? ""}
        cardNumber={cardInfo?.cardNumber ?? ""}
        expiry={cardInfo?.expiry ?? ""}
        cvc={cardInfo?.cvc ?? ""}
      />

      {/* 안내 모달 */}
      <ConfirmationDialog
        open={isInvestOpen}
        onOpenChange={() => setIsInvestOpen(false)}
        title="아직 투자 계좌가 없어요!"
        description="아이가 계좌 개설을 요청할 때까지 기다려주세요!"
        confirmText="확인"
      />

      <ConfirmationDialog
        open={isSavingOpen}
        onOpenChange={() => setIsSavingOpen(false)}
        title="아직 목표 적금 계좌가 없어요!"
        description="아이가 계좌 개설을 요청할 때까지 기다려주세요!"
        confirmText="확인"
      />
    </div>
  );
}