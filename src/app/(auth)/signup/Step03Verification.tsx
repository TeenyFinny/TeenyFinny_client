"use client";

import { useState, useMemo } from "react";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";
import { PhoneNumberInput } from "@/components/custom/allowance/checking/PhoneNumberInput";
import { ResidentNumberInput } from "@/components/custom/allowance/checking/ResidentNumberInput";
import NameInput from "@/components/custom/allowance/checking/NameInput";
import { useRegisterStore } from "@/store/registerStore";
import { isValidBirthDate } from "@/lib/utils/validators";
import { TitleOnlyDialog } from "@/components/ui/modal/TitleOnlyDialog";

type Step03VerificationProps = Readonly<{ onNext: () => void }>;

/**
 * Step03Verification
 *
 * 회원가입 단계 3: 본인인증
 * - front(YYMMDD) / back(첫 글자) 는 로컬 상태로만 관리
 * - 다음 단계 이동 시에만 birthDate(YYYYMMDD) + gender를 store에 반영
 */
export default function Step03Verification({
  onNext,
}: Step03VerificationProps) {
  const { form, setField } = useRegisterStore();

  // 통신사(서비스 필드와 무관) — UI 전용
  const [carrier, setCarrier] = useState("SKT");

  // 주민번호 입력 로컬 상태 (store에는 최종 YYYYMMDD만 저장)
  const [birthFront, setBirthFront] = useState<string>(""); // YYMMDD
  const [birthBack, setBirthBack] = useState<string>(""); // 1자리

  //생년월일 검증 모달 상태
  const [openBirthErrorModal, setOpenBirthErrorModal] = useState(false);

  // 파생 상태: 성별/세기
  const { gender, yearPrefix } = useMemo(() => {
    const g = birthBack[0];
    const GENDER_INFO_MAP: Record<
      string,
      { gender: "M" | "F"; prefix: "19" | "20" }
    > = {
      "1": { gender: "M", prefix: "19" },
      "2": { gender: "F", prefix: "19" },
      "3": { gender: "M", prefix: "20" },
      "4": { gender: "F", prefix: "20" },
    };
    const info = GENDER_INFO_MAP[g];

    if (info) {
      return { gender: info.gender, yearPrefix: info.prefix };
    }
    return { gender: null, yearPrefix: null };
  }, [birthBack]);

  /** 버튼 활성화 조건 */
  const isButtonEnabled =
    form.phoneNumber.length === 11 &&
    birthFront.length === 6 && // YYMMDD
    birthBack.length === 1 && // 첫 글자
    form.name.trim().length > 0 &&
    gender !== null;

  /** 다음 단계 이동: 최종 YYYYMMDD + gender 확정 저장 */
  const handleNext = () => {
    if (!yearPrefix) return; // 세기 미판별 시 방어
    const finalBirth = `${yearPrefix}${birthFront}`; // YYYYMMDD

    //생년월일을 검증하는 함수, 생년월일이 부적합할시에 return;으로 방어, console.log("생년월일을 확인하세요") 출력
    // 생년월일 유효성 검증
    if (!isValidBirthDate(finalBirth)) {
      console.log("생년월일을 확인하세요");
      setOpenBirthErrorModal(true);
      return;
    }
    setField("birthDate", finalBirth);
    setField("gender", gender);
    setField("isVerified", true);
    onNext();
  };

  return (
    <div className="flex flex-col">
      {/* 타이틀 */}
      <div className="pt-[34px] pb-[24px] text-left">
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
          {"이용중인 통신사 정보와\n휴대폰번호를 입력해 주세요"}
        </h1>
      </div>

      <PhoneNumberInput
        label="휴대폰 번호"
        carrier={carrier}
        phoneNumber={form.phoneNumber}
        onCarrierChange={setCarrier}
        onPhoneNumberChange={(val) => setField("phoneNumber", val)}
      />

      <ResidentNumberInput
        label="주민등록번호"
        front={birthFront} // 로컬(YYMMDD)
        back={birthBack} // 로컬(1자리)
        onFrontChange={setBirthFront} // 그대로 로컬 업데이트
        onBackChange={setBirthBack} // 그대로 로컬 업데이트
      />

      <NameInput value={form.name} onChange={(val) => setField("name", val)} />

      <div className="fixed bottom-[56px] w-full max-w-[327px]">
        {isButtonEnabled ? (
          <BigButtonActivated label="다음" onClick={handleNext} />
        ) : (
          <BigButtonDisabled label="다음" onClick={() => { }} />
        )}
      </div>
      <TitleOnlyDialog
        open={openBirthErrorModal}
        onOpenChange={setOpenBirthErrorModal}
        title={"올바른 주민등록번호를 \n 입력해주세요."}
        confirmText="확인"
      />
    </div>

  );
}
