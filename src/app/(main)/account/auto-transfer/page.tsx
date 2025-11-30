"use client";
import { RatioSlider } from "@/components/custom/account/RatioSlider";
import { BottomSheetPassword } from "@/components/ui/bottom-sheet/BottomSheetPassword";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { DisabledInputField } from "@/components/ui/input/DisabledInputField";
import { NormalInput } from "@/components/ui/input/NormalInput";
import { NormalInput2 } from "@/components/ui/input/NormalInput2";
import { ConfirmationDialog } from "@/components/ui/modal/ConfirmationDialog";
import { ConfirmContentDialog } from "@/components/ui/modal/ConfirmContentDialog";
import { DeleteConfirmDialog } from "@/components/ui/modal/DeleteConfirmDialog";
import { TitleOnlyDialog } from "@/components/ui/modal/TitleOnlyDialog";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { clampNumberInRange } from "@/lib/utils/validators";
import { ApiResponse } from "@/types/axios/apiRes.t";
import { HttpError } from "@/types/axios/httpError.t";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelectedChildStore } from "@/store/selectedChildStore";
/**
 * URL 파라미터로 전달되는 동적 세그먼트 타입
 *
 * 예: /account/auto-transfer/1 → { id: "1" }
 */
type Params = {
  /** 자동이체를 설정할 자녀(또는 사용자)의 ID */
  id: string;
};
/**
 * 자동이체 정보 응답 타입
 *
 * 백엔드에서 내려주는 자동이체 설정 정보를 표현한다.
 */
type AutoTransfer = {
  /** 최초 설정 여부 */
  isInit: boolean;
  /** 자동이체 식별자 */
  transferId: number | null;
  /** 매월 이체 금액*/
  transferAmount: string;
  /** 이체 일자 (1~31일 등 문자열) */
  transferDate: number;
  /** 투자 비율 (0~100) */
  ratio: number;
};
/**
 * 자동이체 설정 페이지
 *
 * - URL: /account/auto-transfer/
 * - 기능:
 *   - 최초 자동이체 설정 생성
 *   - 기존 자동이체 수정
 *   - 자동이체 삭제
 */
export default function Page() {
  /** 이체 금액 입력값 (콤마 포함 문자열) */
  const [amount, setAmount] = useState<number>(0);
  /** 이체 일자 입력값 (1~31일 등) */
  const [date, setDate] = useState<number>(1);
  /** 투자 비율 (슬라이더 값, 0~100) */
  const [investmentRatio, setInvestmentRatio] = useState<number>(0);
  /** 수정 모드 여부 (true: 수정 중, false: 조회/삭제 모드) */
  const [isEdit, setIsEdit] = useState<boolean>(false);
  /** 최초 설정 모드 여부 (true: 최초 설정, false: 기존 설정 존재) */
  const [isInit, setIsInit] = useState<boolean>(true);
  /** 삭제 버튼 노출 여부 */
  const [deleteButtonFlag, setDeleteButtonFlag] = useState<boolean>(false);
  /** 자동이체 식별자 (수정/삭제 시 사용) */
  const [autoTransferId, setAutoTransferId] = useState<number | null>(null);
  /** 삭제 비밀번호 바텀시트 여부 */
  const [isDeletePasswordOpen, setIsDeletePasswordOpen] =
    useState<boolean>(false);
  /** 삭제 완료 모달 여부 */
  const [isDeleteDoneOpen, setIsDeleteDoneOpen] = useState<boolean>(false);
  /** URL 동적 세그먼트에서 가져온 자녀/사용자 ID */
  const router = useRouter();
  const { hasInvestAccount, selectedChildName, selectedChildId } = useSelectedChildStore();
  
  /** 금액 입력 */
  const handleAmountChange = (value: string) => {
    const numeric = Number(value.replace(/,/g, ""));
    if (!isNaN(numeric)) {
      setAmount(numeric);
    }
  };
  /** 금액 콤마 문자열로 변환 */
  const formatComma = (value: number) => value.toLocaleString("ko-KR");
  // 슬라이더에서 쓰던 것과 동일한 계산식
  const investmentAmount = Math.round((amount * investmentRatio) / 100);
  const allowanceAmount = amount - investmentAmount;
  /**
   * 자동이체 저장(생성/수정) 핸들러
   *
   * - isInit === true → 자동이체 최초 생성 요청
   * - isInit === false → 기존 자동이체 수정 요청
   * - 요청 성공 후 /account 페이지로 이동
   */
  const updateSubmitHandler = async () => {
    try {
      if (isInit) {
        await api.post(requests.fetchAutoTransferById(Number(selectedChildId)), {
          type: "ALLOWANCE",
          totalAmount: amount,
          transferDate: date,
          ratio: investmentRatio,
        });
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
      }
      router.push("/account");
    } catch (e) {
      if (e instanceof HttpError) {
        // 권한이 없다면 온보딩 화면으로 라우팅
        if (e.statusCode === 403) {
          router.push("/");
        } else {
          // 필요 시 다른 에러 처리
          console.error(e);
        }
      } else {
        console.error("An unexpected error occurred", e);
      }
    }
  };
  /**
   * 수정 버튼 클릭 핸들러
   *
   * - isEdit 상태를 토글한다.
   * - 수정 모드일 때는 인풋이 활성화되고, 삭제 버튼은 숨김 처리된다.
   */
  const editButtonHandler = () => {
    if (isEdit) setIsEdit(false);
    else setIsEdit(true);
  };
  const deleteConfirmHandler = () => {
    setIsDeletePasswordOpen(true);
  };
  const deletePasswordHandler = () => {
    setIsDeletePasswordOpen(false);
    setIsDeleteDoneOpen(true);
  };
  const deleteDoneHandler = async () => {
    try {
      await api.delete(
      requests.fetchAutoTransferById(Number(selectedChildId)),
      {
        data: {
          autoTransferId: Number(autoTransferId)
        }
      }
    );
      router.push("/account");
    } catch (e) {
      if (e instanceof HttpError) {
        if (e.statusCode === 403) {
          router.push("/");
        } else {
          console.error(e);
        }
      } else {
        console.error("An unexpected error occurred", e);
      }
    }
  };
  /**
   * 페이지 진입 시 자동이체 설정 조회
   *
   * - 현재 URL의 id(userId)를 기반으로 자동이체 정보를 조회한다.
   * - 응답이 isInit === true이면 최초 설정 모드 유지
   * - isInit === false이면 화면에 기존 설정값(금액/일자/비율/autoTransferId)을 채운다.
   * - 컴포넌트 언마운트 시 AbortController로 요청을 중단한다.
   */
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        // 인터셉터가 res.data를 반환하므로 res가 응답 바디
        const res = await api.get<ApiResponse<AutoTransfer>>(
          requests.fetchAutoTransferById(Number(selectedChildId)),
          { signal: controller.signal }
        );
        if (controller.signal.aborted) return;
        const data = res.data as AutoTransfer;
        console.log(data);
        const init = data.isInit === true;
        console.log(init);
        setIsInit(init);
        // 기존 자동이체 설정이 존재하는 경우, 화면에 값 세팅
        if (!data.isInit) {
          // 문자열 "120,000" → 숫자 변환
          const numericAmount = Number(data.transferAmount.replace(/,/g, ""));
          setAmount(numericAmount);
          setDate(Number(data.transferDate));
          setInvestmentRatio(data.ratio);
          setAutoTransferId(data.transferId);
        }
      } catch (e) {
        if (e instanceof HttpError) {
          if (e.statusCode === 403) {
            router.push("/");
          } else {
            console.error(e);
          }
        } else {
          console.error("An unexpected error occurred", e);
        }
      }
    })();
    return () => {
      controller.abort();
    };
  }, [selectedChildId]);
  /**
   * 버튼 노출 상태 관리 이펙트
   *
   * - isInit === true → 최초 설정 모드 → 삭제 버튼 숨김
   * - isInit === false && isEdit === true → 수정 모드 → 삭제 버튼 숨김
   * - isInit === false && isEdit === false → 조회 모드 → 삭제 버튼 노출
   */
  useEffect(() => {
    if (isInit) setDeleteButtonFlag(false);
    else if (isEdit) setDeleteButtonFlag(false);
    else setDeleteButtonFlag(true);
  }, [isEdit, isInit]);
  return (
    <div className="max-h-screen px-[17px] mt-[6px] flex flex-col items-center">
      <div className="w-full">
        <div className="text-head-03 text-neutral-2 ">{selectedChildName}의</div>
        <div className="text-head-01 mb-[39px] flex flex-row">
          자동이체 설정
          {isInit ? null : (
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
            //onChange={amountHandler}
            onChange={handleAmountChange}
            placeholder="0"
            unit="원"
            isRight={true}
            isNumeric={true}
          />
        )}
      </div>
      <div className="h-[57px]" />
      <RatioSlider
        totalAmount={Number(amount)}
        investmentRatio={investmentRatio}
        onChange={setInvestmentRatio}
        disabled={deleteButtonFlag || !hasInvestAccount}
      />
      <div className="h-[57px] w-[88px]" />
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
              value={date.toString()}
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
        {deleteButtonFlag ? (
          <DeleteConfirmDialog
            trigger={<BigButtonActivated onClick={() => {}} label="삭제하기" />}
            title="정말 해제하시겠어요?"
            description="해지 후에도 다시 설정할 수 있어요!"
            rtBtnTxt="해제"
            ltBtnTxt="취소"
            onClickRtBtn={deleteConfirmHandler}
            onClickLtBtn={() => {
              // 취소 눌렀을 때 하고 싶은 거 있으면 여기
            }}
          />
        ) : (
          <BigButtonActivated onClick={updateSubmitHandler} label="저장하기" />
        )}
      </div>
      <div>
        {isDeletePasswordOpen ? (
          <BottomSheetPassword
            open={isDeletePasswordOpen}
            setOpen={setIsDeletePasswordOpen}
            onComplete={deletePasswordHandler}
          />
        ) : null}
        {isDeleteDoneOpen ? (
          <TitleOnlyDialog
            open={isDeleteDoneOpen}
            onOpenChange={setIsDeleteDoneOpen}
            title="자동이체가 해제되었습니다."
            onConfirm={deleteDoneHandler}
          />
        ) : null}
      </div>
    </div>
  );
}