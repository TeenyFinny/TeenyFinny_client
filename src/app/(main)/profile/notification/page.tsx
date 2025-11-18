"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests";

export default function PushSettingPage() {
    const [push_enabled, setPushEnabled] = useState(false);
    const [night_push_enabled, setNightPushEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const userId = 1

    // -------------------------------
    // 페이지 진입 시 GET
    // -------------------------------
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get(`${requests.fetchProfile}/pushes?user_id=${userId}`);
                const data = res.data;
                console.log(data)
                setPushEnabled(data.push_enabled);
                setNightPushEnabled(data.night_push_enabled);
            } catch (err) {
                console.error("알림 설정 불러오기 실패:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // -------------------------------
    // 토글 핸들러
    // -------------------------------
    const handleToggle = async (
        key: "push_enabled" | "night_push_enabled",
        value: boolean,
        setter: (v: boolean) => void
    ) => {
        const prev = !value;
        setter(value); // UI 즉시 반영

        try {
            await api.patch(
                `${requests.fetchProfile}/pushes/${userId}`,
                { [key]: value }
            );
        } catch (err) {
            console.error("PATCH 실패:", err);
            setter(prev); // 실패 시 롤백
        }
    };

    if (loading) return <p className="text-center mt-10">로딩 중...</p>;

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
                        checked={push_enabled}
                        onCheckedChange={(v) =>
                            handleToggle("push_enabled", v, setPushEnabled)
                        }
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
                        checked={night_push_enabled}
                        onCheckedChange={(v) =>
                            handleToggle("night_push_enabled", v, setNightPushEnabled)
                        }
                    />
                </div>
            </div>
        </main>
    );
}
