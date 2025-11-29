"use client";

import { useState, useMemo } from "react";
import { PasswordInput } from "@/components/ui/input/PasswordInput";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notificationStore";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";

export default function SimplePasswordRegisterPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setMessage } = useNotificationStore();

  /** 6자리 숫자 검증 */
  const passwordValid = useMemo(() => {
    if (!submitted && !password) return true;
    return /^[0-9]{6}$/.test(password);
  }, [password, submitted]);

  /** 일치 검증 */
  const confirmValid = useMemo(() => {
    if (!submitted && !confirm) return true;
    return password === confirm;
  }, [password, confirm, submitted]);

  const isValid = /^[0-9]{6}$/.test(password) && password === confirm;

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!isValid) return;

    try {
      const payload = {
        simplePassword: password,
      };

      await api.patch(requests.simplePassword, payload);

      setMessage("간편 비밀번호가\n변경되었습니다.");
      router.push("/profile");
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "비밀번호 변경에 실패했습니다."
      );
    }
  };

  return (
    <main className="flex flex-col px-[27px]">
      {/* 제목 */}
      <section className="pt-[36px]">
        <h1 className="text-head-01 text-neutral-1 pb-[10px]">
          간편 비밀번호 변경
        </h1>
        <p className="text-body-06 text-neutral-3 whitespace-pre-line">
          간편 비밀번호는 숫자 6자리 입니다.
        </p>
      </section>

      {/* 입력 */}
      <section className="flex flex-col gap-[24px] pt-[42px]">
        <div className="flex flex-col">
          <PasswordInput
            label="간편 비밀번호"
            value={password}
            onChange={setPassword}
            placeholder="6자리 숫자"
          />
          {submitted && !passwordValid && (
            <p className="text-error text-body-03 pl-4 pt-1">
              6자리 숫자를 입력해주세요.
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <PasswordInput
            label="간편 비밀번호 확인"
            value={confirm}
            onChange={setConfirm}
            placeholder="6자리 숫자"
          />
          {submitted && !confirmValid && (
            <p className="text-error text-body-03 pl-4 pt-1">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>
      </section>

      {/* 하단 버튼 */}
      <section className="fixed bottom-[134px] w-full max-w-[327px]">
        {isValid ? (
          <BigButtonActivated label="확인" onClick={handleSubmit} />
        ) : (
          <BigButtonDisabled label="확인" onClick={handleSubmit} />
        )}
      </section>
    </main>
  );
}
