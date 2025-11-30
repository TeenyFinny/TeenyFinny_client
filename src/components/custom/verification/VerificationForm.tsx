"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"
import { PhoneNumberInput } from "@/components/custom/allowance/checking/PhoneNumberInput"
import { ResidentNumberInput } from "@/components/custom/allowance/checking/ResidentNumberInput"
import NameInput from "@/components/custom/allowance/checking/NameInput"
import { TitleOnlyDialog } from "@/components/ui/modal/TitleOnlyDialog"
import { isValidBirthDate } from "@/lib/utils/validators"
import { BottomSheetOtp } from "@/components/ui/bottom-sheet/BottomSheetOtp"

type VerificationMode = "signup" | "verify"

interface VerificationFormProps {
  readonly mode: VerificationMode
  readonly onNext?: () => void
  readonly onSuccess?: () => void
  // signup 모드용 props
  readonly form?: {
    phoneNumber: string
    name: string
  }
  readonly setField?: (key: string, value: any) => void
}

/**
 * VerificationForm
 *
 * 본인인증 폼 공통 컴포넌트
 * - signup 모드: 회원가입 플로우에서 사용 (registerStore 사용)
 * - verify 모드: 프로필 수정에서 사용 (로컬 state + API 호출)
 */
export default function VerificationForm({ mode, onNext, onSuccess, form: externalForm, setField }: VerificationFormProps) {
  // 통신사 (UI 전용)
  const [carrier, setCarrier] = useState("SKT")

  // 주민등록번호 입력 로컬 상태
  const [birthFront, setBirthFront] = useState<string>("") // YYMMDD
  const [birthBack, setBirthBack] = useState<string>("") // 1자리

  // 생년월일 검증 모달 상태
  const [openBirthErrorModal, setOpenBirthErrorModal] = useState(false)

  // 인증번호 관련 상태
  const [otpBottomSheetOpen, setOtpBottomSheetOpen] = useState(false) // 바텀시트 열림 여부
  const [otpError, setOtpError] = useState<string | null>(null) // 인증번호 에러
  const [notificationVisible, setNotificationVisible] = useState(false) // 알림 팝업 표시 여부
  const [isOtpVerified, setIsOtpVerified] = useState(false) // 인증번호 검증 완료 여부
  const [isOtpInputOpen, setIsOtpInputOpen] = useState(false) // 인증번호 입력하기 버튼 클릭 여부
  const [displayOtp, setDisplayOtp] = useState<string>("") // 표시할 인증번호 (랜덤 6자리)
  const displayOtpRef = useRef<string>("") // displayOtp의 ref (setTimeout 클로저에서 최신 값 참조용)

  // verify 모드용 로컬 state
  const [phoneNumber, setPhoneNumber] = useState("")
  const [name, setName] = useState("")

  // signup 모드용 store
  const registerForm = externalForm
  const registerSetField = setField

  // 현재 모드에 따른 값 가져오기
  const currentPhoneNumber = mode === "signup" ? registerForm?.phoneNumber ?? "" : phoneNumber
  const currentName = mode === "signup" ? registerForm?.name ?? "" : name

  // 파생 상태: 성별/세기 (signup 모드에서만 사용)
  const { gender, yearPrefix } = useMemo(() => {
    if (mode !== "signup") return { gender: null, yearPrefix: null }
    const g = birthBack[0]
    const GENDER_INFO_MAP: Record<string, { gender: 1 | 2; prefix: "19" | "20" }> = {
      "1": { gender: 1, prefix: "19" }, // 남자
      "2": { gender: 2, prefix: "19" }, // 여자
      "3": { gender: 1, prefix: "20" }, // 남자
      "4": { gender: 2, prefix: "20" }, // 여자
    }
    const info = GENDER_INFO_MAP[g]
    if (info) {
      return { gender: info.gender, yearPrefix: info.prefix }
    }
    return { gender: null, yearPrefix: null }
  }, [birthBack, mode])

  /** 버튼 활성화 조건 */
  const isBasicInfoComplete = currentPhoneNumber.length === 11 && birthFront.length === 6 && birthBack.length === 1 && currentName.trim().length > 0 && (mode === "verify" || gender !== null)
  const isButtonEnabled = isBasicInfoComplete && isOtpInputOpen && isOtpVerified

  /** 인증번호 생성 및 표시 */
  const generateAndShowOtp = useCallback(() => {
    // 랜덤 6자리 인증번호 생성
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString()
    setDisplayOtp(randomOtp)
    displayOtpRef.current = randomOtp
    setIsOtpVerified(false) // 인증번호 재발송 시 검증 상태 초기화
    setOtpError(null)
    setNotificationVisible(true)

    // 알림 팝업 8초 후 자동 숨김
    setTimeout(() => {
      setNotificationVisible(false)
    }, 8000)
  }, [])

  /** 인증번호 입력하기 버튼 클릭 */
  const handleOpenOtpInput = useCallback(() => {
    if (mode === "signup") {
      if (!yearPrefix || !registerSetField) return
      const finalBirth = `${yearPrefix}${birthFront}` // YYYYMMDD

      // 생년월일 유효성 검증
      if (!isValidBirthDate(finalBirth)) {
        setOpenBirthErrorModal(true)
        return
      }
    }

    generateAndShowOtp()
    setIsOtpInputOpen(true)
    setOtpBottomSheetOpen(true)
  }, [mode, yearPrefix, birthFront, registerSetField, generateAndShowOtp])

  /** 재전송 버튼 클릭 */
  const handleResendOtp = useCallback(() => {
    generateAndShowOtp()
    setOtpBottomSheetOpen(true)
  }, [generateAndShowOtp])

  /** 인증번호 검증 */
  const handleVerifyOtp = useCallback((otp: string) => {
    setOtpError(null)

    // 로컬에서 인증번호 검증
    if (otp === displayOtpRef.current) {
      // 인증 성공
      setIsOtpVerified(true)
      setOtpBottomSheetOpen(false)
      setOtpError(null)
    } else {
      // 인증 실패
      setOtpError("인증번호가 일치하지 않습니다.")
    }
  }, [])

  /** 다음 단계로 이동 */
  const handleNext = useCallback(() => {
    if (!isOtpVerified) return

    if (mode === "signup" && registerSetField) {
      const finalBirth = `${yearPrefix}${birthFront}`
      registerSetField("birthDate", finalBirth)
      registerSetField("gender", gender)
      registerSetField("isVerified", true)
      onNext?.()
    } else {
      // verify 모드
      onSuccess?.()
    }
  }, [mode, isOtpVerified, registerSetField, yearPrefix, birthFront, gender, onNext, onSuccess])

  const buttonLabel = mode === "signup" ? "다음" : "확인"

  return (
    <div className="flex flex-col">
      {/* 타이틀 */}
      <div className={`text-left ${mode === "signup" ? "pt-[34px] pb-[24px]" : "mt-[43px] mb-[24px]"}`}>
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">{"이용중인 통신사 정보와\n휴대폰번호를 입력해 주세요"}</h1>
      </div>

      {/* 통신사 + 번호 */}
      <PhoneNumberInput
        label="휴대폰 번호"
        carrier={carrier}
        phoneNumber={currentPhoneNumber}
        onCarrierChange={setCarrier}
        onPhoneNumberChange={(val) => {
          if (mode === "signup" && registerSetField) {
            registerSetField("phoneNumber", val)
          } else {
            setPhoneNumber(val)
          }
        }}
      />

      {/* 주민등록번호 */}
      <ResidentNumberInput label="주민등록번호" front={birthFront} back={birthBack} onFrontChange={setBirthFront} onBackChange={setBirthBack} />

      {/* 이름 */}
      <NameInput
        value={currentName}
        onChange={(val) => {
          if (mode === "signup" && registerSetField) {
            registerSetField("name", val)
          } else {
            setName(val)
          }
        }}
      />

      {/* 인증번호 입력하기 / 재전송 버튼 */}
      <div className="mt-4 flex gap-2">
        {isOtpInputOpen ? (
          <>
            <button onClick={() => setOtpBottomSheetOpen(true)} className="flex-1 py-3 px-4 border border-primary-1 rounded-[10px] text-body-02 text-primary-1 bg-white">
              인증번호 입력하기
            </button>
            <button onClick={handleResendOtp} className="py-3 px-4 border border-primary-1 rounded-[10px] text-body-02 text-primary-1 bg-white whitespace-nowrap">
              재전송
            </button>
          </>
        ) : (
          <button
            onClick={handleOpenOtpInput}
            disabled={!isBasicInfoComplete}
            className="flex-1 py-3 px-4 border border-primary-1 rounded-[10px] text-body-02 text-primary-1 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            인증번호 입력하기
          </button>
        )}
      </div>

      {/* 알림 팝업 (위에서 내려오는 애니메이션) - 문자 메시지 스타일 */}
      {notificationVisible && (
        <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 pointer-events-none">
          <div
            className={`
              pointer-events-auto
              transition-transform transition-opacity duration-300 ease-out
              ${notificationVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
            `}
          >
            <div className="relative w-[357px] min-h-[90px] rounded-lg bg-white/70 backdrop-blur-3xl border border-white/30 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.30),0_8px_16px_-8px_rgba(0,0,0,0.18)] ring-1 ring-black/5 px-4 py-3">
              <div className="flex items-start gap-3">
                {/* 좌측 아이콘 */}
                <div className="flex-shrink-0">
                  <div className="relative h-[60px] w-[60px] overflow-hidden rounded-lg bg-neutral-7 flex items-center justify-center">
                    <img src="/logos/96x96.png" alt="Notification" className="h-[55px] w-[55px] object-contain" />
                  </div>
                </div>

                {/* 우측 콘텐츠: 메시지 */}
                <div className="relative flex-1">
                  <div className="h-[60px] flex items-center">
                    <p className="text-body-04 text-neutral-1 whitespace-pre-line">
                      인증번호를 입력해주세요: <span className="font-semibold text-primary-1">{displayOtp}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 버튼 */}
      <div className={`fixed bottom-[56px] w-full max-w-[327px] ${mode === "verify" ? "left-1/2 -translate-x-1/2" : ""}`}>
        {isButtonEnabled ? <BigButtonActivated label={buttonLabel} onClick={handleNext} /> : <BigButtonDisabled label={buttonLabel} onClick={() => {}} />}
      </div>

      {/* 인증번호 바텀시트 */}
      <BottomSheetOtp open={otpBottomSheetOpen} setOpen={setOtpBottomSheetOpen} onComplete={handleVerifyOtp} error={otpError} shouldOverlayBottomBar={false} />

      {/* 생년월일 검증 모달 (signup 모드 전용) */}
      {mode === "signup" && <TitleOnlyDialog open={openBirthErrorModal} onOpenChange={setOpenBirthErrorModal} title={"올바른 주민등록번호를 \n 입력해주세요."} confirmText="확인" />}
    </div>
  )
}
