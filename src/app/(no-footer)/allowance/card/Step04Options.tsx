"use client";

import { useState } from "react";
import Image from "next/image";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";
import { NormalInput2 } from "@/components/ui/input/NormalInput2";

/**
 * Step04CardOptions
 * 카드 디자인, 영문 이름, 교통카드 여부를 선택하는 페이지
 */
export default function Step04CardOptions({ onNext }: { onNext?: () => void }) {
  const [selectedCard, setSelectedCard] = useState<"bear" | "rabbit">("bear");
  const [englishName, setEnglishName] = useState("");
  const [nameError, setNameError] = useState("");
  const [useTransitCard, setUseTransitCard] = useState<"yes" | "no">("yes");

  /** 영문 이름 입력 검증 */
  const handleNameChange = (value: string) => {
    const englishRegex = /^[a-zA-Z\s]*$/;
    if (!englishRegex.test(value)) {
      setNameError("영문과 공백만 입력 가능합니다.");
      return;
    }
    setEnglishName(value.toUpperCase());
    setNameError("");
  };

  /** 모든 조건 충족 시 버튼 활성화 */
  const isButtonEnabled =
    englishName.trim() !== "" && englishName.includes(" ") && !nameError;

  /** 다음 단계로 이동 */
  const handleNext = () => {
    if (isButtonEnabled && onNext) onNext();
  };

  return (
    <div className="flex flex-col px-[24px]">
      {/* 제목 */}
      <div className="mt-[36px] mb-[24px] text-left">
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
          {"신청하실 카드의\n서비스를 선택해 주세요"}
        </h1>
      </div>

      {/* 카드 디자인 선택 */}
      <section className="mb-[24px]">
        <p className="text-head-5 text-neutral-2 mb-[5px]">카드 디자인</p>
        <div className="flex justify-center gap-[60px]">
          {/* 곰 카드 */}
          <div className="flex flex-col items-center">
            <div
              className={`relative h-[144px] w-[96px] transition-transform ${
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
            {/* 카드 하단 중앙 체크 */}
            <div className="mt-[8px]" onClick={() => setSelectedCard("bear")}>
              <Image
                src="/icons/check-circle.png"
                alt="체크"
                width={27}
                height={27}
                style={{
                  filter:
                    selectedCard === "bear"
                      ? "brightness(0) saturate(100%) invert(16%) sepia(74%) saturate(4362%) hue-rotate(191deg) brightness(104%) contrast(101%)" // primary-1 색상
                      : "brightness(0) saturate(100%) invert(92%) sepia(13%) saturate(46%) hue-rotate(169deg) brightness(101%) contrast(92%)", // monochrome-gray 색상
                }}
              />
            </div>
          </div>

          {/* 토끼 카드 */}
          <div className="flex flex-col items-center">
            <div
              className={`relative h-[144px] w-[96px] transition-transform ${
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
            {/* 카드 하단 중앙 체크 */}
            <div className="mt-[8px]" onClick={() => setSelectedCard("rabbit")}>
              <Image
                src="/icons/check-circle.png"
                alt="체크"
                width={27}
                height={27}
                style={{
                  filter:
                    selectedCard === "rabbit"
                      ? "brightness(0) saturate(100%) invert(16%) sepia(74%) saturate(4362%) hue-rotate(191deg) brightness(104%) contrast(101%)" // primary-1 색상
                      : "brightness(0) saturate(100%) invert(92%) sepia(13%) saturate(46%) hue-rotate(169deg) brightness(101%) contrast(92%)", // monochrome-gray 색상
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
        {/* 에러 메시지 영역 고정 높이 (밀림 방지) */}
        <div className="h-[10px] mt-[4px]">
          {nameError && <p className="text-error text-body-08">{nameError}</p>}
        </div>
      </section>

      {/* 교통카드 사용 여부 */}
      <section className="mb-[40px]">
        <p className="text-head-5 text-neutral-2 mb-[5px]">
          교통카드로 사용하기
        </p>
        <div className="flex flex-col gap-[10px]">
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

      {/* 하단 버튼 */}
      <div className="mb-[56px]">
        {isButtonEnabled ? (
          <BigButtonActivated label="다음" onClick={handleNext} />
        ) : (
          <BigButtonDisabled label="다음" onClick={() => {}} />
        )}
      </div>
    </div>
  );
}
