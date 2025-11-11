"use client";

import { useState } from "react";
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

/**
 * Step1Terms
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

export default function Step1Terms() {
    const router = useRouter();

    const [terms, setTerms] = useState<TermsState>({
        investment: false,
        account: false,
        responsibility: false,
        guardian: false,
    });

    const [isExpanded, setIsExpanded] = useState(true);
    const [openModalId, setOpenModalId] = useState<string | null>(null);
    // 모달 열림 상태
    const [openConfirm, setOpenConfirm] = useState(false);

    const consentItems = [
        { id: "investment", label: "투자 관련 주의사항 확인" },
        { id: "account", label: "계좌 개설 관련 주의사항 확인" },
        { id: "responsibility", label: "사행성 방지 교육 내용 확인" },
        { id: "guardian", label: "보호자와의 상의 내용 확인" },
    ] as const

    const allChecked = Object.values(terms).every(Boolean);

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

    /** 모달에서 확인 → 홈으로 이동 */
    const handleConfirm = () => {
        router.push("/home");
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
                <div className="pt-[0px] pb-[26px] text-left">
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
                    title="주식 계좌를 생성해요." // ← 제목 비워둠
                    description="부모님이 투자 계좌 생성을 허락할 때까지 기다려요" // ← 설명 비워둠
                    confirmText="확인" // ← 버튼 텍스트 비워둠
                    onConfirm={handleConfirm}
                    //TODO: 부모님께 투자계좌개설요청 푸시알림을 보내야하고, 더이상 투자계좌개설요청 페이지에 접근할 수 없어야 함.  request_completed=>true
                />
                 


                {/* 약관 보기 모달 */}
                <Dialog open={!!openModalId} onOpenChange={() => setOpenModalId(null)}>
                    <DialogContent className="max-h-[80vh] overflow-y-auto bg-white">
                        <DialogHeader>
                            <DialogTitle>
                                {consentItems.find((item) => item.id === openModalId)?.label}
                            </DialogTitle>
                        </DialogHeader>

                        {openModalId && (
                            <iframe
                                src={`/terms/terms_credit_${openModalId}.html`}
                                className="w-full h-[500px] border-none"
                                title={`${openModalId} 약관`}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </main>
    );
}
