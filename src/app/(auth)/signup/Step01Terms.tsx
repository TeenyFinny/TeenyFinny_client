// src/app/(auth)/signup/Step01Terms.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Step1Terms
 *
 * 회원가입 단계 1: 서비스 이용 약관 동의 페이지입니다.
 *
 * ### 주요 기능
 * - “전체 동의” 클릭 시 모든 항목을 한 번에 선택/해제할 수 있습니다.
 * - “화살표” 클릭으로 약관 목록을 접거나 펼칠 수 있습니다.
 * - 각 항목은 개별적으로 선택/해제할 수 있습니다.
 * - 각 항목의 화살표 클릭 시 화면 내 모달(Dialog)로 약관 내용을 표시합니다.
 * - 모든 항목이 체크되어야 “다음” 버튼이 활성화됩니다.
 *
 * @component
 */
type TermsState = {
  service: boolean;
  privacy: boolean;
  thirdParty: boolean;
  finance: boolean;
};

type Step1TermsProps = Readonly<{
  terms: TermsState;
  onChange: (updatedTerms: TermsState) => void;
  onNext: () => void;
}>;

export default function Step1Terms({
  terms,
  onChange,
  onNext,
}: Step1TermsProps) {
  /** 약관 목록 열림/닫힘 상태 */
  const [isExpanded, setIsExpanded] = useState(true);

  /** 모달로 열릴 약관 ID */
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  /** 모달에 표시할 HTML 내용 */
  const [modalHtmlContent, setModalHtmlContent] = useState<string>("");
  const [modalLoading, setModalLoading] = useState(false);

  /** 약관 HTML 로드 */
  useEffect(() => {
    const controller = new AbortController();

    const fetchHtml = async () => {
      setModalLoading(true);
      try {
        const response = await fetch(`/terms/terms_${openModalId}.html`, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        const html = await response.text();

        if (controller.signal.aborted) return;

        // style 태그 내용 추출
        const styleMatch = html.match(/<style[^>]*>([\s\S]*)<\/style>/i);
        let styleContent = styleMatch ? styleMatch[1] : "";
        // body 스타일을 스코프화 (body를 .terms-content로 변경)
        styleContent = styleContent.replace(/body\s*{/g, ".terms-content {");
        // body 태그 내용 추출
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1] : html;
        // style과 body 내용을 합쳐서 렌더링
        const fullContent = styleContent
          ? `<style>${styleContent}</style><div class="terms-content">${bodyContent}</div>`
          : `<div class="terms-content">${bodyContent}</div>`;

        if (!controller.signal.aborted) {
          setModalHtmlContent(fullContent);
        }
      } catch (error: any) {
        if (error?.name !== "AbortError") {
          console.error("약관 HTML 로드 실패:", error);
          setModalHtmlContent("<p>약관을 불러올 수 없습니다.</p>");
        }
      } finally {
        if (!controller.signal.aborted) {
          setModalLoading(false);
        }
      }
    };

    fetchHtml();

    return () => {
      controller.abort();
    };
  }, [openModalId]);

  /** 약관 목록 데이터 */
  const consentItems = [
    { id: "service", label: "서비스 이용약관 동의" },
    { id: "privacy", label: "개인정보 수집·이용 동의" },
    { id: "thirdParty", label: "개인정보 제3자 제공 동의" },
    { id: "finance", label: "전자금융거래 이용약관 동의" },
  ] as const;

  /** 전체 항목이 체크되었는지 여부 */
  const allChecked = Object.values(terms).every(Boolean);

  /** 전체 동의 버튼 클릭 시 모든 항목을 일괄 체크/해제합니다. */
  const handleAllCheck = () => {
    const newValue = !allChecked;
    onChange({
      service: newValue,
      privacy: newValue,
      thirdParty: newValue,
      finance: newValue,
    });
  };

  /** 개별 항목 클릭 시 해당 약관의 체크 상태를 토글합니다. */
  const handleItemCheck = (key: keyof TermsState) => {
    onChange({ ...terms, [key]: !terms[key] });
  };

  /** 모든 항목이 동의된 경우 다음 단계로 이동합니다. */
  const handleNext = () => {
    if (allChecked) onNext();
  };

  return (
    <div className="flex flex-col">
      {/* 제목 */}
      <header className="pt-[34px] pb-[26px] text-left">
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
          {"서비스 이용을 위해\n필수사항에 동의해 주세요"}
        </h1>
      </header>

      {/* 전체 동의 섹션 */}
      <div className="mb-[15px] bg-monochrome-gray rounded-[10px] px-[20px] py-[16px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[12px] flex-1">
            <button onClick={handleAllCheck}>
              <Image
                src="/icons/check-circle.png"
                alt="전체 동의"
                width={24}
                height={24}
                style={{
                  filter: allChecked
                    ? "brightness(0) saturate(100%) invert(17%) sepia(99%) saturate(2940%) hue-rotate(190deg) brightness(102%) contrast(101%)"
                    : "none",
                }}
              />
            </button>
            <span className="text-head-06 text-neutral-1">전체 동의</span>
          </div>

          <button onClick={() => setIsExpanded(!isExpanded)}>
            <Image
              src="/icons/arrow-down.png"
              alt="토글"
              width={24}
              height={24}
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(53%) sepia(54%) saturate(0%) hue-rotate(221deg) brightness(92%) contrast(99%)",
              }}
              className={`${
                isExpanded ? "rotate-0" : "rotate-180"
              } transition-transform`}
            />
          </button>
        </div>
      </div>

      {/* 개별 약관 목록 */}
      {isExpanded && (
        <ul className="space-y-[15px] pb-[40px] px-[14px]">
          {consentItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-[12px] flex-1">
                <button
                  onClick={() => handleItemCheck(item.id as keyof TermsState)}
                >
                  <Image
                    src={
                      terms[item.id as keyof TermsState]
                        ? "/icons/check-green.png"
                        : "/icons/check.png"
                    }
                    alt="체크"
                    width={24}
                    height={24}
                  />
                </button>
                <span className="text-body-02">{item.label}</span>
              </div>

              {/* 약관 보기 버튼 (Dialog 트리거) */}
              <button onClick={() => setOpenModalId(item.id)}>
                <Image
                  src="/icons/arrow-right.png"
                  alt={`${item.label} 보기`}
                  width={24}
                  height={24}
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(53%) sepia(54%) saturate(0%) hue-rotate(221deg) brightness(92%) contrast(99%)",
                  }}
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 하단 버튼 */}
      <div className="fixed bottom-[56px] w-full max-w-[327px]">
        {allChecked ? (
          <BigButtonActivated label="다음" onClick={handleNext} />
        ) : (
          <BigButtonDisabled label="다음" onClick={() => {}} />
        )}
      </div>

      {/* 약관 보기 모달 */}
      <Dialog open={!!openModalId} onOpenChange={() => setOpenModalId(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              {consentItems.find((item) => item.id === openModalId)?.label}
            </DialogTitle>
          </DialogHeader>

          {/* HTML 약관 직접 렌더링 */}
          {modalLoading ? (
            <div className="flex items-center justify-center h-[500px]">
              <p className="text-neutral-3">로딩 중...</p>
            </div>
          ) : (
            <div
              className="w-full h-[500px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: modalHtmlContent }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
