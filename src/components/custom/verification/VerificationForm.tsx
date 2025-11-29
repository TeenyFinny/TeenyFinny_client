"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";
import { PhoneNumberInput } from "@/components/custom/allowance/checking/PhoneNumberInput";
import { ResidentNumberInput } from "@/components/custom/allowance/checking/ResidentNumberInput";
import NameInput from "@/components/custom/allowance/checking/NameInput";
import { TitleOnlyDialog } from "@/components/ui/modal/TitleOnlyDialog";
import { isValidBirthDate } from "@/lib/utils/validators";
import Image from "next/image";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useUserStore } from "@/store/userStore";
import { BottomSheetOtp } from "@/components/ui/bottom-sheet/BottomSheetOtp";
import { HttpError } from "@/types/axios/httpError.t";

type VerificationMode = "signup" | "verify";

interface VerificationFormProps {
  mode: VerificationMode;
  onNext?: () => void;
  onSuccess?: () => void;
  // signup 모드용 props
  form?: {
    phoneNumber: string;
    name: string;
  };
  setField?: (key: string, value: any) => void;
  // verify 모드용 props
  userId?: number | null;
}

/**
 * VerificationForm
 *
 * 본인인증 폼 공통 컴포넌트
 * - signup 모드: 회원가입 플로우에서 사용 (registerStore 사용)
 * - verify 모드: 프로필 수정에서 사용 (로컬 state + API 호출)
 */
export default function VerificationForm({
  mode,
  onNext,
  onSuccess,
  form: externalForm,
  setField,
  userId: externalUserId,
}: VerificationFormProps) {
  // 통신사 (UI 전용)
  const [carrier, setCarrier] = useState("SKT");

  // 주민등록번호 입력 로컬 상태
  const [birthFront, setBirthFront] = useState<string>(""); // YYMMDD
  const [birthBack, setBirthBack] = useState<string>(""); // 1자리

  // 생년월일 검증 모달 상태
  const [openBirthErrorModal, setOpenBirthErrorModal] = useState(false);

  // 인증번호 관련 상태
  const [otpSent, setOtpSent] = useState(false); // 인증번호 발송 여부
  const [showOtpInput, setShowOtpInput] = useState(false); // 인증번호 input 표시 여부
  const [otpBottomSheetOpen, setOtpBottomSheetOpen] = useState(false); // 바텀시트 열림 여부
  const [otpError, setOtpError] = useState<string | null>(null); // 인증번호 에러
  const [notificationVisible, setNotificationVisible] = useState(false); // 알림 팝업 표시 여부
  const [sendingOtp, setSendingOtp] = useState(false); // 인증번호 발송 중
  const [verifyingOtp, setVerifyingOtp] = useState(false); // 인증번호 검증 중
  const [displayOtp, setDisplayOtp] = useState<string>(""); // 표시할 인증번호 (랜덤 6자리)
  const displayOtpRef = useRef<string>(""); // displayOtp의 ref (setTimeout 클로저에서 최신 값 참조용)

  // verify 모드용 로컬 state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");

  // signup 모드용 store
  const registerForm = externalForm;
  const registerSetField = setField;

  // verify 모드용 store
  const storeUserId = useUserStore((state) => state.userId);
  const updateUser = useUserStore((state) => state.updateUser);
  const userId = externalUserId ?? storeUserId;

  // 현재 모드에 따른 값 가져오기
  const currentPhoneNumber =
    mode === "signup" ? registerForm?.phoneNumber ?? "" : phoneNumber;
  const currentName = mode === "signup" ? registerForm?.name ?? "" : name;

  // 파생 상태: 성별/세기 (signup 모드에서만 사용)
  const { gender, yearPrefix } = useMemo(() => {
    if (mode !== "signup") return { gender: null, yearPrefix: null };
    const g = birthBack[0];
    const GENDER_INFO_MAP: Record<
      string,
      { gender: 1 | 2; prefix: "19" | "20" }
    > = {
      "1": { gender: 1, prefix: "19" }, // 남자
      "2": { gender: 2, prefix: "19" }, // 여자
      "3": { gender: 1, prefix: "20" }, // 남자
      "4": { gender: 2, prefix: "20" }, // 여자
    };
    const info = GENDER_INFO_MAP[g];
    if (info) {
      return { gender: info.gender, yearPrefix: info.prefix };
    }
    return { gender: null, yearPrefix: null };
  }, [birthBack, mode]);

  /** 버튼 활성화 조건 */
  const isButtonEnabled =
    currentPhoneNumber.length === 11 &&
    birthFront.length === 6 &&
    birthBack.length === 1 &&
    currentName.trim().length > 0 &&
    (mode === "verify" || gender !== null);

  /** 인증번호 발송 */
  const handleSendOtp = useCallback(async () => {
    if (mode === "signup") {
      if (!yearPrefix || !registerSetField) return;
      const finalBirth = `${yearPrefix}${birthFront}`; // YYYYMMDD

      // 생년월일 유효성 검증
      if (!isValidBirthDate(finalBirth)) {
        setOpenBirthErrorModal(true);
        return;
      }
    }

    setSendingOtp(true);
    setOtpError(null);

    try {
      const req = {
        carrier,
        phoneNumber: currentPhoneNumber,
        birthFront,
        birthBack,
        name: currentName,
      };

      await api.post(requests.verifyPhoneNumber, req);

      // 랜덤 6자리 인증번호 생성 (표시용)
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // 인증번호 발송 성공
      setOtpSent(true);
      setShowOtpInput(true);
      setDisplayOtp(randomOtp);
      displayOtpRef.current = randomOtp;
      setNotificationVisible(true);

      // 알림 팝업 20초 후 자동 숨김
      setTimeout(() => {
        setNotificationVisible(false);
      }, 20000);

      // 5초 후 바텀시트 자동 열기
      setTimeout(() => {
        setOtpBottomSheetOpen(true);
      }, 5000);
    } catch (err) {
      console.error("인증번호 발송 실패:", err);
      setOtpError("인증번호 발송에 실패했습니다. 다시 시도해주세요.");
      if (mode === "verify") {
        setMessage("인증번호 발송에 실패했습니다.");
        setSuccess(false);
      }
    } finally {
      setSendingOtp(false);
    }
  }, [
    mode,
    yearPrefix,
    birthFront,
    birthBack,
    carrier,
    currentPhoneNumber,
    currentName,
    registerSetField,
  ]);

  /** 인증번호 검증 */
  const handleVerifyOtp = useCallback(
    async (otp: string) => {
      setVerifyingOtp(true);
      setOtpError(null);

      try {
        // 인증번호 검증 API 호출 (기존 verifyPhoneNumber API에 otp 파라미터 추가)
        const req = {
          carrier,
          phoneNumber: currentPhoneNumber,
          birthFront,
          birthBack,
          name: currentName,
          otp: Number(otp),
        };

        const res = await api.post(requests.verifyPhoneNumber, req);

        if (res.data?.verified) {
          // 인증 성공
          if (mode === "signup" && registerSetField) {
            const finalBirth = `${yearPrefix}${birthFront}`;
            registerSetField("birthDate", finalBirth);
            registerSetField("gender", gender);
            registerSetField("isVerified", true);
            setOtpBottomSheetOpen(false);
            onNext?.();
          } else {
            // verify 모드: 프로필 업데이트
            if (!userId) {
              setOtpError("사용자 ID가 없습니다.");
              return;
            }
            const updateReq = {
              name: currentName,
              phoneNumber: currentPhoneNumber,
            };
            await api.patch(requests.fetchProfileInfo, updateReq);
            setSuccess(true);
            updateUser(currentName);
            setOtpBottomSheetOpen(false);
            onSuccess?.();
          }
        } else {
          setOtpError("인증번호가 일치하지 않습니다.");
        }
      } catch (err) {
        console.error("인증번호 검증 실패:", err);
        if (err instanceof HttpError) {
          if (err.statusCode === 400) {
            setOtpError("인증번호가 일치하지 않습니다.");
          } else if (err.statusCode === 410) {
            setOtpError("만료된 인증번호입니다. 다시 발송해주세요.");
          } else {
            setOtpError(err.message || "인증에 실패했습니다.");
          }
        } else {
          setOtpError("인증에 실패했습니다. 다시 시도해주세요.");
        }
      } finally {
        setVerifyingOtp(false);
      }
    },
    [
      carrier,
      currentPhoneNumber,
      birthFront,
      birthBack,
      currentName,
      mode,
      registerSetField,
      yearPrefix,
      gender,
      onNext,
      userId,
      updateUser,
      onSuccess,
    ]
  );

  /** signup 모드: 다음 단계 이동 (인증번호 발송) */
  const handleSignupNext = useCallback(() => {
    handleSendOtp();
  }, [handleSendOtp]);

  /** verify 모드: 인증번호 발송 */
  const handleVerifySubmit = useCallback(async () => {
    if (!userId) {
      setMessage("사용자 ID가 없습니다.");
      setSuccess(false);
      return;
    }

    setSendingOtp(true);
    setOtpError(null);

    try {
      const req = {
        carrier,
        phoneNumber,
        birthFront,
        birthBack,
        name,
      };

      await api.post(requests.verifyPhoneNumber, req);

      // 랜덤 6자리 인증번호 생성 (표시용)
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // 인증번호 발송 성공
      setOtpSent(true);
      setShowOtpInput(true);
      setDisplayOtp(randomOtp);
      displayOtpRef.current = randomOtp;
      setNotificationVisible(true);

      // 알림 팝업 20초 후 자동 숨김
      setTimeout(() => {
        setNotificationVisible(false);
      }, 20000);

      // 5초 후 바텀시트 자동 열기
      setTimeout(() => {
        setOtpBottomSheetOpen(true);
      }, 5000);
    } catch (err) {
      console.error("인증번호 발송 실패:", err);
      setOtpError("인증번호 발송에 실패했습니다. 다시 시도해주세요.");
      setMessage("인증번호 발송에 실패했습니다.");
      setSuccess(false);
    } finally {
      setSendingOtp(false);
    }
  }, [userId, carrier, phoneNumber, birthFront, birthBack, name]);

  /** verify 모드: 성공 시 자동 이동 */
  useEffect(() => {
    if (mode === "verify" && success && onSuccess) {
      const timerId = setTimeout(onSuccess, 1000);
      return () => clearTimeout(timerId);
    }
  }, [mode, success, onSuccess]);

  const handleSubmit = () => {
    if (mode === "signup") {
      handleSignupNext();
    } else {
      handleVerifySubmit();
    }
  };

  const buttonLabel = mode === "signup" ? "다음" : "확인";

  return (
    <div className="flex flex-col">
      {/* 타이틀 */}
      <div
        className={`text-left ${
          mode === "signup" ? "pt-[34px] pb-[24px]" : "mt-[43px] mb-[24px]"
        }`}
      >
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
          {"이용중인 통신사 정보와\n휴대폰번호를 입력해 주세요"}
        </h1>
      </div>

      {/* 통신사 + 번호 */}
      <PhoneNumberInput
        label="휴대폰 번호"
        carrier={carrier}
        phoneNumber={currentPhoneNumber}
        onCarrierChange={setCarrier}
        onPhoneNumberChange={(val) => {
          if (mode === "signup" && registerSetField) {
            registerSetField("phoneNumber", val);
          } else {
            setPhoneNumber(val);
          }
        }}
      />

      {/* 주민등록번호 */}
      <ResidentNumberInput
        label="주민등록번호"
        front={birthFront}
        back={birthBack}
        onFrontChange={setBirthFront}
        onBackChange={setBirthBack}
      />

      {/* 이름 */}
      <NameInput
        value={currentName}
        onChange={(val) => {
          if (mode === "signup" && registerSetField) {
            registerSetField("name", val);
          } else {
            setName(val);
          }
        }}
      />

      {/* 인증번호 입력 필드 (항상 보이게) */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setOtpBottomSheetOpen(true)}
          className="flex-1 py-3 px-4 border border-primary-1 rounded-[10px] text-body-02 text-primary-1 bg-white"
        >
          인증번호 입력하기
        </button>
        <button
          onClick={handleSubmit}
          disabled={sendingOtp || !isButtonEnabled}
          className="py-3 px-4 border border-primary-1 rounded-[10px] text-body-02 text-primary-1 bg-white disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {sendingOtp ? "발송 중..." : "재발송"}
        </button>
      </div>

      {/* 알림 팝업 (위에서 내려오는 애니메이션) - 문자 메시지 스타일 */}
      {notificationVisible && (
        <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 pointer-events-none">
          <div
            className={`
              pointer-events-auto
              transition-transform transition-opacity duration-300 ease-out
              ${
                notificationVisible
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-full opacity-0"
              }
            `}
          >
            <div className="relative w-[357px] min-h-[90px] rounded-lg bg-white/70 backdrop-blur-3xl border border-white/30 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.30),0_8px_16px_-8px_rgba(0,0,0,0.18)] ring-1 ring-black/5 px-4 py-3">
              <div className="flex items-start gap-3">
                {/* 좌측 아이콘 */}
                <div className="flex-shrink-0">
                  <div className="relative h-[60px] w-[60px] overflow-hidden rounded-lg bg-neutral-7 flex items-center justify-center">
                    <img
                      src="/logos/96x96.png"
                      alt="Notification"
                      className="h-[55px] w-[55px] object-contain"
                    />
                  </div>
                </div>

                {/* 우측 콘텐츠: 메시지 */}
                <div className="relative flex-1">
                  <div className="h-[60px] flex items-center">
                    <p className="text-body-04 text-neutral-1 whitespace-pre-line">
                      인증번호를 입력해주세요:{" "}
                      <span className="font-semibold text-primary-1">
                        {displayOtp}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* verify 모드: 로딩/성공 메시지 */}
      {mode === "verify" && (
        <div className="mb-[19px] flex items-center justify-center gap-[8px]">
          {loading && (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-neutral-3 border-t-transparent" />
              <span className="text-body-01 text-neutral-3">인증 중...</span>
            </>
          )}

          {!loading && message && (
            <div className="flex items-center gap-[8px] text-body-01 text-neutral-1">
              {success ? (
                <Image
                  src="/icons/check-green.png"
                  alt="응답확인"
                  width={27}
                  height={27}
                />
              ) : (
                <Image
                  src="/icons/check.png"
                  alt="응답확인"
                  width={27}
                  height={27}
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(51%) sepia(65%) saturate(4181%) hue-rotate(332deg) brightness(94%) contrast(99%)",
                  }}
                />
              )}
              <span>{message}</span>
            </div>
          )}
        </div>
      )}

      {/* 버튼 */}
      <div
        className={`fixed bottom-[56px] w-full max-w-[327px] ${
          mode === "verify" ? "left-1/2 -translate-x-1/2" : ""
        }`}
      >
        {isButtonEnabled ? (
          <BigButtonActivated
            label={sendingOtp ? "발송 중..." : buttonLabel}
            onClick={handleSubmit}
          />
        ) : (
          <BigButtonDisabled label={buttonLabel} onClick={() => {}} />
        )}
      </div>

      {/* 인증번호 바텀시트 */}
      <BottomSheetOtp
        open={otpBottomSheetOpen}
        setOpen={setOtpBottomSheetOpen}
        onComplete={handleVerifyOtp}
        error={otpError}
        shouldOverlayBottomBar={false}
      />

      {/* 생년월일 검증 모달 (signup 모드 전용) */}
      {mode === "signup" && (
        <TitleOnlyDialog
          open={openBirthErrorModal}
          onOpenChange={setOpenBirthErrorModal}
          title={"올바른 주민등록번호를 \n 입력해주세요."}
          confirmText="확인"
        />
      )}
    </div>
  );
}
