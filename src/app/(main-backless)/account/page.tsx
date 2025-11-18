"use client";
import { AccountCard } from "@/components/custom/account/AccountCard";
import { AccountCardDisabled } from "@/components/custom/account/AccountCardDisabled";
import { CardDetail } from "@/components/custom/allowance/card/CardDetail";
import { ChildrenBadge } from "@/components/ui/badge/ChildrenBadge";
import { ConfirmationDialog } from "@/components/ui/modal/ConfirmationDialog";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useAccountHistoryStore } from "@/store/accountHistory";
import { useUserStore } from "@/store/userStore";
import { ApiResponse } from "@/types/axios/apiRes.t";
import { HttpError } from "@/types/axios/httpError.t";
import { useRouter } from "next/navigation";
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
};

type CardInfo = {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState<Child[] | null>(null);
  const [accountData, setAccountData] = useState<Accounts | null>(null);
  const [currentChild, setCurrentChild] = useState<number>(0);

  const [total, setTotal] = useState<number | null>(null);
  const [allowance, setAllowance] = useState<number | null>(null);
  const [invest, setInvest] = useState<number | null>(null);
  const [saving, setSaving] = useState<number | null>(null);

  const [isInvestOpen, setIsInvestOpen] = useState<boolean>(false);
  const [isSavingOpen, setIsSavingOpen] = useState<boolean>(false);

  const [cardOpen, setCardOpen] = useState(false);
  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null);

  const { userType, userId } = useUserStore();
  const { setHistoryData } = useAccountHistoryStore();

  /* 상세 내용 보기 → stateful 이동 */
  const handleViewDetails = (accountType: string) => {
    const child = data?.find((child) => child.childId === currentChild);
    const childName = child?.name ?? "";

    const typeMap: Record<string, string> = {
      "용돈 계좌": "allowance",
      "투자 계좌": "invest",
      "목표 적금": "saving",
    };
    const typeCode = typeMap[accountType];

    const balance =
      accountType === "용돈 계좌"
        ? allowance
        : accountType === "투자 계좌"
        ? invest
        : saving;

    const now = new Date();

    // 🔥 Zustand에 완전 저장하여 stateful 라우팅
    setHistoryData({
      childId: currentChild,
      childName,
      accountName: accountType,
      accountType: typeCode,
      balance: balance ?? 0,
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

  const handleViewCard = async () => {
    try {
      const res = await api.get<ApiResponse<CardInfo>>(requests.fetchChildCard, {
        params: { childId: currentChild },
      });

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
  }, []);

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

  /* 첫 아이 자동선택 */
  useEffect(() => {
    if (data && data.length > 0 && currentChild === 0) {
      setCurrentChild(data[0].childId);
    }
  }, [data]);

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
                  childId={child.childId}
                  currentChild={currentChild}
                  setCurrentChild={() => childHandler(child.childId)}
                />
              ))
            ) : (
              <span className="text-body-04 text-[#989898]">
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
            onCardClick={() => router.push("/allowance/account/create")}
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
        {invest != null ? (
          <AccountCard
            accountName="투자 계좌"
            balance={invest}
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
        {saving != null ? (
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

        <button
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
