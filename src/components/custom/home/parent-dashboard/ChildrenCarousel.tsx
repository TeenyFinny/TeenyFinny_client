"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChildSummary } from "@/types/user";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { BottomSheetPassword } from "@/components/ui/bottom-sheet/BottomSheetPassword";
import { useRouter } from "next/navigation";

interface ChildrenCarouselProps {
  /** 표시할 자녀 계좌 목록 */
  readonly childAccounts: ChildSummary[];
}

/**
 * ChildrenCarousel
 *
 * 부모 대시보드에서 자녀 계좌들을 캐러셀 형태로 보여주는 컴포넌트입니다.
 * - 마지막 슬라이드는 "자녀 추가하기" 카드로 구성됩니다.
 * - 좌우 스와이프를 통해 자녀 간 이동이 가능합니다.
 * - 마지막 카드 클릭 시 간편 비밀번호 BottomSheet가 열리고,
 *   인증 성공 시 가족 등록 페이지(/family)로 이동합니다.
 *
 * @param {ChildrenCarouselProps} props - 자녀 목록
 * @returns {JSX.Element} 캐러셀 UI
 */
export default function ChildrenCarousel({
  childAccounts,
}: ChildrenCarouselProps) {
  const router = useRouter();

  /**
   * 🔹 캐러셀 슬라이드 목록 구성
   * - 자녀 카드들 + 마지막 "자녀 추가하기" 카드
   */
  const extendedSlides = useMemo(() => {
    return [
      ...childAccounts.map((c) => ({
        ...c,
        isAddCard: false,
      })),
      { isAddCard: true } as any,
    ];
  }, [childAccounts]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);

  const minSwipeDistance = 50;
  const lastIndex = extendedSlides.length - 1;

  /**
   * 🔹 간편 비밀번호 바텀시트 상태
   */
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  /**
   * 간편 비밀번호 인증 완료 핸들러
   *
   * @param {string} simplePassword - 입력된 간편 비밀번호
   */
  const handlePasswordComplete = async (simplePassword: string) => {
    try {
      const res = await api.post(requests.verifySimplePassword, {
        simplePassword,
      });

      if (res.data?.matched === true) {
        setOpenPasswordModal(false);
        router.push("/family");
      } else {
        throw new Error("간편 비밀번호가 일치하지 않습니다.");
      }
    } catch (err) {
      console.error("간편 비밀번호 인증 실패:", err);
      throw new Error("간편 비밀번호 인증에 실패했습니다.");
    }
  };

  /**
   * 🔹 터치 시작 이벤트
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  /**
   * 🔹 터치 이동 이벤트
   * - 이동 거리(diff)를 offsetX로 적용해 자연스러운 슬라이드 이동 효과 제공
   */
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;
    setOffsetX(diff);
    setTouchEnd(currentTouch);
  };

  /**
   * 🔹 터치 종료 이벤트 (스와이프 판정)
   */
  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return reset();

    const distance = touchStart - touchEnd;

    // 오른쪽으로 스와이프 → 다음 슬라이드
    if (distance > minSwipeDistance && currentIndex < lastIndex) {
      setCurrentIndex((i) => Math.min(i + 1, lastIndex));
    }
    // 왼쪽으로 스와이프 → 이전 슬라이드
    else if (distance < -minSwipeDistance && currentIndex > 0) {
      setCurrentIndex((i) => Math.max(i - 1, 0));
    }

    reset();
  };

  /**
   * 🔹 터치 상태 초기화
   */
  const reset = () => {
    setOffsetX(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="flex flex-col gap-3 overflow-hidden">
      {/* 슬라이드 래퍼 */}
      <div
        className="h-[217px] flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: `translateX(calc(${offsetX}px - ${currentIndex * 100}%))`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {extendedSlides.map((item, idx) => {
          /**
           * ─────────────────────────────────────────────
           * ▶ 마지막 "자녀 추가하기" 카드
           * ─────────────────────────────────────────────
           */
          if (item.isAddCard) {
            return (
              <div key="add-child-card" className="min-w-full flex">
                <button
                  className="relative w-full h-[217px] rounded-2xl bg-primary-1/10"
                  onClick={() => setOpenPasswordModal(true)}
                >
                  <span className="absolute top-6 left-6 text-body-05 text-neutral-3">
                    자녀 추가하기
                  </span>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center">
                      <Plus className="size-8 text-neutral-3" />
                    </div>
                  </div>
                </button>
              </div>
            );
          }

          /**
           * ─────────────────────────────────────────────
           * ▶ 일반 자녀 카드
           * ─────────────────────────────────────────────
           */
          const avatarImage =
            Number(item.gender) === 1
              ? "/images/profile/icon_profile_2.png"
              : "/images/profile/icon_profile_1.png";

          return (
            <div
              key={item.userId}
              className="relative flex min-w-full flex-col gap-4 select-none rounded-2xl bg-primary-1/10 p-6"
            >
              <div className="text-body-05 text-neutral-3">
                {item.name}의 용돈 계좌
              </div>

              <div className="text-head-00 text-neutral-1">
                {item.balance.toLocaleString("ko-KR")} 원
              </div>

              <div className="absolute right-8 top-12 flex h-24 w-24 items-center justify-center rounded-full bg-primary-4 overflow-hidden">
                <Image
                  src={avatarImage}
                  alt={`${item.name} 프로필`}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>

              <button
                className="mt-auto flex items-center justify-end gap-1"
                onClick={() =>
                  router.push(`/account?childId=${Number(item.userId)}`)
                }
              >
                <span className="text-body-02 text-primary-1">
                  상세 내역 보기
                </span>
                <ChevronRight className="size-5 text-primary-1" />
              </button>
            </div>
          );
        })}
      </div>

      {/* 인디케이터 */}
      <div className="flex items-center justify-center gap-2">
        {extendedSlides.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              idx === currentIndex ? "bg-primary-1" : "bg-neutral-4"
            )}
          />
        ))}
      </div>

      {/* 간편 비밀번호 BottomSheet */}
      <BottomSheetPassword
        open={openPasswordModal}
        setOpen={setOpenPasswordModal}
        onComplete={handlePasswordComplete}
        title="간편 비밀번호"
        shouldOverlayBottomBar={true}
      />
    </div>
  );
}
