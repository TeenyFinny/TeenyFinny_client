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
  /** 사용자 ID */
  userId: string;
  /** 자동이체 식별자 */
  transferId: string;
  /** 매월 이체 금액 (문자열 포맷) */
  transferAmount: string;
  /** 이체 일자 (1~31일 등 문자열) */
  transferDate: string;
  /** 투자 비율 (0~100) */
  ratio: number;
};

/**
 * 자동이체 설정 페이지
 *
 * - URL: /account/auto-transfer/[id]
 * - 기능:
 *   - 최초 자동이체 설정 생성
 *   - 기존 자동이체 수정
 *   - 자동이체 삭제
 */
export default function Page() {
  /** 이체 금액 입력값 (콤마 포함 문자열) */
  const [amount, setAmount] = useState<string | null>(null);
  /** 이체 일자 입력값 (1~31일 등) */
  const [date, setDate] = useState<string | null>(null);
  /** 투자 비율 (슬라이더 값, 0~100) */
  const [investmentRatio, setInvestmentRatio] = useState<number>(50);
  /** 수정 모드 여부 (true: 수정 중, false: 조회/삭제 모드) */
  const [isEdit, setIsEdit] = useState<boolean>(false);
  /** 최초 설정 모드 여부 (true: 최초 설정, false: 기존 설정 존재) */
  const [isInit, setIsInit] = useState<boolean>(true);
  /** 삭제 버튼 노출 여부 */
  const [deleteButtonFlag, setDeleteButtonFlag] = useState<boolean>(false);
  /** 자동이체 식별자 (수정/삭제 시 사용) */
  const [autoTransferId, setAutoTransferId] = useState<number>(-1);
  /** 삭제 비밀번호 바텀시트 여부 */
  const [isDeletePasswordOpen, setIsDeletePasswordOpen] =
    useState<boolean>(false);
  /** 삭제 완료 모달 여부 */
  const [isDeleteDoneOpen, setIsDeleteDoneOpen] = useState<boolean>(false);

  /** URL 동적 세그먼트에서 가져온 자녀/사용자 ID */
  const { id } = useParams<Params>();
  const router = useRouter();

  /**
   * 자동이체 저장(생성/수정) 핸들러
   *
   * - isInit === true → 자동이체 최초 생성 요청
   * - isInit === false → 기존 자동이체 수정 요청
   * - 요청 성공 후 /account 페이지로 이동
   */
  const updateSubmitHandler = async () => {
    const totalAmount = Number(amount ?? 0);

    //공백일 경우 placeholder에 해당하는 1일로 변경
    const realDate = !date || date === "0" ? "1" : date;
    //NULL일 경우 0원으로 설정하며, 숫자를 ,로 끊어서 처리해서 보냄.
    const realAmount = Number(amount ?? 0).toLocaleString("ko-KR");

    // 슬라이더에서 쓰던 것과 동일한 계산식
    const investmentAmount = Math.round((totalAmount * investmentRatio) / 100);
    const allowanceAmount = totalAmount - investmentAmount;

    try {
      if (isInit) {
        // 최초 자동이체 설정 생성
        await api.post(requests.fetchAutoTransfer, {
          data: {
            userId: id,
            transferAmount: realAmount,
            transferDate: realDate,
            ratio: investmentRatio,
          },
        });
      } else {
        // 기존 자동이체 설정 수정
        await api.put(requests.fetchAutoTransfer, {
          data: {
            autoTransferId: autoTransferId,
            transferAmount: realAmount,
            transferDate: realDate,
            ratio: investmentRatio,
          },
        });
      }

      console.log(
        `이체 금액: ${totalAmount}원, ` +
          `투자 금액: ${investmentAmount}원, ` +
          `용돈 금액: ${allowanceAmount}원, ` +
          `이체 일자: ${date ?? ""}일, ` +
          `투자 계좌 입금 비율: ${investmentRatio}% 제출됨`
      );
      router.push(`/account`);
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
      await api.delete(requests.fetchAutoTransfer, {
        data: { autoTransferId: autoTransferId },
      });

      console.log(`${autoTransferId} 삭제 요청 완료`);

      router.push(`/account`);
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
          requests.fetchAutoTransfer,
          {
            signal: controller.signal,
            params: { userId: id },
          }
        );

        if (controller.signal.aborted) return;

        const data = res.data as AutoTransfer | undefined;

        if (data) {
          const init = data.isInit === true;

          setIsInit(init);

          // 기존 자동이체 설정이 존재하는 경우, 화면에 값 세팅
          if (!init) {
            setDate(data.transferDate ?? null);
            setAmount(data.transferAmount ?? null);
            setInvestmentRatio(Number(data.ratio ?? -1));
            setAutoTransferId(Number(data.transferId ?? -1));
          }
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
  }, [id]);

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
        <div className="text-head-03 text-neutral-2 ">김티니의</div>
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
            content={amount ? amount : "0"}
            isRight={true}
            unit="원"
          />
        ) : (
          <NormalInput
            label="이체 금액"
            value={amount ?? ""}
            //onChange={amountHandler}
            onChange={(val2) => {
              setAmount(clampNumberInRange(val2, 0, 500000000));
            }}
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
        disabled={deleteButtonFlag}
      />

      <div className="h-[57px] w-[88px]" />
      <div className="w-[320px]">
        {deleteButtonFlag ? (
          <DisabledInputField
            label="이체 일시"
            content={date ? date : ""}
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
              value={date ? date : ""}
              onChange={(val) => {
                setDate(clampNumberInRange(val, 1, 28));
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
