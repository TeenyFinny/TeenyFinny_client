"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmationDialog } from "@/components/ui/modal/ConfirmationDialog";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useQuizStore } from "@/store/quizStore";

/**
 * StockTerms
 *
 * 계좌 개설 동의 페이지
 * - 기존 회원가입 Step1Terms 구성과 동일하지만,
 *   상단에 안내 문구가 하나 더 추가되고,
 *   모든 항목 동의 후 “다음” 클릭 시 `/home`으로 이동합니다.
 */

interface TermsState {
    investment: boolean
    account: boolean
    responsibility: boolean
    guardian: boolean
};

export default function StockTerms() {
    const router = useRouter()
    const user_id = 1// TODO: 전역 상태에서 실제 사용자 ID 가져오기
    const [terms, setTerms] = useState<TermsState>({
        investment: false,
        account: false,
        responsibility: false,
        guardian: false,
    });
    const { setQuizData } = useQuizStore()


    const [isExpanded, setIsExpanded] = useState(true);
    const [openModalId, setOpenModalId] = useState<string | null>(null);
    // 모달 열림 상태
    const [openConfirm, setOpenConfirm] = useState(false);
    const [modalHtmlContent, setModalHtmlContent] = useState<string>("");
    const [modalLoading, setModalLoading] = useState(false);

    const consentItems = [
        { id: "investment", label: "투자 관련 주의사항 확인" },
        { id: "account", label: "계좌 개설 관련 주의사항 확인" },
        { id: "responsibility", label: "사행성 방지 교육 내용 확인" },
        { id: "guardian", label: "보호자와의 상의 내용 확인" },
    ] as const

    const allChecked = Object.values(terms).every(Boolean);

    // 약관 HTML 로드 및 파싱
    useEffect(() => {
        if (!openModalId || openModalId === "null") {
            setModalHtmlContent("");
            setModalLoading(false);
            return;
        }

        const controller = new AbortController();

        const fetchHtml = async () => {
            setModalLoading(true);
            try {
                const response = await fetch(
                    `/terms/terms_credit_${openModalId}.html`,
                    { signal: controller.signal }
                );

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

    const handleAllCheck = () => {
        const newValue = !allChecked;
        setTerms({
            investment: newValue,
            account: newValue,
            responsibility: newValue,
            guardian: newValue,
        });
    };

    const handleItemCheck = (key: keyof TermsState) => {
        setTerms({ ...terms, [key]: !terms[key] });
    };

    /** 확인 버튼 클릭 → 모달 열기 */
    const handleNextClick = () => {
        if (allChecked) setOpenConfirm(true);
    };

    /**
 * 확인 모달 확인 버튼 클릭
 * - 부모님에게 투자계좌 개설 요청 푸시 전송
 * - request_completed를 true로 업데이트
 * - 완료 후 홈으로 이동
 */
    const handleConfirm = async () => {
        try {
            // 1️⃣ PATCH 요청: request_completed 업데이트
            await api.patch(requests.fetchProgress, {
                requestCompleted: true,
            });

            // 2️⃣ 전역 상태 반영
            setQuizData({ requestCompleted: true });

            // // 3️⃣ (선택) 부모님 푸시 알림 보내기
            await api.post(requests.investAccountRequest);

            // 4️⃣ 홈으로 이동
            router.push("/home");
        } catch (err) {
            console.error("투자계좌 요청 실패:", err);
            alert("요청 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <main className="px-6 flex flex-col items-center">
            <div className="w-full max-w-[327px] flex flex-col">


                {/* 제목 */}
                <header className="pt-[36px] pb-[10px] text-left">
                    <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
                        {"주의사항을 확인하고\n부모님께 요청해요!"}
                    </h1>
                </header>

                {/* 안내 텍스트 */}
                <div className="pt-0 pb-[26px] text-left">
                    <p className="text-body-06 text-neutral-2">
                        미성년자는 투자계좌를 만들려면 부모님의 도움이 {"\n"}필요해요.
                    </p>
                </div>

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
                                className={`${isExpanded ? "rotate-0" : "rotate-180"
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

                                {/* 약관 보기 버튼 */}
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
                        <BigButtonActivated label="확인" onClick={handleNextClick} />
                    ) : (
                        <BigButtonDisabled label="확인" onClick={() => { }} />
                    )}
                </div>

                {/* 확인 모달 */}
                <ConfirmationDialog
                    open={openConfirm}
                    onOpenChange={setOpenConfirm}
                    title="투자 계좌를 생성해요." // ← 제목 비워둠
                    description="부모님이 투자 계좌 생성을 허락할 때까지 기다려요" // ← 설명 비워둠
                    confirmText="확인" // ← 버튼 텍스트 비워둠
                    onConfirm={handleConfirm}
                />



                {/* 약관 보기 모달 */}
                <Dialog open={!!openModalId} onOpenChange={() => setOpenModalId(null)}>
                    <DialogContent className="max-h-[80vh] overflow-y-auto bg-white">
                        <DialogHeader>
                            <DialogTitle>
                                {consentItems.find((item) => item.id === openModalId)?.label}
                            </DialogTitle>
                        </DialogHeader>
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
        </main>
    );
}
