"use client";

import { useState, useEffect } from "react";
import { BottomSheetPassword } from "@/components/ui/bottom-sheet/BottomSheetPassword";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";

type Step06SimplePasswordProps = Readonly<{
  onComplete: (simplePassword: string) => void;
}>;

export default function Step06SimplePassword({
  onComplete,
}: Step06SimplePasswordProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false);
  const [isConfirmSheetOpen, setIsConfirmSheetOpen] = useState(false);
  const [isPasswordSet, setIsPasswordSet] = useState(false);

  // 컴포넌트 마운트 시 첫 번째 바텀시트 자동 열기
  useEffect(() => {
    setIsPasswordSheetOpen(true);
  }, []);

  const handlePasswordComplete = (pin: string) => {
    setPassword(pin);
    setIsPasswordSet(true);
    setIsPasswordSheetOpen(false);
    // 첫 번째 비밀번호 입력 완료 후 확인 바텀시트 열기
    setTimeout(() => {
      setIsConfirmSheetOpen(true);
    }, 300);
  };

  const handleConfirmComplete = (pin: string) => {
    setConfirm(pin);
    setIsConfirmSheetOpen(false);

    // 비밀번호 확인
    if (pin === password) {
      onComplete(pin);
    } else {
      // 비밀번호가 일치하지 않으면 다시 첫 번째부터 시작
      setPassword("");
      setConfirm("");
      setIsPasswordSet(false);
      setTimeout(() => {
        setIsPasswordSheetOpen(true);
      }, 300);
    }
  };

  const isValid =
    password.length === 6 && confirm.length === 6 && password === confirm;

  const handleNext = () => {
    if (isValid) {
      onComplete(password);
    } else if (isPasswordSet) {
      setIsConfirmSheetOpen(true);
    } else {
      setIsPasswordSheetOpen(true);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="pt-[34px] pb-[10px] text-left">
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
          간편 비밀번호를 등록해 주세요
        </h1>
      </div>
      <div className="pb-[31px] text-left">
        <p className="text-body-05 text-neutral-2 whitespace-pre-line">
          {`간편 비밀번호를 등록하시면\n6자리 숫자 입력으로 로그인 하실 수 있습니다.`}
        </p>
      </div>

      <div className="w-full max-w-[327px] flex flex-col gap-[31px]">
        <div className="flex flex-col">
          <div className="text-body-05 text-neutral-2 mb-2">간편 비밀번호</div>
          <div className="h-[48px] flex items-center px-4 border border-neutral-4 rounded-[10px] bg-neutral-7">
            <span className="text-body-04 text-neutral-1">
              {password ? "●".repeat(6) : "간편 비밀번호를 입력해주세요"}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-body-05 text-neutral-2 mb-2">
            간편 비밀번호 확인
          </div>
          <div className="h-[48px] flex items-center px-4 border border-neutral-4 rounded-[10px] bg-neutral-7">
            <span className="text-body-04 text-neutral-1">
              {confirm ? "●".repeat(6) : "간편 비밀번호를 다시 입력해주세요"}
            </span>
          </div>
          {confirm && confirm !== password && (
            <p className="text-body-08 text-error px-1 mt-1">
              비밀번호가 일치하지 않습니다.
            </p>
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

      {/* 첫 번째 비밀번호 입력 바텀시트 */}
      <BottomSheetPassword
        open={isPasswordSheetOpen}
        setOpen={setIsPasswordSheetOpen}
        onComplete={handlePasswordComplete}
        title="간편 비밀번호"
        shouldOverlayBottomBar={true}
      />

      {/* 비밀번호 확인 바텀시트 */}
      <BottomSheetPassword
        open={isConfirmSheetOpen}
        setOpen={setIsConfirmSheetOpen}
        onComplete={handleConfirmComplete}
        title="간편 비밀번호 확인"
        shouldOverlayBottomBar={true}
      />
    </div>
  );
}
