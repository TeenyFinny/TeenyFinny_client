"use client";
import { RatioSlider } from "@/components/custom/account/RatioSlider";
import { BottomSheetPassword } from "@/components/ui/bottom-sheet/BottomSheetPassword";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { DisabledInputField } from "@/components/ui/input/DisabledInputField";
import { NormalInput } from "@/components/ui/input/NormalInput";
import { NormalInput2 } from "@/components/ui/input/NormalInput2";
import { DeleteConfirmDialog } from "@/components/ui/modal/DeleteConfirmDialog";
import { TitleOnlyDialog } from "@/components/ui/modal/TitleOnlyDialog";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { ApiResponse } from "@/types/axios/apiRes.t";
import { HttpError } from "@/types/axios/httpError.t";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelectedChildStore } from "@/store/selectedChildStore";

type AutoTransfer = {
  isInit: boolean;
  transferId: number | null;
  transferAmount: string;
  transferDate: number;
  ratio: number;
};

export default function Page() {
  const router = useRouter();
  const { hasInvestAccount, selectedChildName, selectedChildId } =
    useSelectedChildStore();

  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<number>(1);
  const [investmentRatio, setInvestmentRatio] = useState<number>(0);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isInit, setIsInit] = useState<boolean>(true);
  const [deleteButtonFlag, setDeleteButtonFlag] = useState<boolean>(false);
  const [autoTransferId, setAutoTransferId] = useState<number | null>(null);

  /** 삭제 완료 모달 */
  const [isDeleteDoneOpen, setIsDeleteDoneOpen] = useState<boolean>(false);
  /** 수정/생성 완료 모달 */
  const [isUpdateDoneOpen, setIsUpdateDoneOpen] = useState<boolean>(false);

  /** 간편 비밀번호 바텀시트 */
  const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false);

  /** 현재 어떤 작업을 진행 중인지 저장 */
  const [pendingAction, setPendingAction] =
    useState<"CREATE_OR_UPDATE" | "DELETE" | null>(null);

  /** 금액 입력 핸들러 */
  const handleAmountChange = (value: string) => {
    const numeric = Number(value.replace(/,/g, ""));
    if (!isNaN(numeric)) {
      setAmount(numeric);
    }
  };

  /** 금액 콤마 */
  const formatComma = (value: number) => value.toLocaleString("ko-KR");

  /** 투자/용돈 자동 계산 */
  const investmentAmount = Math.round((amount * investmentRatio) / 100);
  const allowanceAmount = amount - investmentAmount;

  /* ----------------------------- 🔐 간편 비밀번호 인증 ----------------------------- */
  const verifySimplePassword = async (password: string): Promise<boolean> => {
    try {
      const res = await api.post(requests.simplePassword, {
        password: password,
      });
      return res.data?.matched === true;
    } catch (e) {
      console.error("Password verify error:", e);
      return false;
    }
  };

  const handlePasswordComplete = async (password: string) => {
    const ok = await verifySimplePassword(password);

    if (!ok) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsPasswordSheetOpen(false);

    if (pendingAction === "CREATE_OR_UPDATE") {
      await commitAutoTransferUpdate();
    }
    if (pendingAction === "DELETE") {
      await commitAutoTransferDelete();
    }

    setPendingAction(null);
  };

  /* ----------------------------- 데이터 조회 ----------------------------- */
  const fetchAutoTransferData = async (signal?: AbortSignal) => {
    try {
      const res = await api.get<ApiResponse<AutoTransfer>>(
        requests.fetchAutoTransferById(Number(selectedChildId)),
        { signal }
      );
      const data = res.data as AutoTransfer;

      setIsInit(data.isInit);

      if (!data.isInit) {
        const numericAmount = Number(data.transferAmount.replace(/,/g, ""));
        setAmount(numericAmount);
        setDate(Number(data.transferDate));
        setInvestmentRatio(data.ratio);
        setAutoTransferId(data.transferId);
      }
    } catch (e) {
      if (e instanceof HttpError && e.statusCode === 403) router.push("/");
    }
  };

  /* ----------------------------- ⭕ 실제 자동이체 생성/수정 API ----------------------------- */
  const commitAutoTransferUpdate = async () => {
    try {
      if (isInit) {
        await api.post(requests.fetchAutoTransferById(Number(selectedChildId)), {
          type: "ALLOWANCE",
          totalAmount: amount,
          transferDate: date,
          ratio: investmentRatio,
        });
        console.log("create request");
      } else {
        await api.put(
          requests.fetchAutoTransferById(Number(selectedChildId)),
          {
            type: "ALLOWANCE",
            totalAmount: amount,
            transferDate: date,
            ratio: investmentRatio,
          }
        );
        console.log("update request");
      }

      await fetchAutoTransferData();
      setIsEdit(false);
      setIsUpdateDoneOpen(true);
    } catch (e) {
      if (e instanceof HttpError && e.statusCode === 403) {
        router.push("/");
      } else {
        console.error(e);
      }
    }
  };

  /* ----------------------------- ⭕ 실제 삭제 API ----------------------------- */
  const commitAutoTransferDelete = async () => {
    try {
      await api.delete(
        requests.fetchAutoTransferById(Number(selectedChildId)),
        {
          data: {
            autoTransferId: Number(autoTransferId),
          },
        }
      );
      console.log("delete request");
      setIsDeleteDoneOpen(true);
    } catch (e) {
      if (e instanceof HttpError && e.statusCode === 403) {
        router.push("/");
      } else {
        console.error(e);
      }
    }
  };

  const deleteDoneHandler = () => {
    router.push("/account");
  };

  const updateDoneHandler = () => {
    setIsUpdateDoneOpen(false);
  };

  /* ----------------------------- 버튼 클릭 핸들러 ----------------------------- */

  /** 수정 버튼 클릭 */
  const editButtonHandler = () => {
    setIsEdit(!isEdit);
  };

  /** 저장 버튼 → 바로 API 호출 ❌ → 비밀번호 인증 먼저 */
  const updateSubmitHandler = () => {
    setPendingAction("CREATE_OR_UPDATE");
    setIsPasswordSheetOpen(true);
  };

  /** 삭제하기 버튼 → 비밀번호 인증 먼저 */
  const deleteConfirmHandler = () => {
    setPendingAction("DELETE");
    setIsPasswordSheetOpen(true);
  };

  /* ----------------------------- 자동이체 정보 조회 ----------------------------- */
  useEffect(() => {
    const controller = new AbortController();
    fetchAutoTransferData(controller.signal);
    return () => controller.abort();
  }, [selectedChildId]);

  /* ----------------------------- 삭제 버튼 노출 조건 ----------------------------- */
  useEffect(() => {
    if (isInit) setDeleteButtonFlag(false);
    else if (isEdit) setDeleteButtonFlag(false);
    else setDeleteButtonFlag(true);
  }, [isEdit, isInit]);

  /* ----------------------------- UI 렌더링 ----------------------------- */
  return (
    <div className="max-h-screen px-[17px] mt-[6px] flex flex-col items-center">
      <div className="w-full">
        <div className="text-head-03 text-neutral-2 ">
          {selectedChildName}의
        </div>
        <div className="text-head-01 mb-[39px] flex flex-row">
          자동이체 설정
          {!isInit && (
            <button onClick={editButtonHandler}>
              <Image
                src="/icons/edit.png"
                alt="수정하기"
                width={27}
                height={27}
                className="ml-[6px]"
              />
            </button>
          )}
        </div>
      </div>

      {/* 금액 */}
      <div className="w-[320px]">
        {deleteButtonFlag ? (
          <DisabledInputField
            label="이체 금액"
            content={formatComma(amount)}
            isRight={true}
            unit="원"
          />
        ) : (
          <NormalInput
            label="이체 금액"
            value={formatComma(amount)}
            onChange={handleAmountChange}
            placeholder="0"
            unit="원"
            isRight={true}
            isNumeric={true}
          />
        )}
      </div>

      <div className="h-[57px]" />

      {/* 투자 비율 슬라이더 */}
      <RatioSlider
        totalAmount={Number(amount)}
        investmentRatio={investmentRatio}
        onChange={setInvestmentRatio}
        disabled={deleteButtonFlag || !hasInvestAccount}
      />

      <div className="h-[57px] w-[88px]" />

      {/* 날짜 입력 */}
      <div className="w-[320px]">
        {deleteButtonFlag ? (
          <DisabledInputField
            label="이체 일시"
            content={date.toString()}
            isRight={true}
            unit="일"
          />
        ) : (
          <div className="w-[320px]">
            <div className="text-body-03 text-neutral-2 mt-[6px] mb-[3.5px]">
              이체 일시
            </div>
            <NormalInput2
              label="매달"
              value={String(date)}
              onChange={(v) => {
                const n = Number(v.replace(/,/g, ""));
                if (!isNaN(n) && n >= 1 && n <= 28) setDate(n);
              }}
              placeholder="1"
              unit="일"
              isNumeric={true}
            />
          </div>
        )}

        <div className="h-[57px]" />

        {/* 저장하기 / 삭제하기 버튼 */}
        {deleteButtonFlag ? (
          <DeleteConfirmDialog
            trigger={<BigButtonActivated onClick={() => {}} label="해지하기" />}
            title="정말 해제하시겠어요?"
            description="해지 후에도 다시 설정할 수 있어요!"
            rtBtnTxt="해제"
            ltBtnTxt="취소"
            onClickRtBtn={deleteConfirmHandler}
          />
        ) : (
          <BigButtonActivated onClick={updateSubmitHandler} label="저장하기" />
        )}
      </div>

      {/* 결과 모달 (삭제) */}
      {isDeleteDoneOpen && (
        <TitleOnlyDialog
          open={isDeleteDoneOpen}
          onOpenChange={setIsDeleteDoneOpen}
          title="자동이체가 해제되었습니다."
          onConfirm={deleteDoneHandler}
        />
      )}

      {/* 결과 모달 (생성/수정) */}
      {isUpdateDoneOpen && (
        <TitleOnlyDialog
          open={isUpdateDoneOpen}
          onOpenChange={setIsUpdateDoneOpen}
          title="자동이체 설정이 완료되었습니다."
          onConfirm={updateDoneHandler}
        />
      )}

      {/* 🔐 간편 비밀번호 바텀시트 */}
      <BottomSheetPassword
        open={isPasswordSheetOpen}
        setOpen={setIsPasswordSheetOpen}
        pinLength={6}
        title="간편비밀번호"
        onComplete={handlePasswordComplete}
        shouldOverlayBottomBar={true}
      />
    </div>
  );
}
