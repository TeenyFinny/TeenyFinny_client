"use client"

import { useState, useCallback, useRef, useMemo, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PhoneNumberInput } from "@/components/custom/allowance/checking/PhoneNumberInput"
import { ResidentNumberInput } from "@/components/custom/allowance/checking/ResidentNumberInput"
import NameInput from "@/components/custom/allowance/checking/NameInput"
import { NormalInput2 } from "@/components/ui/input/NormalInput2"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled"
import { BottomSheetOtp } from "@/components/ui/bottom-sheet/BottomSheetOtp"
import { TitleOnlyDialog } from "@/components/ui/modal/TitleOnlyDialog"
import { isValidBirthDate } from "@/lib/utils/validators"
import api from "@/lib/axios/axios"
import requests from "@/lib/axios/requests"
import { HttpError } from "@/types/axios/httpError.t"

type FindMode = "id" | "password"

export default function FindPage() {
  const router = useRouter()
  const [mode, setMode] = useState<FindMode>("id")

  // 통신사 (UI 전용)
  const [carrier, setCarrier] = useState("SKT")

  // 입력 필드
  const [phoneNumber, setPhoneNumber] = useState("")
  const [birthFront, setBirthFront] = useState<string>("") // YYMMDD
  const [birthBack, setBirthBack] = useState<string>("") // 1자리
  const [name, setName] = useState("")
  const [email, setEmail] = useState("") // PW 찾기용

  // 생년월일 검증 모달 상태
  const [openBirthErrorModal, setOpenBirthErrorModal] = useState(false)

  // 인증번호 관련 상태
  const [otpBottomSheetOpen, setOtpBottomSheetOpen] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [notificationVisible, setNotificationVisible] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [isOtpInputOpen, setIsOtpInputOpen] = useState(false)
  const [displayOtp, setDisplayOtp] = useState<string>("")
  const displayOtpRef = useRef<string>("")
  const [sendingOtp, setSendingOtp] = useState(false) // 인증번호 발송 중
  const [finding, setFinding] = useState(false) // 찾기 진행 중

  // 결과 상태
  const [foundEmail, setFoundEmail] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 파생 상태: 세기
  const yearPrefix = useMemo(() => {
    const g = birthBack[0]
    if (g === "1" || g === "2") return "19"
    if (g === "3" || g === "4") return "20"
    return null
  }, [birthBack])

  // 컴포넌트 언마운트 시 모달 닫기
  useEffect(() => {
    return () => {
      setOtpBottomSheetOpen(false)
      setOpenBirthErrorModal(false)
    }
  }, [])

  /** 버튼 활성화 조건 */
  const isBasicInfoComplete = phoneNumber.length === 11 && birthFront.length === 6 && birthBack.length === 1 && name.trim().length > 0 && (mode === "id" || email.trim().length > 0)

  const isButtonEnabled = isBasicInfoComplete && isOtpInputOpen && isOtpVerified

  /** 인증번호 발송 */
  const sendOtp = useCallback(async () => {
    setSendingOtp(true)
    setOtpError(null)

    try {
      const req = {
        carrier,
        phoneNumber,
        birthFront,
        birthBack,
        name,
      }

      const res = await api.post(requests.verifyPhoneNumber, req)

      // 서버에서 받은 인증번호 (개발용 - 실제로는 서버에서 SMS로 발송)
      const receivedOtp = res.data?.otp || res.data?.verificationCode || ""
      if (receivedOtp) {
        setDisplayOtp(receivedOtp)
        displayOtpRef.current = receivedOtp
      } else {
        // 서버에서 인증번호를 반환하지 않는 경우 랜덤 생성 (개발용)
        const randomOtp = Math.floor(100000 + Math.random() * 900000).toString()
        setDisplayOtp(randomOtp)
        displayOtpRef.current = randomOtp
      }

      setIsOtpVerified(false)
      setNotificationVisible(true)

      setTimeout(() => {
        setNotificationVisible(false)
      }, 5000)
    } catch (err) {
      console.error("인증번호 발송 실패:", err)
      if (err instanceof HttpError) {
        setOtpError(err.message || "인증번호 발송에 실패했습니다.")
      } else {
        setOtpError("인증번호 발송에 실패했습니다. 다시 시도해주세요.")
      }
    } finally {
      setSendingOtp(false)
    }
  }, [carrier, phoneNumber, birthFront, birthBack, name])

  /** 인증번호 입력하기 버튼 클릭 */
  const handleOpenOtpInput = useCallback(async () => {
    if (!yearPrefix) return
    const finalBirth = `${yearPrefix}${birthFront}` // YYYYMMDD

    // 생년월일 유효성 검증
    if (!isValidBirthDate(finalBirth)) {
      setOpenBirthErrorModal(true)
      return
    }

    await sendOtp()
    setIsOtpInputOpen(true)
    setOtpBottomSheetOpen(true)
  }, [yearPrefix, birthFront, sendOtp])

  /** 재전송 버튼 클릭 */
  const handleResendOtp = useCallback(async () => {
    await sendOtp()
    setOtpError(null) // 재전송 시 에러 초기화
    setOtpBottomSheetOpen(true)
  }, [sendOtp])

  /** 인증번호 검증 */
  const handleVerifyOtp = useCallback(
    async (otp: string) => {
      // 이미 에러가 있는 상태에서 다시 확인 버튼을 누른 경우 바텀시트 닫기
      if (otpError) {
        setOtpBottomSheetOpen(false)
        return
      }

      setOtpError(null)

      // 로컬에서 인증번호 검증 (개발용 - 실제로는 API 호출)
      if (otp === displayOtpRef.current) {
        // 인증 성공
        setIsOtpVerified(true)
        setOtpBottomSheetOpen(false)
        setOtpError(null)
      } else {
        // 인증 실패 - 에러만 표시하고 바텀시트는 열어둠
        setOtpError("인증번호가 일치하지 않습니다.")
      }
    },
    [otpError]
  )

  /** 찾기 실행 */
  const handleFind = useCallback(async () => {
    if (!isOtpVerified) return

    setFinding(true)
    setErrorMessage(null)
    setShowResult(false)

    try {
      if (!yearPrefix) {
        setErrorMessage("주민등록번호를 올바르게 입력해주세요.")
        return
      }

      const finalBirth = `${yearPrefix}${birthFront}` // YYYYMMDD

      if (mode === "id") {
        // ID 찾기 API 호출
        const req = {
          phoneNumber,
          birthDate: finalBirth,
          name,
        }

        const res = await api.post(requests.findEmail, req)

        if (res.data?.email) {
          setFoundEmail(res.data.email)
          setShowResult(true)
        } else {
          setErrorMessage("일치하는 정보를 찾을 수 없습니다.")
        }
      } else {
        // PW 찾기 API 호출 (비밀번호 재설정 링크 발송)
        const req = {
          email,
          phoneNumber,
          birthDate: finalBirth,
          name,
        }

        await api.post(requests.resetPassword, req)

        // 비밀번호 재설정 링크 발송 성공
        setShowResult(true)
      }
    } catch (err) {
      console.error("찾기 실패:", err)
      if (err instanceof HttpError) {
        if (err.statusCode === 404) {
          setErrorMessage("일치하는 정보를 찾을 수 없습니다.")
        } else {
          setErrorMessage(err.message || "오류가 발생했습니다. 다시 시도해주세요.")
        }
      } else {
        setErrorMessage("오류가 발생했습니다. 다시 시도해주세요.")
      }
    } finally {
      setFinding(false)
    }
  }, [mode, isOtpVerified, yearPrefix, birthFront, phoneNumber, name, email])

  /** 모드 변경 시 초기화 */
  const handleModeChange = (newMode: FindMode) => {
    setMode(newMode)
    setPhoneNumber("")
    setBirthFront("")
    setBirthBack("")
    setName("")
    setEmail("")
    setIsOtpVerified(false)
    setIsOtpInputOpen(false)
    setShowResult(false)
    setFoundEmail(null)
    setErrorMessage(null)
  }

  return (
    <main className="mx-auto flex w-full flex-col px-6 pt-16">
      {/* 탭 */}
      <div className="flex gap-4">
        <button onClick={() => handleModeChange("id")} className={`flex-1 py-3 rounded-[10px] text-body-02 ${mode === "id" ? "bg-primary-1 text-white" : "bg-neutral-7 text-neutral-3"}`}>
          ID 찾기
        </button>
        <button onClick={() => handleModeChange("password")} className={`flex-1 py-3 rounded-[10px] text-body-02 ${mode === "password" ? "bg-primary-1 text-white" : "bg-neutral-7 text-neutral-3"}`}>
          비밀번호 찾기
        </button>
      </div>

      {!showResult ? (
        <>
          {/* 입력 영역 */}
          <div className="pt-12 flex flex-col gap-3">
            <PhoneNumberInput label="휴대폰 번호" carrier={carrier} phoneNumber={phoneNumber} onCarrierChange={setCarrier} onPhoneNumberChange={setPhoneNumber} />

            <ResidentNumberInput label="주민등록번호" front={birthFront} back={birthBack} onFrontChange={setBirthFront} onBackChange={setBirthBack} />

            <NameInput value={name} onChange={setName} />

            {mode === "password" && (
              <div className="flex flex-col gap-[4px]">
                <NormalInput2 label="이메일" value={email} placeholder="이메일을 입력하세요" onChange={setEmail} />
              </div>
            )}
          </div>

          {/* 인증번호 입력하기 / 재전송 버튼 */}
          <div className="pt-6 flex gap-2">
            {isOtpInputOpen ? (
              <>
                <button onClick={() => setOtpBottomSheetOpen(true)} className="flex-1 py-3 px-4 border border-primary-1 rounded-[10px] text-body-02 text-primary-1 bg-white">
                  인증번호 입력하기
                </button>
                <button
                  onClick={handleResendOtp}
                  disabled={sendingOtp}
                  className="py-3 px-4 border border-primary-1 rounded-[10px] text-body-02 text-primary-1 bg-white whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingOtp ? "발송 중..." : "재전송"}
                </button>
              </>
            ) : (
              <button
                onClick={handleOpenOtpInput}
                disabled={!isBasicInfoComplete || sendingOtp}
                className="flex-1 py-3 px-4 border border-primary-1 rounded-[10px] text-body-02 text-primary-1 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingOtp ? "발송 중..." : "인증번호 입력하기"}
              </button>
            )}
          </div>

          {/* 에러 메시지 */}
          {errorMessage && <p className="pt-4 pl-4 text-body-08 text-error">{errorMessage}</p>}

          {/* 찾기 버튼 */}
          <div className="pt-8.5 flex justify-center">
            {isButtonEnabled && !finding ? (
              <BigButtonActivated label={mode === "id" ? "ID 찾기" : "비밀번호 찾기"} onClick={handleFind} />
            ) : (
              <BigButtonDisabled label={finding ? "처리 중..." : mode === "id" ? "ID 찾기" : "비밀번호 찾기"} onClick={() => {}} />
            )}
          </div>
        </>
      ) : (
        <>
          {/* 결과 영역 */}
          <div className="pt-12 flex flex-col gap-6">
            {mode === "id" ? (
              <div className="text-center">
                <p className="text-body-01 text-neutral-1 mb-2">찾으신 이메일 주소입니다</p>
                {foundEmail && <p className="text-head-06 text-primary-1">{foundEmail}</p>}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-body-01 text-neutral-1 mb-2">비밀번호 재설정 링크를</p>
                <p className="text-body-01 text-neutral-1 mb-4">이메일로 발송했습니다</p>
                {email && <p className="text-body-02 text-neutral-3">{email}</p>}
              </div>
            )}
          </div>

          {/* 로그인 이동 버튼 */}
          <div className="pt-8.5 flex justify-center">
            <BigButtonActivated label="로그인하기" onClick={() => router.push("/login")} />
          </div>
        </>
      )}

      {/* 알림 팝업 */}
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
                {/* 우측 콘텐츠: 메시지 */}
                <div className="relative flex-1">
                  <div className="h-[60px] flex items-center">
                    <p className="text-body-04 text-neutral-1 whitespace-pre-line">
                      [Web발신] <br />
                      인증번호를 입력해주세요: <span className="font-semibold text-netural-1">{displayOtp}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 인증번호 바텀시트 */}
      <BottomSheetOtp open={otpBottomSheetOpen} setOpen={setOtpBottomSheetOpen} onComplete={handleVerifyOtp} error={otpError} shouldOverlayBottomBar={false} />

      {/* 생년월일 검증 모달 */}
      <TitleOnlyDialog open={openBirthErrorModal} onOpenChange={setOpenBirthErrorModal} title={"올바른 주민등록번호를 \n 입력해주세요."} confirmText="확인" />

      {/* 로그인으로 돌아가기 */}
      <Link href="/login" className="pt-8.5 text-center text-body-07 text-neutral-3 underline-offset-4 hover:underline">
        로그인으로 돌아가기
      </Link>
    </main>
  )
}
