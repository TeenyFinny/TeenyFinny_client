"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChildSummary } from "@/lib/utils/userMapper";

interface ChildrenCarouselProps {
  readonly childAccounts: ChildSummary[];
}

/**
 * 부모 대시보드에서 자녀 계좌 목록을 캐러셀 형태로 렌더링하는 컴포넌트입니다.
 *
 * @param {ChildrenCarouselProps} props - 컴포넌트에 전달되는 속성.
 * @param {ChildSummary[]} props.childAccounts - 캐러셀에 표시할 자녀 계좌 목록.
 * @returns {JSX.Element | null} 자녀 계좌 캐러셀 요소. 자녀 정보가 없으면 null.
 */
const AVATAR_COLORS = [
  "bg-primary-2/10",
  "bg-primary-3/10",
  "bg-primary-4/10",
  "bg-primary-1/10",
] as const;

const pickAvatarColor = (index: number): string =>
  AVATAR_COLORS[index % AVATAR_COLORS.length];

export default function ChildrenCarousel({
  childAccounts,
}: ChildrenCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const normalizedChildren = useMemo(
    () =>
      childAccounts.map((child, index) => ({
        ...child,
        avatarColor: pickAvatarColor(index),
      })),
    [childAccounts]
  );

  const lastIndex = Math.max(normalizedChildren.length - 1, 0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;
    setOffsetX(diff);
    setTouchEnd(currentTouch);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return reset();
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance && currentIndex < lastIndex) {
      setCurrentIndex((i) => Math.min(i + 1, lastIndex));
    } else if (distance < -minSwipeDistance && currentIndex > 0) {
      setCurrentIndex((i) => Math.max(i - 1, 0));
    }
    reset();
  };

  const reset = () => {
    setOffsetX(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (normalizedChildren.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 overflow-hidden">
      <div
        ref={wrapperRef}
        className="h-[217px] flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: `translateX(calc(${offsetX}px - ${currentIndex * 100}%))`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {normalizedChildren.map((child) => (
          <div
            key={child.id}
            className="relative flex min-w-full select-none flex-col gap-4 rounded-2xl bg-primary-1/10 p-6"
          >
            <div className="text-body-05 text-neutral-3">
              {child.name}의 용돈 계좌
            </div>

            <div className="text-head-00 text-neutral-1">
              {child.balance.toLocaleString("ko-KR")} 원
            </div>

            <div
              className="absolute right-8 top-12 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full"
              style={{ backgroundColor: child.avatarColor }}
            >
              <Image
                src="/images/profile/icon_profile_1.png"
                alt={`${child.name} 프로필`}
                width={96}
                height={96}
                className="object-contain"
              />
            </div>

            <button
              className="mt-auto flex items-center justify-end gap-1"
              onClick={() => console.log(`Navigate to ${child.id}`)}
            >
              <span className="text-body-02 text-primary-1">
                상세 내역 보기
              </span>
              <ChevronRight className="size-5 text-primary-1" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        {normalizedChildren.map((child, idx) => (
          <div
            key={child.id}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              idx === currentIndex ? "bg-primary-1" : "bg-neutral-4"
            )}
          />
        ))}
      </div>
    </div>
  );
}
