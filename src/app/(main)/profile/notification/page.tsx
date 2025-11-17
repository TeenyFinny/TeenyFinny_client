"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { SwitchThumb } from "@radix-ui/react-switch";

export default function PushSettingPage() {
    const [serviceAlert, setServiceAlert] = useState(false);
    const [nightAlert, setNightAlert] = useState(false);

    return (
        <main className="w-full min-h-screen bg-[var(--color-bg)] font-[var(--font-sans)]">
            {/* 상단 텍스트 */}
            <div className="px-6 mt-9">
                <h1 className="text-head-01 font-bold text-neutral-1 text-left">
                    서비스 알림 설정
                </h1>
                <p className="mt-2 text-body-6 text-neutral-3 text-left">
                    알림을 켜두면 놓치지 않고 확인할 수 있어요.
                </p>
                <p className="text-body-6 text-neutral-3 text-left">
                    밤 10시~아침 7시에도 푸시 알림을 받을 수 있어요.
                </p>
            </div>

            {/* 서비스 알림 박스 */}
            <div className="mt-6 flex justify-center">
                <div className="w-[327px] h-[80px] bg-white rounded-xl flex items-center justify-between px-4">
                    <span className="text-body-5 text-neutral-1 font-semibold">
                        서비스 알림 받기
                    </span>
                    <Switch
  checked={serviceAlert}
  onCheckedChange={setServiceAlert}
  className="relative w-[50px] h-[32px] bg-monochrome-gray data-[state=checked]:bg-primary-1 rounded-full transition-colors duration-200"
>
  <SwitchThumb
    className="block w-[28px] h-[28px] bg-white rounded-full shadow-md transition-transform duration-200"
    style={{
      transform: serviceAlert
        ? "translateX(18px)" // 50 - 28 - 4px padding
        : "translateX(2px)",
    }}
  />
</Switch>
                </div>
            </div>

            {/* 야간 알림 박스 */}
            <div className="mt-6 flex justify-center">
                <div className="w-[327px] h-[80px] bg-white rounded-xl flex items-center justify-between px-5">
                    <span className="text-body-5 text-neutral-1 font-semibold">
                        야간 시간대 알림 받기
                    </span>
                    <Switch
                        checked={nightAlert}
                        onCheckedChange={setNightAlert}
                        className="relative w-[50px] h-[32px] bg-monochrome-gray data-[state=checked]:bg-primary-1 rounded-full transition-colors duration-200"
                    >
                        <SwitchThumb
                            className="block w-[28px] h-[28px] bg-white rounded-full shadow-md transform transition-transform duration-200"
                        />
                    </Switch>
                </div>
            </div>
        </main>
    );
}
