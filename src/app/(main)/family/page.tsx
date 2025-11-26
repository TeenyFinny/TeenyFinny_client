// src/app/(main)/family/page.tsx
"use client";

import { useUserStore } from "@/store/userStore";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import ParentOtpSection from "@/components/custom/family/ParentOtpSection";
import ChildOtpSection from "@/components/custom/family/ChildOtpSection";
import { useParentOtp } from "./hooks/useParentOtp";
import { useChildOtp } from "./hooks/useChildOtp";
import { TitleOnlyDialog } from "@/components/ui/modal/TitleOnlyDialog";
import Image from "next/image";

export default function FamilyPage() {
  const { userType } = useUserStore();
  const isParent = userType === "parent";
  const isChild = userType === "child";

  const parent = useParentOtp(isParent);
  const child = useChildOtp(isChild);

  const handleConfirm = () => {
    if (isParent) parent.goHome();
    else if (isChild) child.submit();
  };

  return (
    <>
      <main className="px-6 overflow-y-auto">
        <section className="flex flex-col">
          <div className="pt-[36px] pb-[10px] flex items-center">
            <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
              가족 등록
            </h1>

            {isParent && (
              <button
                onClick={parent.refresh}
                disabled={parent.isLoading}
                className="ml-[5px] disabled:opacity-50"
              >
                <Image
                  src="/icons/refresh.png"
                  alt="refresh"
                  width={24}
                  height={24}
                  className={parent.isLoading ? "animate-spin" : ""}
                />
              </button>
            )}
          </div>

          <p className="text-body-06 text-neutral-3 whitespace-pre-line pb-[140px]">
            {isParent
              ? "자녀 계정에서 아래 인증 번호를 입력해주세요."
              : "부모 계정에서 받은 인증 번호를 입력해주세요."}
          </p>
        </section>

        {/* 에러 영역 */}
        <div className="h-[32px] flex items-center justify-center">
          {parent.error || child.error ? (
            <p className="text-body-08 text-error">
              {parent.error || child.error}
            </p>
          ) : null}
        </div>

        {isParent ? (
          <ParentOtpSection otp={parent.otp} />
        ) : (
          <ChildOtpSection
            value={child.value}
            onChange={child.onChange}
            error={child.inputError}
          />
        )}

        <div className="max-w-[327px]">
          <BigButtonActivated
            label={isChild && child.isSubmitting ? "인증 중..." : "확인"}
            onClick={handleConfirm}
          />
        </div>
      </main>
      {/* 자녀 OTP 실패 모달 */}
      <TitleOnlyDialog
        open={child.dialogOpen}
        onOpenChange={child.setDialogOpen}
        title={child.dialogText}
        confirmText="확인"
        onConfirm={() => child.setDialogOpen(false)}
      />
    </>
  );
}
