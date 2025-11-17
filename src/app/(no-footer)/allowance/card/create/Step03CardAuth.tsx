"use client"

import { useState, useEffect } from "react"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"
import { PhoneNumberInput } from "@/components/custom/allowance/checking/PhoneNumberInput"
import { ResidentNumberInput } from "@/components/custom/allowance/checking/ResidentNumberInput"
import NameInput from "@/components/custom/allowance/checking/NameInput"
import Image from "next/image"
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
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
  onNext: () => void
}

export default function Step03CardAuth({ onNext }: Step03CardAuthProps) {
  const [carrier, setCarrier] = useState("SKT"); // 선택된 통신사 (기본값: "SKT")
    const [phoneNumber, setPhoneNumber] = useState(""); // 입력된 휴대폰 번호 (11자리 숫자)
    const [birthFront, setBirthFront] = useState(""); // 주민등록번호 앞 6자리 (생년월일)
    const [birthBack, setBirthBack] = useState(""); // 주민등록번호 뒷자리 첫번째 숫자 (성별 구분)
    const [name, setName] = useState(""); // 입력된 이름
    const [message, setMessage] = useState(""); // API 응답으로 받은 메시지 (인증 결과 안내 텍스트)
    const [success, setSuccess] = useState<boolean | null>(null); // 인증 성공 여부 (true: 성공, false: 실패, null: 초기 상태)
    const [loading, setLoading] = useState(false); // API 인증 요청 진행 중 여부 (true일 때 로딩 표시)
  
    /**
     * 인증 성공 시 자동으로 다음 단계로 이동시키는 effect
     */
    useEffect(() => {
      if (success) {
        const timerId = setTimeout(onNext, 1000);
        return () => clearTimeout(timerId);
      }
    }, [success, onNext]);
  
    /**
     * "다음" 버튼 활성화 조건
     * - 휴대폰 번호 11자리 입력 완료
     * - 주민등록번호 앞자리 6자리 입력 완료
     * - 주민등록번호 뒷자리 1자리 입력 완료
     * - 이름 1자 이상 입력 완료
     */
    const isButtonEnabled =
      phoneNumber.length === 11 &&
      birthFront.length === 6 &&
      birthBack.length === 1 &&
      name.length > 0;
    /**
     * 본인인증 API 요청을 처리하는 함수입니다.
     *
     * ### 동작 흐름
     * 1. 로딩 상태를 `true`로 설정하여 "인증 중..." 메시지 표시
     * 2. 이전 인증 결과 메시지와 상태를 초기화
     * 3. 입력된 정보를 서버로 POST 요청 전송
     * 4. 응답의 `verified` 필드를 확인:
     *    - `true`: 성공 상태로 변경하고 1초 후 `onNext()` 호출
     *    - `false`: 실패 상태로 변경하고 오류 메시지 표시
     * 5. 에러 발생 시 콘솔에 로그 출력
     *
     * @async
     * @function handleSubmit
     * @returns {Promise<void>}
     */
    const handleSubmit = async () => {
      setLoading(true);
      setMessage("");
      setSuccess(null);
      try {
        const req = {
          carrier,
          phoneNumber,
          birthFront,
          birthBack,
          name,
        };
  
        const res = await api.post(requests.verifyPhoneNumber, req);
  
        if (res.data?.verified) {
          setSuccess(true);
        } else {
          setSuccess(false);
        }
        setMessage(res.data?.message);
      } catch (err) {
        console.error(err);
        setSuccess(false);
        setMessage("인증 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="flex flex-col h-full px-[27px]">
        {/* 타이틀 */}
        <div className="mt-[15px] mb-[20px] text-left">
          <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
            {"이용중인 통신사 정보와\n휴대폰번호를 입력해 주세요"}
          </h1>
        </div>
  
        {/* 통신사 + 번호 */}
        <PhoneNumberInput
          label="휴대폰 번호"
          carrier={carrier}
          phoneNumber={phoneNumber}
          onCarrierChange={setCarrier}
          onPhoneNumberChange={setPhoneNumber}
        />
  
        {/* 주민등록번호 */}
        <ResidentNumberInput
          label="주민등록번호"
          front={birthFront}
          back={birthBack}
          onFrontChange={setBirthFront}
          onBackChange={setBirthBack}
        />
  
        {/* 이름 */}
        <NameInput value={name} onChange={setName} />
  
        {/* 버튼 */}
        <div className="fixed bottom-[56px] left-1/2 -translate-x-1/2 w-[327px]">
          {/* 로딩 중 표시 */}
          {loading && (
            <div className="mb-[19px] flex items-center justify-center gap-[8px] text-body-01 text-neutral-3">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-neutral-3 border-t-transparent" />
              <span>인증 중...</span>
            </div>
          )}
  
          {/* 인증 완료 메시지 */}
          {!loading && message && (
            <div className="mb-[19px] flex items-center justify-center text-body-01 text-neutral-1">
              {success ? (
                <Image /* 인증 성공 시 초록색 체크 아이콘 */
                  src="/icons/check-green.png"
                  alt="응답확인"
                  width={27}
                  height={27}
                />
              ) : (
                <Image /* 인증 실패 시 빨간색 체크 아이콘 */
                  src="/icons/check.png"
                  alt="응답확인"
                  width={27}
                  height={27}
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(51%) sepia(65%) saturate(4181%) hue-rotate(332deg) brightness(94%) contrast(99%)",
                  }}
                />
              )}
              <span>{message}</span>
            </div>
          )}
          {isButtonEnabled ? (
            <BigButtonActivated label="다음" onClick={handleSubmit} />
          ) : (
            <BigButtonDisabled label="다음" onClick={() => {}} />
          )}
        </div>
      </div>
    );
}
