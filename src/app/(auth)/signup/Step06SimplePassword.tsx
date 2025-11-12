"use client";

import { useState, useMemo } from "react";
import { PasswordInput } from "@/components/ui/input/PasswordInput";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";

type Step06SimplePasswordProps = Readonly<{
  onComplete: (simplePassword: string) => void;
  onNext: () => void;
}>;

export default function Step06SimplePassword({
  onComplete,
  onNext,
}: Step06SimplePasswordProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const passwordError = useMemo(() => {
    if (!submitted && !password) return undefined;
    if (password.length < 6) return "비밀번호는 6자리 숫자여야 합니다.";
    if (!/^[0-9]+$/.test(password)) return "숫자만 입력 가능합니다.";
    return undefined;
  }, [password, submitted]);

  const confirmError = useMemo(() => {
    if (!submitted && !confirm) return undefined;
    if (confirm !== password) return "비밀번호가 일치하지 않습니다.";
    return undefined;
  }, [password, confirm, submitted]);

  const isValid =
    !passwordError &&
    !confirmError &&
    password.length === 6 &&
    password === confirm;

  const handleNext = () => {
    setSubmitted(true);
    if (isValid) {
      onComplete(password);
      onNext();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="pt-[34px] pb-[10px] text-left">
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">간편 비밀번호를 등록해 주세요</h1>
      </div>
      <div className="pb-[31px] text-left">
        <p className="text-body-05 text-neutral-2 whitespace-pre-line">
          간편 비밀번호를 등록하시면 <br /> 6자리 숫자 입력으로 로그인 하실 수 있습니다.
        </p>
      </div>

      <div className="w-full max-w-[327px] flex flex-col gap-[31px]">
        <div className="flex flex-col">
          <PasswordInput
            label="간편 비밀번호"
            value={password}
            onChange={setPassword}
          />
          {passwordError && (
            <p className="text-body-08 text-error px-1">{passwordError}</p>
          )}
        </div>

        <div className="flex flex-col">
          <PasswordInput
            label="간편 비밀번호 확인"
            value={confirm}
            onChange={setConfirm}
          />
          {confirmError && (
            <p className="text-body-08 text-error px-1">{confirmError}</p>
          )}
        </div>
      </div>

      <div className="fixed bottom-[56px] w-full max-w-[327px]">
        {isValid ? (
          <BigButtonActivated label="다음" onClick={handleNext} />
        ) : (
          <BigButtonDisabled label="다음" onClick={handleNext} />
        )}
      </div>
    </div>
  );
}
