"use client";

import { useState } from "react";
import Image from "next/image";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";
import { NormalInput2 } from "@/components/ui/input/NormalInput2";
import { BottomSheetPassword } from "@/components/ui/bottom-sheet/BottomSheetPassword";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { HttpError } from "@/types/axios/httpError.t";
import { useSelectedChildStore } from "@/store/selectedChildStore";

/**
 * Step04CardOptions
 *
 * 카드 발급 절차 중 카드 디자인, 영문 이름, 교통카드 사용 여부를 선택하는 페이지 컴포넌트입니다.
 *
 * ### 주요 기능
 * - 카드 디자인 선택: 곰 카드와 토끼 카드 중 하나를 선택할 수 있습니다.
 * - 영문 이름 입력: 영어 대문자와 공백만 허용되며, 소문자 입력 시 자동으로 대문자로 변환됩니다.
 * - 교통카드 사용 여부 선택: "교통카드로 사용할래요" / "안할래요" 중 하나를 선택할 수 있습니다.
 * - 모든 입력이 유효해야 "다음" 버튼이 활성화됩니다.
 *
 * ### 입력 검증 로직
 * - 영문 이름: 영어와 공백만 입력 가능, 반드시 성과 이름 사이에 공백 포함
 * - 카드 디자인과 교통카드 여부는 기본 선택 상태 존재
 *
 * ### 시각적 구성
 * - 상단: 타이틀 ("신청하실 카드의\n서비스를 선택해 주세요")
 * - 카드 디자인: 두 가지 카드 이미지와 선택 상태를 나타내는 체크 아이콘
 * - 영문 이름 입력: 입력 필드와 안내 문구 ("성과 이름을 띄워서 써주세요")
 * - 교통카드 여부: 두 가지 선택 버튼
 * - 하단: 다음 버튼 (활성/비활성 상태)
 *
 * @component
 * @param {{ onNext: () => void, childId: number }} props
 *   - `onNext`: 다음 단계로 이동하는 콜백
 *   - `childId`: 발급할 카드의 자녀 ID
 *
 * @returns {React.ReactElement} 카드 옵션 선택 페이지 UI
 *
 * @example
 * ```tsx
 * <Step04CardOptions childId={3} onNext={() => setStep(5)} />
 * ```
 */

export default function Step04CardOptions({
  onNext,
}: {
  onNext: () => void;
}) {
  const { selectedChildId } = useSelectedChildStore();
  const [selectedCard, setSelectedCard] = useState<"bear" | "rabbit">("bear");
  const [englishName, setEnglishName] = useState("");
  const [nameError, setNameError] = useState("");
  const [useTransitCard, setUseTransitCard] = useState<"yes" | "no">("yes");

  // 비밀번호 바텀시트
  const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false);

  /** 영문 이름 입력 검증 로직 */
  const handleNameChange = (value: string) => {
    const englishRegex = /^[a-zA-Z\s]*$/;

    if (!englishRegex.test(value)) {
      setNameError("영문과 공백만 입력 가능합니다.");
      return;
    }

    setEnglishName(value.toUpperCase());
    setNameError("");
  };

  /** 버튼 활성 조건 */
  const isButtonEnabled =
    englishName.trim() !== "" &&
    englishName.includes(" ") &&
    !nameError;

  /** 비밀번호 입력 완료 시 API 호출 */
const handlePasswordComplete = async (password: string) => {
  setIsPasswordSheetOpen(false);

    try {
      const res = await api.post(requests.submitCardInfo, {
        childId: selectedChildId,
        cardType: selectedCard,
        englishName,
        transit: useTransitCard === "yes",
        password,
      });

      // 카드 발급 성공 → 다음 단계로 이동
      onNext();

      // 실패 조건: 응답 body에 message 존재할 때만
      if (res?.data?.message) {
        console.warn("에러 메시지 감지! → 비밀번호 재입력");
        setIsPasswordSheetOpen(true);
        return;
      }
      
    } catch (err) {
      if (err instanceof HttpError) {
        console.error("카드 발급 실패:", err.message);
      }
      throw err; // BottomSheetPassword에서 실패 UI 처리
    }
  };

  /** 다음 버튼 → 비밀번호 바텀시트 오픈 */
  const handleNext = () => {
    setIsPasswordSheetOpen(true);
  };

  return (
    <div className="relative flex flex-col h-full">
      {/* 스크롤 가능한 영역 */}
      <div className="flex-1 overflow-y-auto px-[24px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* 타이틀 */}
        <div className="mt-[43px] mb-[24px] text-left">
          <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
            {"신청하실 카드의\n서비스를 선택해 주세요"}
          </h1>
        </div>

        {/* 카드 디자인 선택 */}
        <section className="mb-[24px]">
          <p className="text-head-6 text-neutral-2 mb-[5px]">카드 디자인</p>

          <div className="flex justify-center gap-[60px]">

            {/* 곰 카드 */}
            <div className="flex flex-col items-center">
              <div
                className={`relative w-[101px] h-[144px] transition-transform ${
                  selectedCard === "bear" ? "scale-105" : "scale-100"
                }`}
                onClick={() => setSelectedCard("bear")}
              >
                <Image
                  src="/images/allowance/illust_allowance_card1.png"
                  alt="곰 카드"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="mt-[8px]" onClick={() => setSelectedCard("bear")}>
                <Image
                  src="/icons/check-circle.png"
                  alt="선택 체크"
                  width={27}
                  height={27}
                  style={{
                    filter:
                      selectedCard === "bear"
                        ? "brightness(0) saturate(100%) invert(16%) sepia(74%) saturate(4362%) hue-rotate(191deg) brightness(104%) contrast(101%)"
                        : "brightness(0) saturate(100%) invert(92%) sepia(13%) saturate(46%) hue-rotate(169deg) brightness(101%) contrast(92%)",
                  }}
                />
              </div>
            </div>

            {/* 토끼 카드 */}
            <div className="flex flex-col items-center">
              <div
                className={`relative w-[101px] h-[144px] transition-transform ${
                  selectedCard === "rabbit" ? "scale-105" : "scale-100"
                }`}
                onClick={() => setSelectedCard("rabbit")}
              >
                <Image
                  src="/images/allowance/illust_allowance_card2.png"
                  alt="토끼 카드"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="mt-[8px]" onClick={() => setSelectedCard("rabbit")}>
                <Image
                  src="/icons/check-circle.png"
                  alt="선택 체크"
                  width={27}
                  height={27}
                  style={{
                    filter:
                      selectedCard === "rabbit"
                        ? "brightness(0) saturate(100%) invert(16%) sepia(74%) saturate(4362%) hue-rotate(191deg) brightness(104%) contrast(101%)"
                        : "brightness(0) saturate(100%) invert(92%) sepia(13%) saturate(46%) hue-rotate(169deg) brightness(101%) contrast(92%)",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 영문 이름 입력 */}
        <section className="mb-[10px]">
          <div className="flex items-center gap-[3px] mb-[5px]">
            <p className="text-head-6 text-neutral-2">영문 이름</p>
            <span className="text-body-08 text-neutral-3">
              성과 이름을 띄워서 써주세요
            </span>
          </div>

          <NormalInput2
            label=""
            value={englishName}
            placeholder="HONG GILDONG"
            onChange={handleNameChange}
          />

          <div className="h-[10px] mt-[4px]">
            {nameError && (
              <p className="text-error text-body-08">{nameError}</p>
            )}
          </div>
        </section>

        {/* 교통카드 여부 */}
        <section className="mb-[40px]">
          <p className="text-head-6 text-neutral-2 mb-[5px]">
            교통카드로 사용하기
          </p>

          <div className="flex flex-col gap-[10px]">

            {/* 사용 */}
            <button
              onClick={() => setUseTransitCard("yes")}
              className="flex items-center gap-[15px]"
            >
              <Image
                src="/icons/check-circle.png"
                alt="체크"
                width={27}
                height={27}
                style={{
                  filter:
                    useTransitCard === "yes"
                      ? "brightness(0) saturate(100%) invert(17%) sepia(99%) saturate(2940%) hue-rotate(190deg) brightness(102%) contrast(101%)"
                      : "brightness(0) saturate(100%) invert(92%) sepia(13%) saturate(46%) hue-rotate(169deg) brightness(101%) contrast(92%)",
                }}
              />
              <span className="text-body-04 text-neutral-1">
                교통카드로 사용할래요
              </span>
            </button>

            {/* 미사용 */}
            <button
              onClick={() => setUseTransitCard("no")}
              className="flex items-center gap-[15px]"
            >
              <Image
                src="/icons/check-circle.png"
                alt="체크"
                width={27}
                height={27}
                style={{
                  filter:
                    useTransitCard === "no"
                      ? "brightness(0) saturate(100%) invert(17%) sepia(99%) saturate(2940%) hue-rotate(190deg) brightness(102%) contrast(101%)"
                      : "brightness(0) saturate(100%) invert(92%) sepia(13%) saturate(46%) hue-rotate(169deg) brightness(101%) contrast(92%)",
                }}
              />
              <span className="text-body-04 text-neutral-1">안할래요</span>
            </button>
          </div>
        </section>
      </div>

      {/* 하단 버튼 */}
      <div className="flex-shrink-0 px-[24px] pb-[56px] pt-[20px]">
        {isButtonEnabled ? (
          <BigButtonActivated label="다음" onClick={handleNext} />
        ) : (
          <BigButtonDisabled label="다음" onClick={() => {}} />
        )}
      </div>

      {/* 비밀번호 바텀시트 */}
      <BottomSheetPassword
        open={isPasswordSheetOpen}
        setOpen={setIsPasswordSheetOpen}
        pinLength={4}
        title="카드 비밀번호"
        onComplete={handlePasswordComplete}
        shouldOverlayBottomBar={true}
      />
    </div>
  );
}
