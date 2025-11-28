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
import { useEffect, useState, Suspense } from "react";
import { ChildDto } from "@/types/home";

type Accounts = {
  total: string | null;
  allowance: string | null;
  invest: string | null;
  saving: string | null;
  card: { hasCard: boolean };
};

type CardInfo = {
  hasCard: boolean;
  name: string;
  cardNumber: string;
  expiredAt: string;
  cvc: string;
};

function AccountContentInner() {
  const router = useRouter();
  const { children, userType, userId } = useUserStore();
  const { setHistoryData, setInvestAccountExists, setChildBaseInfo } = useSelectedChildStore();
  const searchParams = useSearchParams();

  const [data, setData] = useState<ChildDto[] | null>(children ?? null);
  const [currentChild, setCurrentChild] = useState<number>(0);

  const [accountData, setAccountData] = useState<Accounts | null>(null);
  const [total, setTotal] = useState<string | null>(null);
  const [allowance, setAllowance] = useState<string | null>(null);
  const [invest, setInvest] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const [isInvestOpen, setIsInvestOpen] = useState<boolean>(false);
  const [isSavingOpen, setIsSavingOpen] = useState<boolean>(false);

  const [cardOpen, setCardOpen] = useState(false);
  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null);

  // URL 파라미터에서 childId(userId) 가져오기
  const rawChildId = searchParams.get("childId");
  const presetChildId =
    rawChildId !== null && rawChildId !== "" ? Number(rawChildId) : null;

  const childHandler = (id: number) => setCurrentChild(id);

const autoTransHandler = () => {
  // 현재 선택된 자녀 객체 찾기
  const currentChildObj = data?.find((c) => c.userId === currentChild);
  if (!currentChildObj) return; // 안전 체크

  // store에 저장
  setChildBaseInfo(currentChildObj.userId, currentChildObj.name);
  router.push(`/account/auto-transfer`)
};

  const handleViewCard = () => {
    (async () => {
    try {
      const endpoint = requests.fetchChildCard(currentChild) // 자녀 본인 → /account/card
      const res = await api.get<ApiResponse<CardInfo>>(endpoint);
      const card = res.data as CardInfo;
      if (card.hasCard) {
        setCardInfo(card);
        setCardOpen(true);
      } else {
        router.push(`/allowance/card/create`);
      }
    } catch (e) {
      console.error(e);
    }
  })();
  };

  const handleViewDetails = (accountType: string) => {
    const child = data?.find((c) => c.userId === currentChild);
    const childName = child?.name ?? "";

    const typeMap: Record<string, string> = {
      "용돈 계좌": "allowance",
      "투자 계좌": "invest",
      "목표 적금": "saving",
    };
    const balanceMap: Record<string, string | null> = {
      "용돈 계좌": allowance,
      "투자 계좌": invest,
      "목표 적금": saving,
    };

    setHistoryData({
      selectedChildId: currentChild,
      selectedChildName: childName,
      accountName: accountType,
      accountType: typeMap[accountType],
      balance: balanceMap[accountType] ?? "0",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    });

    router.push("/account/history");
  };

  /* 자녀 조회: useUserStore에서 가져온 children으로 초기 세팅 */
  useEffect(() => {
    if (children && children.length > 0) setData(children);
  }, [children]);

// 4. 선택된 자녀의 계좌 정보 조회
/* balance 적용 */
useEffect(() => {
  if (!data) return;

  // 현재 선택된 자녀 정보
  const selectedChild = data.find(c => c.userId === currentChild);

  if (selectedChild) {
    setTotal(selectedChild.balance ?? "0"); // Home 데이터 기반
  }

  // 계좌별 잔액은 서버에서 조회 (기존 유지)
  (async () => {
    try {
      const endpoint = requests.fetchTotalAccount(currentChild);
      const res = await api.get<ApiResponse<Accounts>>(endpoint);
      const accounts = res.data as Accounts;
      
      setAccountData(accounts);
      setInvestAccountExists(accounts.invest !== null);
    } catch (e) {
      console.error(e);
    }
  })();
}, [currentChild, data]);
  /** URL childId 우선 선택 → 없으면 첫 번째 아이 fallback */
  useEffect(() => {
    if (!data || data.length === 0) return;

    const isValidPreset =
      presetChildId !== null &&
      !Number.isNaN(presetChildId) &&
      data.some((c) => c.userId === presetChildId);

    if (isValidPreset) setCurrentChild(presetChildId);
    else setCurrentChild(data[0].userId);
  }, [presetChildId, data]);

  /* balance 적용 */
  useEffect(() => {
    if (!accountData) return;
    setTotal(accountData.total);
    setAllowance(accountData.allowance);
    setInvest(accountData.invest);
    setSaving(accountData.saving);
  }, [accountData]);

  return (
    <div className="max-h-screen px-[17px]">
      <div className="max-w-md mx-auto space-y-4">
        {/* 자녀 선택 */}
        <div className="flex justify-start gap-[13px]">
          {data ? (
            data.map((child) => (
              <ChildrenBadge
                key={child.userId}
                name={child.name}
                gender={child.gender}
                childId={child.userId}
                currentChild={currentChild}
                setCurrentChild={() => childHandler(child.userId)}
              />
            ))
          ) : (
            <span className="text-body-04 text-neutral-3">아이의 데이터를 불러오고 있어요!</span>
          )}
        </div>

        {/* 총 잔액 */}
        <div className="h-[21px] flex justify-between items-center">
          <p className="text-head-03 text-neutral-3">총 잔액</p>
          {userType === "parent" && (
            <button
              className="w-[59px] h-[31px] text-body-03 bg-primary-2 rounded-2xl"
              onClick={autoTransHandler}
            >
              자동이체
            </button>
          )}
        </div>
        <div className="text-head-00 text-neutral-1 mb-4">{total} 원</div>

        {/* 계좌 카드 */}
        {allowance ? (
          <AccountCard
            accountName="용돈 계좌"
            balance={allowance}
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

        <CardDetail
          open={cardOpen}
          setOpen={setCardOpen}
          cardName={cardInfo?.name ?? ""}
          cardNumber={cardInfo?.cardNumber ?? ""}
          expiry={cardInfo?.expiredAt ?? ""}
          cvc={cardInfo?.cvc ?? ""}
        />

        {invest ? (
          <AccountCard
            accountName="투자 계좌"
            balance={invest}
            onViewDetails={() => handleViewDetails("투자 계좌")}
            onCardClick={() => null}
          />
        ) : (
          <AccountCardDisabled accountName="투자 계좌" onCardClick={() => setIsInvestOpen(true)} />
        )}

        {saving ? (
          <AccountCard
            accountName="목표 적금"
            balance={saving}
            onViewDetails={() => handleViewDetails("목표 적금")}
            onCardClick={() => null}
          />
        ) : (
          <AccountCardDisabled accountName="목표 계좌" onCardClick={() => setIsSavingOpen(true)} />
        )}

        <button 
        onClick={() => router.push(`/allowance/report`)}
        className="flex justify-start w-[335px] h-[48px] border border-monochrome-gray bg-neutral-7 rounded-4xl text-body-04 items-center mt-0">
          <img
            src="/images/account/illust_account_report.png"
            alt="리포트 아이콘"
            className="ml-[12px] mr-[7px] w-[40px] h-[40px]"
          />
          소비 리포트 보러가기
        </button>
      </div>

      {/* 모달 */}
      <ConfirmationDialog
        open={isInvestOpen}
        onOpenChange={() => setIsInvestOpen(false)}
        title="아직 투자 계좌가 없어요!"
        description={`아이가 계좌 개설을 요청할 때까지 기다려주세요!`}
        confirmText="확인"
      />
      <ConfirmationDialog
        open={isSavingOpen}
        onOpenChange={() => setIsSavingOpen(false)}
        title="아직 목표 적금 계좌가 없어요!"
        description={`아이가 계좌 개설을 요청할 때까지 기다려주세요!`}
        confirmText="확인"
      />
    </div>
  );
}

export default function AccountContent() {
  return (
    <Suspense
      fallback={
        <div className="max-h-screen px-[17px] flex justify-center items-center">
          <span className="text-body-04 text-neutral-3">로딩중...</span>
        </div>
      }
    >
      <AccountContentInner />
    </Suspense>
  );
}
function setChildBaseInfo(currentChild: number, currentChildName: any) {
  throw new Error("Function not implemented.");
}

