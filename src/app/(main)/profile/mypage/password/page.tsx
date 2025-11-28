"use client";

import { useState, useMemo } from "react";
import { PasswordInput } from "@/components/ui/input/PasswordInput";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";
import { isValidPassword } from "@/lib/utils/validators";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notificationStore";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";

/**
 * ChangePasswordPage
 *
 * 비밀번호 변경 화면 컴포넌트입니다.
 * - 현재 비밀번호 입력
 * - 새 비밀번호 입력(8자리 + 특수문자)
 * - 새 비밀번호 확인
 * - 변경 성공 시 알림(PushNotification) 전달 후 `/profile`로 이동합니다.
 *
 * @returns {JSX.Element} 비밀번호 변경 UI를 렌더링합니다.
 */
export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setMessage } = useNotificationStore();

  // 현재 비밀번호 검증
  const currentPwValid = currentPw.length === 0 || currentPw.length >= 8;

  // 현재 비밀번호 에러 표시 조건
  const showCurrentPwError = currentPw.length > 0 && currentPw.length < 8;

  /** 새 비밀번호 복잡도 검사 (8자 + 특수문자) */
  const newPwValid = useMemo(() => {
    if (!submitted && !newPw) return true;
    return isValidPassword(newPw);
  }, [newPw, submitted]);

  /** 새 비밀번호 확인 */
  const confirmPwValid = useMemo(() => {
    if (!submitted && !confirmPw) return true;
    return confirmPw === newPw && isValidPassword(confirmPw);
  }, [confirmPw, newPw, submitted]);

  const allValid = currentPwValid && newPwValid && confirmPwValid && currentPw !== newPw;


  /** 제출 */
  const handleSubmit = async () => {
    setSubmitted(true);

    if (!allValid) return;

    try {
      const payload = {
        currentPassword: currentPw,
        newPassword: newPw,
      };

      await api.patch(requests.passwordRequest, payload);

      setMessage("비밀번호가 변경되었습니다.");
      router.push("/profile");
            
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "비밀번호 변경에 실패했습니다.");
    }
  };


  return (
    <main className="flex flex-col px-[27px]">
      {/* 제목 */}
      <section className="pt-[36px]">
        <h1 className="text-head-01 text-neutral-1 pb-[10px]">비밀번호 변경</h1>
        <p className="text-body-06 text-neutral-3 whitespace-pre-line">
          비밀번호는 특수문자 포함 8자리 이상이어야 합니다.
        </p>
      </section>

      {/* 입력 */}
      <section className="flex flex-col gap-[24px] pt-[42px]"> 
        <div className="flex flex-col">
          <PasswordInput
            label="현재 비밀번호"
            value={currentPw}
            onChange={setCurrentPw}
            placeholder="현재 비밀번호 입력"
          />
          {showCurrentPwError && (
            <p className="text-error text-body-03 pl-4 pt-1">
              현재 비밀번호를 입력해주세요.
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <PasswordInput
            label="새 비밀번호"
            value={newPw}
            onChange={setNewPw}
            placeholder="8자리 이상 + 특수문자 포함"
          />
          {!newPwValid && (
          <p className="text-error text-body-03 pl-4 pt-1">
            8자리 이상이며 특수문자를 1개 이상 포함해야 합니다.
          </p>
          )}
        </div>

        <div className="flex flex-col">
          <PasswordInput
            label="새 비밀번호 확인"
            value={confirmPw}
            onChange={setConfirmPw}
            placeholder="새 비밀번호 다시 입력"
          />
          {!confirmPwValid && (
            <p className="text-error text-body-03 pl-4 pt-1">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>
      </section>

      {/* 버튼 */}
      <section className="fixed bottom-[134px] w-full max-w-[327px]">
        {allValid ? (
          <BigButtonActivated label="확인" onClick={handleSubmit} />
        ) : (
          <BigButtonDisabled label="확인" onClick={handleSubmit} />
        )}
      </section>
    </main>
  );
}
