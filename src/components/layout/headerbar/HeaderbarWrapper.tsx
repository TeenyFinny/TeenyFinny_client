"use client";

import { useRouter } from "next/navigation";
import { HeaderBar } from "./HeaderBar";
import { useState } from "react";
import { TitleOnlyDialog } from "@/components/ui/modal/TitleOnlyDialog";
import { useUserStore } from "@/store/userStore";

/**
 * @typedef HeaderbarWrapperProps
 * @property {() => void} [onBack] - 상위에서 주입할 수 있는 선택적 뒤로가기 콜백
 */
type HeaderbarWrapperProps = Readonly<{
  onBack?: () => void;
}>;

const HeaderbarWrapper = ({ onBack }: HeaderbarWrapperProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { userType } = useUserStore();

  /**
   * 뒤로가기 처리
   * - onBack prop이 전달되면 해당 콜백을 우선 실행
   * - 그렇지 않으면 window.history 길이에 따라 router.back() 또는 router.push("/")
   */
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (typeof window !== "undefined" && window.history.length > 1)
      router.back();
    else router.push("/");
  };

  const handleNotification = () => {
    if (userType) {
      router.push("/notice");
    } else {
      setOpen(true);
    }
  };

  return (
    <div>
      <HeaderBar
        onBackClick={handleBack}
        onNotificationClick={handleNotification}
      />

      {open ? (
        <TitleOnlyDialog
          open={open}
          onOpenChange={(v) => setOpen(v)}
          title="로그인 후 사용해주세요."
          confirmText="확인"
          onConfirm={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
};

export default HeaderbarWrapper;
