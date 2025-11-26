"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useRouter } from "next/navigation";
import { PhoneNumberInput } from "@/components/custom/allowance/checking/PhoneNumberInput";
import { ResidentNumberInput } from "@/components/custom/allowance/checking/ResidentNumberInput";
import NameInput from "@/components/custom/allowance/checking/NameInput";
import Image from "next/image";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";
import { useUserStore } from "@/store/userStore";

export default function VerifyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [carrier, setCarrier] = useState("SKT");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthFront, setBirthFront] = useState("");
  const [birthBack, setBirthBack] = useState("");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const userId = useUserStore((state) => state.userId);

  // userId가 없을 때 리다이렉트 처리
  useEffect(() => {
    if (!userId) {
      router.push("/");
    }
  }, [userId, router]);

  // userId가 없으면 아무것도 렌더링하지 않음
  if (!userId) {
    return (
      <div className="flex flex-col h-full px-[27px] items-center justify-center">
        <p className="text-body-01 text-neutral-3">로딩 중...</p>
      </div>
    );
  }

  /**
   * 인증 성공 시 자동으로 마이페이지로 이동시키는 effect
   */
  const onNext = useCallback(() => {
    router.push("/profile/mypage");
  }, [router]);

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
        name,
        phoneNumber,
      };

      if (!userId) {
        setMessage("사용자 ID가 없습니다.");
        setSuccess(false);
        return;
      }

      const res = await api.patch(requests.updateProfileInfo(userId), req);

      if (res.data?.isSuccess) {
        setSuccess(true);
        useUserStore.getState().updateUser(name);
      } else {
        setSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setSuccess(false);
      setMessage(
        "정보 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full px-[27px]">
      {/* 타이틀 */}
      <div className="mt-[43px] mb-[24px] text-left">
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
          <BigButtonActivated label="확인" onClick={handleSubmit} />
        ) : (
          <BigButtonDisabled label="확인" onClick={() => {}} />
        )}
      </div>
    </div>
  );
}
