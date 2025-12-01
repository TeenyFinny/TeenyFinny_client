"use client";

import { AccountCard } from "@/components/custom/account/AccountCard";
import { AccountCardDisabled } from "@/components/custom/account/AccountCardDisabled";
import { CardDetail } from "@/components/custom/allowance/card/CardDetail";
import { ChildrenBadge } from "@/components/ui/badge/ChildrenBadge";
import { ConfirmationDialog } from "@/components/ui/modal/ConfirmationDialog";
import { DeleteConfirmDialog } from "@/components/ui/modal/DeleteConfirmDialog";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useSelectedChildStore } from "@/store/selectedChildStore";
import { useUserStore } from "@/store/userStore";
import { ApiResponse } from "@/types/axios/apiRes.t";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useCallback } from "react";
import { ChildDto } from "@/types/home";
import { AccountCard2 } from "@/components/custom/account/AccountCard2";

type Accounts = {
  total: string | null;
  allowance: string | null;
  invest: string | null;
  goal: string | null;
  card: { hasCard: boolean } | null;
};

type CardInfo = {
  hasCard: boolean;
  name: string;
  cardNumber: string;
  expiredAt: string;
  cvc: string;
};

// 계좌 타입 상수
const ACCOUNT_TYPES = {
  ALLOWANCE: "용돈 계좌",
  INVEST: "투자 계좌",
  GOAL: "목표 적금",
} as const;

function AccountContentInner() {
  const router = useRouter();
  const { children, userType } = useUserStore();
  const { setHistoryData, setInvestAccountExists, setChildBaseInfo, selectedChildId } = useSelectedChildStore();
  const searchParams = useSearchParams();

  const [data, setData] = useState<ChildDto[] | null>(children ?? null);
  const [currentChild, setCurrentChild] = useState<number>(0);

  const [accountData, setAccountData] = useState<Accounts | null>(null);
  const [total, setTotal] = useState<string | null>(null);
  const [allowance, setAllowance] = useState<string | null>(null);
  const [invest, setInvest] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [isAllowanceCreateOpen, setIsAllowanceCreateOpen] = useState<boolean>(false);
  const [isCardCreateOpen, setIsCardCreateOpen] = useState<boolean>(false);
  const [isInvestOpen, setIsInvestOpen] = useState<boolean>(false);
  const [isSavingOpen, setIsSavingOpen] = useState<boolean>(false);
  const [isReportWarningOpen, setIsReportWarningOpen] = useState<boolean>(false);
  const [showInvestCreateButton, setShowInvestCreateButton] = useState(false);
  const handleReportClick = () => {
    if (!accountData?.card?.hasCard) {
      setIsReportWarningOpen(true);
      return;
    }
    router.push(`/allowance/report`);
  };

  const [cardOpen, setCardOpen] = useState(false);
  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null);

  // URL 파라미터에서 childId(userId) 가져오기
  const rawChildId = searchParams.get("childId");
  const presetChildId =
    rawChildId !== null && rawChildId !== "" ? Number(rawChildId) : null;

  // 계좌 정보 조회 함수
  const fetchAccountData = useCallback(async (childId: number, showLoading: boolean = true) => {
    // showLoading이 true일 때만 로딩 상태 표시 및 데이터 초기화
    if (showLoading) {
      setLoading(true);
      setTotal(null);
      setAllowance(null);
      setInvest(null);
      setGoal(null);
    }

    try {
      const endpoint = requests.fetchTotalAccount(childId);
      const res = await api.get<ApiResponse<Accounts>>(endpoint);
      const accounts = res.data as Accounts;

      // 서버에서 받은 데이터를 state에 설정 (-1은 null로 변환)
      setTotal(accounts.total);
      setAllowance(accounts.allowance === "-1" ? null : accounts.allowance);
      setInvest(accounts.invest === "-1" ? null : accounts.invest);
      setGoal(accounts.goal === "-1" ? null : accounts.goal);
      setInvestAccountExists(accounts.invest !== null && accounts.invest !== "-1");

      setAccountData(accounts);
    } catch (e) {
      console.error(e);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [setInvestAccountExists]);

  const childHandler = (id: number) => {
    // Find the child object to get the name
    const child = data?.find((c) => c.userId === id);
    if (!child) return;

    // Update store with selected child info
    setChildBaseInfo(id, child.name);

    if (currentChild === id) {
      // 이미 선택된 자녀를 다시 클릭하면 로딩 없이 백그라운드에서 갱신
      fetchAccountData(id, false);
    } else {
      setCurrentChild(id);
    }
  };

  // 자녀가 변경될 때마다 해당 자녀의 최신 계좌 정보 조회
  useEffect(() => {
    if (currentChild) {
      fetchAccountData(currentChild);
    }
  }, [currentChild, fetchAccountData]);

  const autoTransHandler = () => {
    // 현재 선택된 자녀 객체 찾기
    const currentChildObj = data?.find((c) => c.userId === currentChild);
    if (!currentChildObj) return; // 안전 체크
    // store에 저장
    setChildBaseInfo(currentChildObj.userId, currentChildObj.name);
    router.push(`/account/auto-transfer`);
  };

  const handleViewCard = () => {
    // accountData에서 카드 여부 확인
    if (!accountData?.card?.hasCard) {
      setIsCardCreateOpen(true);
      return;
    }

    // 카드가 있으면 상세 정보 조회
    (async () => {
      try {
        const endpoint = requests.fetchChildCard(currentChild);
        const res = await api.get<ApiResponse<CardInfo>>(endpoint);
        const card = res.data as CardInfo;
        setCardInfo(card);
        setCardOpen(true);
      } catch (e) {
        console.error(e);
      }
    })();
  };

  const handleViewDetails = (accountType: string) => {
    // TODO: 계좌 타입에 따라 다른 페이지로 이동
    // if (accountType === ACCOUNT_TYPES.INVEST) {
    //   router.push("/invest/portfolios");
    //   return;
    // }
    // if (accountType === ACCOUNT_TYPES.GOAL) {
    //   router.push("/goal");
    //   return;
    // }

    const child = data?.find((c) => c.userId === currentChild);
    const childName = child?.name ?? "";

    const typeMap: Record<string, string> = {
      [ACCOUNT_TYPES.ALLOWANCE]: "allowance",
      [ACCOUNT_TYPES.GOAL]: "goal",
    };
    const balanceMap: Record<string, string | null> = {
      [ACCOUNT_TYPES.ALLOWANCE]: allowance,
      [ACCOUNT_TYPES.GOAL]: goal,
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

  useEffect(() => {
    if (!data || data.length === 0 || currentChild === 0) return;

    const fetchRequestCompleted = async () => {
      try {
        const res = await api.get(requests.fetchChildQuiz(currentChild));
        const completed = res.data.requestCompleted;
        setShowInvestCreateButton(completed);
      } catch (e) {
        console.error(e);
      }
    };

    fetchRequestCompleted();
  }, [data, currentChild]);



  /** URL childId 우선 선택 → 없으면 store의 selectedChildId → 없으면 첫 번째 아이 fallback */
  useEffect(() => {
    if (!data || data.length === 0) return;

    const isValidPreset =
      presetChildId !== null &&
      !Number.isNaN(presetChildId) &&
      data.some((c) => c.userId === presetChildId);

    if (isValidPreset) {
      const child = data.find((c) => c.userId === presetChildId);
      if (child) {
        setCurrentChild(presetChildId);
        setChildBaseInfo(presetChildId, child.name);
      }
    } else if (selectedChildId && data.some((c) => c.userId === selectedChildId)) {
      // URL 파라미터가 없으면 store에 저장된 selectedChildId 사용
      setCurrentChild(selectedChildId);
    } else if (currentChild === 0) {
      // 현재 선택된 자녀가 없고(0) 프리셋/스토어 값도 없으면 첫 번째 자녀 선택
      setCurrentChild(data[0].userId);
      setChildBaseInfo(data[0].userId, data[0].name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetChildId, data, selectedChildId]);



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
        <div className="text-head-00 text-neutral-1 mb-4">
          {loading ? "0" : total ? total : "0"} 원
        </div>

        {/* 계좌 카드 */}
        {(loading || allowance) ? (
          <AccountCard
            accountName={ACCOUNT_TYPES.ALLOWANCE}
            balance={loading ? "불러오는 중..." : allowance!}
            showCard
            onViewDetails={() => handleViewDetails(ACCOUNT_TYPES.ALLOWANCE)}
            onCardClick={handleViewCard}
            isLoading={loading}
          />
        ) : (
          <AccountCardDisabled
            accountName={ACCOUNT_TYPES.ALLOWANCE}
            onCardClick={() => setIsAllowanceCreateOpen(true)}
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

        {/* 투자 계좌 카드 */}
        {loading ? (
          <AccountCard
            accountName={ACCOUNT_TYPES.INVEST}
            balance="불러오는 중..."
            onViewDetails={() => handleViewDetails(ACCOUNT_TYPES.INVEST)}
            onCardClick={() => null}
            isLoading={loading}
          />
        ) : invest ? (
          <AccountCard
            accountName={ACCOUNT_TYPES.INVEST}
            balance={invest}
            onViewDetails={() => handleViewDetails(ACCOUNT_TYPES.INVEST)}
          />
        ) : showInvestCreateButton ? (
          <AccountCard2
            accountName={ACCOUNT_TYPES.INVEST}
            balance="투자 계좌 개설 요청 중!"
            onViewDetails={() => {
              router.push(`/invest/create-invest-account`);
            }}
          />
        ) : (
          <AccountCardDisabled
            accountName={ACCOUNT_TYPES.INVEST}
            onCardClick={() => setIsInvestOpen(true)}
          />
        )}



        {(loading || goal) ? (
          <AccountCard
            accountName={ACCOUNT_TYPES.GOAL}
            balance={loading ? "불러오는 중..." : goal!}
            onViewDetails={() => handleViewDetails(ACCOUNT_TYPES.GOAL)}
            onCardClick={() => null}
            isLoading={loading}
          />
        ) : (
          <AccountCardDisabled accountName="목표 계좌" onCardClick={() => setIsSavingOpen(true)} />
        )}

        <button
          onClick={handleReportClick}
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
      <DeleteConfirmDialog
        open={isAllowanceCreateOpen}
        onOpenChange={setIsAllowanceCreateOpen}
        title="용돈 계좌를 개설하시겠어요?"
        description="계좌를 개설해서 자녀의 용돈 관리를 시작해요!"
        ltBtnTxt="취소"
        rtBtnTxt="확인"
        onClickRtBtn={() => router.push(`/allowance/account/create`)}
      />
      <DeleteConfirmDialog
        open={isCardCreateOpen}
        onOpenChange={setIsCardCreateOpen}
        title="카드를 발급하시겠어요?"
        description="자녀의 카드를 발급해주세요!"
        ltBtnTxt="취소"
        rtBtnTxt="확인"
        onClickRtBtn={() => router.push(`/allowance/card/create`)}
      />
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
      <ConfirmationDialog
        open={isReportWarningOpen}
        onOpenChange={() => setIsReportWarningOpen(false)}
        title="카드가 없어요!"
        description="카드를 발급해야 확인할 수 있습니다."
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
