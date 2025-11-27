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

type Child = {
  name: string;
  childId: number;
  gender: number;
};

type Accounts = {
  total: string | null;
  allowance: string | null;
  invest: string | null;
  saving: string | null;
  card: { hasCard: boolean };
};

type CardInfo = {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

function AccountContentInner() {
  const router = useRouter();
  const [data, setData] = useState<Child[] | null>(null);
  const [accountData, setAccountData] = useState<Accounts | null>(null);
  const [currentChild, setCurrentChild] = useState<number>(0);

  const [total, setTotal] = useState<string | null>(null);
  const [allowance, setAllowance] = useState<string | null>(null);
  const [invest, setInvest] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const [isInvestOpen, setIsInvestOpen] = useState<boolean>(false);
  const [isSavingOpen, setIsSavingOpen] = useState<boolean>(false);

  // 카드 정보 상태
  const [cardOpen, setCardOpen] = useState(false);
  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null);

  const { userType, userId } = useUserStore();
  const { setHistoryData } = useSelectedChildStore();

  // URL 파라미터에서 childId 가져오기
  const searchParams = useSearchParams();
  const rawChildId = searchParams.get("childId");

  // 쿼리가 있을 때만 number로 변환
  const presetChildId =
    rawChildId !== null && rawChildId !== "" ? Number(rawChildId) : null;

  /* 상세 내용 보기 클릭 이벤트 */
  const handleViewDetails = (accountType: string) => {
    const child = data?.find((child) => child.childId === currentChild);
    const childName = child?.name ?? "";

    const typeMap: Record<string, string> = {
      "용돈 계좌": "allowance",
      "투자 계좌": "invest",
      "목표 적금": "saving",
    };
    const typeCode = typeMap[accountType];

    const balanceMap: Record<string, string | null> = {
      "용돈 계좌": allowance,
      "투자 계좌": invest,
      "목표 적금": saving,
    };
    const balance = balanceMap[accountType];

    const now = new Date();

    // 🔥 Zustand에 완전 저장하여 stateful 라우팅
    setHistoryData({
      selectedChildId: currentChild,
      selectedChildName: childName,
      accountName: accountType,
      accountType: typeCode,
      balance: balance ?? "0",
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    });

    // 쿼리 없이 이동!
    router.push("/account/history");
  };

  const childHandler = (id: number) => {
    setCurrentChild(id);
  };

  const autoTransHandler = () => {
    router.push(`/account/auto-transfer/${currentChild}`);
  };

  /* 카드 버튼 클릭 이벤트 */
  const handleViewCard = async () => {
    if (!accountData) return;

    if (!accountData?.card?.hasCard) {
      router.push(`/allowance/card/create`);
      return;
    }

    try {
      const res = await api.get<ApiResponse<CardInfo>>(
        requests.fetchChildCard,
        {
          params: { childId: currentChild },
        }
      );

      setCardInfo(res.data as CardInfo);
      setCardOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  /* 자녀 조회 */
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await api.get<ApiResponse<Child[]>>(requests.fetchChild, {
          signal: controller.signal,
          params: { id: userId },
        });

        if (controller.signal.aborted) return;
        setData(res.data as Child[]);
      } catch (e) {
        if (e instanceof HttpError && e.statusCode === 403) {
          router.push("/");
        }
      }
    })();

    return () => controller.abort();
  }, [userId, router]);

  /* 계좌 조회 */
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
  }, [currentChild]);

  /** URL로 전달된 childId 우선 선택 → 없으면 첫 번째 아이 선택 */
  useEffect(() => {
    if (!data || data.length === 0) {
      return; // 자녀 데이터가 없으면 아무것도 하지 않음
    }

    // URL의 childId가 유효한 자녀 목록에 있는지 확인
    const isValidPreset =
      presetChildId !== null &&
      !Number.isNaN(presetChildId) &&
      data.some((child) => Number(child.childId) === presetChildId);

    if (isValidPreset) {
      setCurrentChild(presetChildId as number);
    } else {
      // 유효하지 않으면 첫 번째 자녀로 fallback
      setCurrentChild(Number(data[0].childId));
    }
  }, [presetChildId, data]);

  /* balance 적용 */
  useEffect(() => {
    if (accountData) {
      setTotal(accountData.total);
      setAllowance(accountData.allowance);
      setInvest(accountData.invest);
      setSaving(accountData.saving);
    }
  }, [accountData]);

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
                  childId={Number(child.childId)}
                  currentChild={currentChild}
                  setCurrentChild={() => childHandler(Number(child.childId))}
                />
              ))
            ) : (
              <span className="text-body-04 text-neutral-3">
                아이의 데이터를 불러오고 있어요!
              </span>
            )}
          </div>
        </div>

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

        {/* 용돈 계좌 */}
        {allowance != null ? (
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
            onCardClick={() => {
              router.push(`/allowance/account/create`);
            }}
          />
        )}

        {/* 카드 상세 */}
        <CardDetail
          open={cardOpen}
          setOpen={setCardOpen}
          cardName={cardInfo?.cardName ?? ""}
          cardNumber={cardInfo?.cardNumber ?? ""}
          expiry={cardInfo?.expiry ?? ""}
          cvc={cardInfo?.cvc ?? ""}
        />

        {/* 투자 계좌 */}
        {invest != null && invest != undefined ? (
          <AccountCard
            accountName="투자 계좌"
            balance={invest}
            onViewDetails={() => handleViewDetails("투자 계좌")}
            onCardClick={() => null}
          />
        ) : (
          <AccountCardDisabled
            accountName="투자 계좌"
            onCardClick={() => {
              setIsInvestOpen(true);
            }}
          />
        )}

        {/* 목표 적금 */}
        {saving != null && saving != undefined ? (
          <AccountCard
            accountName="목표 적금"
            balance={saving}
            onViewDetails={() => handleViewDetails("목표 적금")}
            onCardClick={() => null}
          />
        ) : (
          <AccountCardDisabled
            accountName="목표 계좌"
            onCardClick={() => setIsSavingOpen(true)}
          />
        )}

        <button className="flex justify-start w-[335px] h-[48px] border border-monochrome-gray bg-neutral-7 rounded-4xl text-body-04 items-center mt-0">
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
    <Suspense fallback={
      <div className="max-h-screen px-[17px] flex justify-center items-center">
        <span className="text-body-04 text-neutral-3">
          로딩중...
        </span>
      </div>
    }>
      <AccountContentInner />
    </Suspense>
  );
}

