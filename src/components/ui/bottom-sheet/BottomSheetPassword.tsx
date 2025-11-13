"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { ArrowLeft, X } from "lucide-react";

/**
 * BottomSheetPasswordProps
 * @typedef {Object} BottomSheetPasswordProps
 * @property {boolean} open - 바텀시트의 열림 여부를 제어합니다. `true`일 때 바텀시트가 표시됩니다.
 * @property {(open: boolean) => void} setOpen - 바텀시트의 열림 상태를 변경하는 setter 함수입니다.
 * @property {(pin: string) => void} onComplete - 6자리 비밀번호 입력 완료 시 실행될 콜백 함수입니다.
 * @property {boolean} [shouldOverlayBottomBar] - 하단바를 가릴지 여부. `true`일 때 하단바 위에 표시됩니다. 기본값: `false`
 */
interface BottomSheetPasswordProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onComplete: (pin: string) => void;
  pinLength?: number;
  title?: string;
  shouldOverlayBottomBar?: boolean;
}

/**
 * BottomSheetPassword
 *
 * 사용자가 6자리 간편 비밀번호를 입력할 수 있는 바텀시트 컴포넌트입니다.
 *
 * ### 특징
 * - `open` 상태를 기반으로 아래에서 위로 슬라이드 애니메이션과 함께 표시됩니다.
 * - 배경 클릭 또는 X 버튼 클릭 시 `setOpen(false)`로 닫힙니다.
 * - 상단 핸들바를 아래로 드래그하면 바텀시트가 닫힙니다.
 * - 6자리 입력 완료 시 `onComplete` 콜백이 실행됩니다.
 * - 바텀시트가 열릴 때 뒷 페이지의 스크롤이 방지됩니다.
 *
 * ### 시각적 구성
 * - 반투명 어두운 배경(`bg-neutral-1/50`)
 * - 흰색 바텀시트 컨테이너(`bg-neutral-6`)
 * - 상단 드래그 핸들바
 * - 우측 상단 X 닫기 버튼
 * - 제목("간편비밀번호")
 * - 6개의 비밀번호 입력 표시 동그라미
 * - 숫자 키패드(1-9, 0, 전체삭제, 백스페이스)
 *
 * @component
 * @param {BottomSheetPasswordProps} props - BottomSheetPassword 컴포넌트 속성
 * @returns {React.ReactElement} 바텀시트 요소
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * <BottomSheetPassword
 *   open={open}
 *   setOpen={setOpen}
 *   onComplete={(pin) => {
 *     console.log("입력된 비밀번호:", pin)
 *     setOpen(false)
 *   }}
 * />
 * ```
 */
export function BottomSheetPassword({
  open,
  setOpen,
  onComplete,
  pinLength = 6,
  title = "간편비밀번호",
  shouldOverlayBottomBar = false,
}: BottomSheetPasswordProps) {
  // 입력된 비밀번호를 저장하는 상태
  const [pin, setPin] = useState("");
  // 드래그 시작 Y 좌표
  const [dragStartY, setDragStartY] = useState(0);
  // 드래그 중 현재 Y 좌표
  const [dragCurrentY, setDragCurrentY] = useState(0);
  // 드래그 중인지 여부
  const [isDragging, setIsDragging] = useState(false);

  /**
   * 바텀시트가 열리거나 닫힐 때 실행되는 효과
   * - 열릴 때: 뒷 페이지 스크롤 방지, PIN 초기화
   * - 닫힐 때: 스크롤 복원, 드래그 상태 초기화
   */
  useEffect(() => {
    if (open) {
      // 바텀시트가 열릴 때 뒷 페이지 스크롤 방지
      document.body.style.overflow = "hidden";
      // 바텀시트가 새로 열릴 때마다 PIN 초기화
      setPin("");
    } else {
      // 바텀시트가 닫힐 때 스크롤 복원
      document.body.style.overflow = "";
      // 드래그 상태 초기화
      setDragStartY(0);
      setDragCurrentY(0);
      setIsDragging(false);
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /**
   * 바텀시트의 반투명 배경(backdrop)을 클릭했을 때 닫히도록 하는 이벤트 핸들러입니다.
   * 클릭 이벤트의 타겟이 현재 바텀시트의 최상단 div(`backdrop`)일 경우에만 닫힙니다.
   *
   * @param {React.MouseEvent<HTMLDivElement>} e - 클릭 이벤트 객체
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  /**
   * 터치 시작 이벤트 핸들러
   * 드래그 시작 Y 좌표를 저장하고 드래그 상태를 활성화합니다.
   *
   * @param {React.TouchEvent<HTMLDivElement>} e - 터치 이벤트 객체
   */
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  /**
   * 터치 이동 이벤트 핸들러
   * 드래그 중일 때 현재 Y 좌표와 시작 Y 좌표의 차이를 계산하여
   * 아래 방향으로만 드래그할 수 있도록 합니다.
   *
   * @param {React.TouchEvent<HTMLDivElement>} e - 터치 이벤트 객체
   */
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientY - dragStartY;
    // 아래 방향으로만 드래그 가능
    if (diff > 0) setDragCurrentY(diff);
  };

  /**
   * 터치 종료 이벤트 핸들러
   * 드래그 거리가 100px 이상이면 바텀시트를 닫고,
   * 그렇지 않으면 원래 위치로 복귀합니다.
   */
  const handleTouchEnd = () => {
    if (!isDragging) return;
    // 100px 이상 드래그하면 바텀시트 닫기
    if (dragCurrentY > 100) setOpen(false);
    // 드래그 상태 초기화
    setIsDragging(false);
    setDragStartY(0);
    setDragCurrentY(0);
  };

  /**
   * 숫자 버튼 클릭 이벤트 핸들러
   * 6자리 미만일 때만 숫자를 추가하고,
   * 6자리가 완성되면 onComplete 콜백을 실행합니다.
   *
   * @param {string} num - 클릭된 숫자
   */
  const handleNumberClick = (num: string) => {
    if (pin.length < pinLength) {
      const newPin = pin + num;
      setPin(newPin);
      // 6자리 완성 시 300ms 후 onComplete 실행
      if (newPin.length === pinLength) {
        setTimeout(() => onComplete(newPin), 300);
      }
    }
  };

  /**
   * 백스페이스 버튼 클릭 이벤트 핸들러
   * 마지막 입력된 숫자 하나를 삭제합니다.
   */
  const handleDelete = () => setPin(pin.slice(0, -1));

  /**
   * 전체삭제 버튼 클릭 이벤트 핸들러
   * 입력된 모든 숫자를 삭제합니다.
   */
  const handleReset = () => setPin("");

  // 드래그 중일 때 바텀시트를 Y축으로 이동시키는 스타일
  const sheetStyle = isDragging
    ? { transform: `translateY(${dragCurrentY}px)`, transition: "none" }
    : {};

  // z-index 설정: 하단바를 가릴 경우 z-[60], 아닐 경우 z-50
  const zIndexClass = shouldOverlayBottomBar ? "z-[60]" : "z-50";

  // 하단 여백 설정: 하단바를 가릴 경우 여백 없음, 아닐 경우 하단바 높이만큼 여백
  const bottomMarginClass = shouldOverlayBottomBar ? "" : "mb-[86px]";

  return (
    <div
      className={`fixed inset-0 ${zIndexClass} flex justify-center items-end bg-neutral-1/50 transition-opacity duration-300 ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`w-full max-w-[375px] h-[60vh] relative rounded-t-[24px] bg-neutral-7 pb-[32px] ${bottomMarginClass} shadow-lg transition-transform duration-300 overflow-hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={sheetStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 핸들바 - 드래그하여 바텀시트를 닫을 수 있는 상단 바 */}
        <div className="flex justify-center pt-[12px] pb-[20px]">
          <div className="h-[5px] w-[60px] rounded-full bg-neutral-4/50" />
        </div>

        {/* X 닫기 버튼 - 상단 40px, 오른쪽 30px */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-[40px] right-[30px] text-neutral-2 hover:text-neutral-1"
          aria-label="닫기"
        >
          <X className="w-6 h-6" strokeWidth={2} />
        </button>

        {/* 제목 */}
        <h2 className="text-head-01 text-center text-neutral-1 mt-[40px] mb-[28px] whitespace-pre-line">
          {title}
        </h2>

        {/* 비밀번호 입력 표시 - 6개의 동그라미 */}
        <div className="flex flex-col items-center pt-[16px] pb-[16px]">
          <div className="flex justify-center items-center gap-[18px]">
            {Array.from({ length: pinLength }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border border-neutral-4 ${
                  pin.length > i ? "bg-neutral-4" : "bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 숫자 키패드 */}
        <div className="mx-[20px] mt-[20px] mb-[20px] grid grid-cols-3 gap-x-[16px] gap-y-[20px] py-[7px]">
          {/* 숫자 1-9 버튼 */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="h-[40px] text-head-00 text-neutral-2 rounded-[12px] hover:bg-monochrome-lightgray active:bg-monochrome-gray transition-colors"
            >
              {num}
            </button>
          ))}

          {/* 전체삭제 버튼 - 모든 입력 초기화 */}
          <button onClick={handleReset} className="text-body-04 text-neutral-2">
            전체삭제
          </button>

          {/* 0 버튼 */}
          <button
            onClick={() => handleNumberClick("0")}
            className="h-[40px] text-head-00 text-neutral-2 rounded-[12px] hover:bg-monochrome-lightgray active:bg-monochrome-gray"
          >
            0
          </button>

          {/* 백스페이스 버튼 - 마지막 입력 삭제 */}
          <button
            onClick={handleDelete}
            className="flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-neutral-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 다른 이름으로도 export하여 호환성 유지
export const PasswordBottomSheet = BottomSheetPassword;
