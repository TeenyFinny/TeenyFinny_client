"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { SwitchThumb } from "@radix-ui/react-switch";

export default function PushSettingPage() {
    const [serviceAlert, setServiceAlert] = useState(false);
    const [nightAlert, setNightAlert] = useState(false);

    return (
        <main className="w-full h-full max-h-[500px]">
            {/* 상단 텍스트 */}
            <div className="px-6 mt-9">
                <h1 className="text-head-01 font-bold text-neutral-1 text-left">
                    서비스 알림 설정
                </h1>
                <p className="mt-2 text-body-6 text-neutral-3 text-left leading-tight">
                    알림을 켜두면 놓치지 않고 확인할 수 있어요.
                    <br />
                    밤 10시~아침 7시에도 푸시 알림을 받을 수 있어요.
                </p>
            </div>

            {/* 서비스 알림 박스 */}
            <div className="mt-6 flex justify-center">
                <div className="w-[327px] h-[80px] bg-white rounded-xl flex items-center justify-between px-5">
                    <span className="text-body-5 text-neutral-1 font-semibold">
                        서비스 알림 받기
                    </span>
                    <Switch
                        checked={serviceAlert}
                        onCheckedChange={setServiceAlert}
                    />

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
                    />
                </div>
            </div>
        </main>
    );
}
