"use client";

import { useState, useEffect } from "react";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";
import { NormalInput2 } from "@/components/ui/input/NormalInput2";
import { BottomSheetPassword } from "@/components/ui/bottom-sheet/BottomSheetPassword";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";

import { useSelectedChildStore } from "@/store/selectedChildStore";

/**
 * Step08ChildInfoInput
 *
 * 자녀 정보를 입력받는 페이지 컴포넌트입니다.
 *
 * ### 주요 기능
 * - 이름, 휴대폰 번호, 생년월일, 집주소, 상세주소를 입력받습니다.
 * - 이름은 한글만 허용됩니다.
 * - 휴대폰 번호는 숫자만 허용하며, 최대 11자리까지만 입력할 수 있습니다.
 * - 생년월일은 숫자만 허용하며, 6자리(YYMMDD)로 입력해야 합니다.
 * - 모든 입력이 올바르게 완료되면 하단의 "모두 입력했어요" 버튼이 활성화됩니다.
 * - 버튼 클릭 시 비밀번호 설정 바텀시트가 열리고, 4자리 입력 완료 시 onNext 실행.
 *
 * @component
 * @param {{ onNext: () => void }} props
 * @returns {React.ReactElement}
 */
export default function Step07ChildInfoInput({
  onNext,
}: {
  onNext: () => void;
}) {
  const { selectedChildId } = useSelectedChildStore();
  const [childName, setChildName] = useState("");
  const [childPhone, setChildPhone] = useState("");
  const [birth, setBirth] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [birthError, setBirthError] = useState("");

  // 비밀번호 설정 바텀시트 상태
  const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false);

  /**
   * 인증 성공 시 자동으로 다음 단계로 이동시키는 effect
   */

  /** 이름 입력 시 한글만 허용 */
  const handleNameChange = (value: string) => {
    const koreanRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣\s]*$/;
    if (koreanRegex.test(value)) {
      setChildName(value);
      setNameError("");
    } else {
      setNameError("이름은 한글만 입력할 수 있습니다.");
    }
  };

  /** 생년월일 입력: 숫자만 허용, 6자리(YYMMDD) */
  const handleBirthChange = (value: string) => {
    const numericOnly = value.replace(/[^0-9]/g, "");
    const limitedValue = numericOnly.slice(0, 6);
    setBirth(limitedValue);

    if (value !== numericOnly) {
      setBirthError("생년월일은 숫자만 입력할 수 있습니다.");
    } else if (limitedValue.length > 0 && limitedValue.length !== 6) {
      setBirthError("생년월일은 6자리여야 합니다.");
    } else {
      setBirthError("");
    }
  };

  /** 휴대폰 번호 입력: 숫자만 허용, 11자리 */
  const handlePhoneChange = (value: string) => {
    const numericOnly = value.replace(/[^0-9]/g, "");
    const limitedValue = numericOnly.slice(0, 11);
    setChildPhone(limitedValue);

    if (value !== numericOnly) {
      setPhoneError("휴대폰 번호는 숫자만 입력할 수 있습니다.");
    } else if (limitedValue.length > 0 && limitedValue.length !== 11) {
      setPhoneError("휴대폰 번호는 11자리여야 합니다.");
    } else {
      setPhoneError("");
    }
  };

  /** 모든 입력 필드 검증 */
  const allChecked =
    childName !== "" &&
    childPhone !== "" &&
    address !== "" &&
    birth !== "" &&
    detailAddress !== "" &&
    nameError === "" &&
    phoneError === "" &&
    birthError === "";

  /** "모두 입력했어요" 버튼 클릭 시 바텀시트 열기 */
  const handleButtonClick = () => {
    setIsPasswordSheetOpen(true);
  };

  /** 비밀번호 입력 완료 시 다음 단계 이동 */
  const handlePasswordComplete = async (password: string) => {
    console.log(selectedChildId)
    try {
      const req = {
        childId: selectedChildId,
        childName,
        childPhone,
        birth,
        address,
        detailAddress,
        password,
      };

      const res = await api.post(requests.submitChildInfo, req);

      if (res.status === 200) {
        setIsPasswordSheetOpen(false);
        console.log("개설완료")
        onNext();
      } else {
        // 서버에서 인증 실패 응답을 받은 경우 에러를 발생시켜 비밀번호 재입력을 유도합니다.
        throw new Error(res.data?.message);
      }
    } catch (err) {
      console.error("자녀 정보 제출 실패:", err);
      // API 호출 실패 또는 인증 실패 시 BottomSheetPassword 컴포넌트의 에러 처리를 트리거하기 위해 에러를 다시 던집니다.
      throw err;
    }
  };

  return (
    <div className="flex flex-col px-[27px] h-full mb-[0px]">
      {/* 제목 영역 */}
      <div className="mt-[43px] mb-[26px] text-left">
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
          {"자녀 정보를 입력해 주세요"}
        </h1>
      </div>

      {/* 입력 필드 영역 */}
      <div className="flex flex-col">
        {/* 이름 */}
        <div>
          <NormalInput2
            label="이름"
            placeholder="홍길동"
            value={childName}
            onChange={handleNameChange}
          />
          <div className="h-[20px] mt-[4px]">
            {nameError && (
              <p className="text-error text-body-08">{nameError}</p>
            )}
          </div>
        </div>

        {/* 휴대폰 번호 */}
        <div>
          <NormalInput2
            label="휴대폰 번호"
            placeholder="01012345678"
            value={childPhone}
            onChange={handlePhoneChange}
          />
          <div className="h-[20px] mt-[4px]">
            {phoneError && (
              <p className="text-error text-body-08">{phoneError}</p>
            )}
          </div>
        </div>

        {/* 생년월일 */}
        <div>
          <NormalInput2
            label="생년월일"
            placeholder="010101"
            value={birth}
            onChange={handleBirthChange}
          />
          <div className="h-[20px] mt-[4px]">
            {birthError && (
              <p className="text-error text-body-08">{birthError}</p>
            )}
          </div>
        </div>

        {/* 집주소 */}
        <div>
          <NormalInput2
            label="집주소"
            placeholder="서울시 영등포구 가마산로 20길"
            value={address}
            onChange={setAddress}
          />
          <div className="h-[20px] mt-[4px]" />
        </div>

        {/* 상세주소 */}
        <div>
          <NormalInput2
            label="상세주소"
            placeholder="1701호"
            value={detailAddress}
            onChange={setDetailAddress}
          />
          <div className="h-[20px] mt-[4px]" />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-[56px] left-1/2 -translate-x-1/2 w-[327px] flex flex-col items-center">
        {allChecked ? (
          <BigButtonActivated
            label="모두 입력했어요"
            onClick={handleButtonClick}
          />
        ) : (
          <BigButtonDisabled label="모두 입력했어요" onClick={() => {}} />
        )}
      </div>

      {/* 비밀번호 바텀시트 (한 번만 설정) */}
      <BottomSheetPassword
        open={isPasswordSheetOpen}
        setOpen={setIsPasswordSheetOpen}
        pinLength={4}
        title="결제 비밀번호 설정"
        onComplete={handlePasswordComplete}
        shouldOverlayBottomBar={true}
      />
    </div>
  );
}
