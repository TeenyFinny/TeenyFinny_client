"use client";

import { useState, useEffect } from "react";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";
import { PhoneNumberInput } from "@/components/custom/allowance/checking/PhoneNumberInput";
import { ResidentNumberInput } from "@/components/custom/allowance/checking/ResidentNumberInput";
import NameInput from "@/components/custom/allowance/checking/NameInput";
import Image from "next/image";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useRegisterStore } from "@/store/registerStore";
import VerificationForm from "@/components/custom/verification/VerificationForm";
/**
 * Step03CardAuth
 *
 * 카드 발급 절차 중 본인인증 정보를 입력받는 페이지 컴포넌트입니다.
 *
 * ### 주요 기능
 * - 이용 중인 통신사, 휴대폰 번호, 주민등록번호, 이름을 입력받습니다.
 * - 모든 입력이 올바르게 완료되어야 다음 단계로 이동할 수 있습니다.
 * - 입력 검증 로직:
 *   - 휴대폰 번호: 11자리 숫자만 허용
 *   - 주민등록번호: 앞 6자리 + 뒤 1자리 숫자만 허용
 *   - 이름: 한글만 허용 (NameInput 내부에서 처리)
 * - 입력이 모두 유효할 때만 "다음" 버튼이 활성화됩니다.
 *
 * ### 시각적 구성
 * - 상단: 타이틀 ("이용중인 통신사 정보와\n휴대폰번호를 입력해 주세요")
 * - 중간: 통신사 선택 + 휴대폰 번호 입력, 주민등록번호 입력, 이름 입력 필드
 * - 하단: 다음 버튼 (활성화/비활성 상태에 따라 다른 컴포넌트 렌더링)
 *
 * @component
 * @param {Step03CardAuthProps} props - `onNext` 콜백을 전달받아 다음 단계로 이동할 수 있습니다.
 * @returns {React.ReactElement} 카드 본인인증 입력 페이지 UI
 *
 * @example
 * ```tsx
 * <Step03CardAuth onNext={() => setStep(4)} />
 * ```
 */
interface Step03CardAuthProps {
  onNext: () => void;
}

export default function Step03CardAuth({ onNext }: Step03CardAuthProps) {
    const { form, setField } = useRegisterStore();
  
    const handleSuccess = () => {
      onNext();
    };
  
    return (
      <div className="px-[27px]">
        <VerificationForm
          mode="verify"
          onSuccess={handleSuccess}
          setField={setField as (key: string, value: any) => void}
        />
      </div>
    );
}
