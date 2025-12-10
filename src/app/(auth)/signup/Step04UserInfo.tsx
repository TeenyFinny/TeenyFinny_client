"use client";

import { useMemo, useState, useEffect } from "react";
import { useRegisterStore } from "@/store/registerStore";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { BigButtonDisabled } from "@/components/ui/button/BigButtonDisabled";
import { NormalInput2 } from "@/components/ui/input/NormalInput2";
import { PasswordInput } from "@/components/ui/input/PasswordInput";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";

const EMAIL_REGEX = /^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/;

type Step04UserInfoProps = Readonly<{
  /** 다음 단계 이동 함수 */
  onNext: (password: string) => void; // 다음 단계로 비밀번호 전달
}>;

type TouchedState = {
  email: boolean;
  password: boolean;
  confirm: boolean;
};

const initialTouched: TouchedState = {
  email: false,
  password: false,
  confirm: false,
};

const getEmailError = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "이메일을 입력해주세요.";
  if (!EMAIL_REGEX.test(trimmed)) return "이메일 형식이 올바르지 않습니다.";
  return undefined;
};

const getPasswordError = (value: string) => {
  if (!value) return "비밀번호를 입력해주세요.";
  if (value.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
    return "비밀번호에 특수문자를 1개 이상 포함해주세요.";
  return undefined;
};

const getConfirmError = (password: string, confirm: string) => {
  if (!confirm) return "비밀번호 확인을 입력해주세요.";
  if (password !== confirm) return "비밀번호가 일치하지 않습니다.";
  return undefined;
};

/**
 * Step04UserInfo
 *
 * 회원가입 단계 4: 개인정보 입력
 * - registerStore에는 비민감 데이터(이름, 이메일, 생년월일)만 저장
 * - 비밀번호는 로컬 상태에서만 관리 (store persist X)
 * - "다음" 클릭 시 입력 검증 후 props로 비밀번호 전달
 */
export default function Step04UserInfo({ onNext }: Step04UserInfoProps) {
  const { form, setField } = useRegisterStore();

  /** 로컬 상태 — 비밀번호는 store에 저장하지 않음 */
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [touched, setTouched] = useState<TouchedState>(initialTouched);
  const [submitted, setSubmitted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<
    string | undefined
  >(undefined);

  // 카카오 회원가입인 경우 카카오 이메일을 자동으로 설정
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isKakaoSignup =
        sessionStorage.getItem("is-kakao-signup") === "true";
      if (isKakaoSignup) {
        setField("email", form.email);
      }
    }
  }, [form.email, setField]);

  const emailError = useMemo(() => {
    if (!(touched.email || submitted)) return undefined;
    return getEmailError(form.email);
  }, [form.email, touched.email, submitted]);

  const passwordError = useMemo(() => {
    if (!(touched.password || submitted)) return undefined;
    return getPasswordError(password);
  }, [password, touched.password, submitted]);

  const confirmError = useMemo(() => {
    if (!(touched.confirm || submitted)) return undefined;
    return getConfirmError(password, passwordConfirm);
  }, [password, passwordConfirm, touched.confirm, submitted]);

  const genderLabel = useMemo(() => {
    if (form.gender === 1) return "남자";
    if (form.gender === 2) return "여자";
    return "";
  }, [form.gender]);

  /** 버튼 활성화 조건 */
  const isButtonEnabled = useMemo(
    () =>
      !getEmailError(form.email) &&
      !getPasswordError(password) &&
      !getConfirmError(password, passwordConfirm) &&
      form.name.trim().length > 0 &&
      form.birthDate.trim().length === 8,
    [form.email, password, passwordConfirm, form.name, form.birthDate]
  );

  const handleEmailChange = (val: string) => {
    if (!touched.email) setTouched((prev) => ({ ...prev, email: true }));
    setField("email", val);
  };

  const handlePasswordChange = (val: string) => {
    if (!touched.password) setTouched((prev) => ({ ...prev, password: true }));
    setPassword(val);
  };

  const handleConfirmChange = (val: string) => {
    if (!touched.confirm) setTouched((prev) => ({ ...prev, confirm: true }));
    setPasswordConfirm(val);
  };

  const formattedBirthDate = useMemo(() => {
    if (form.birthDate.length === 8) {
      return `${form.birthDate.slice(0, 4)}.${form.birthDate.slice(
        4,
        6
      )}.${form.birthDate.slice(6, 8)}`;
    }
    return form.birthDate;
  }, [form.birthDate]);

  /** "다음" 버튼 클릭 */
  const handleNext = async () => {
    if (isVerifying) return;
    setVerificationError(undefined);

    const latestEmailError = getEmailError(form.email);
    const latestPasswordError = getPasswordError(password);
    const latestConfirmError = getConfirmError(password, passwordConfirm);

    if (
      latestEmailError ||
      latestPasswordError ||
      latestConfirmError ||
      form.name.trim().length === 0 ||
      form.birthDate.trim().length !== 8 ||
      form.gender === null
    ) {
      return;
    }

    // 이메일 중복 확인 API 호출
    setIsVerifying(true);
    try {
      await api.post(requests.authEmail, { email: form.email });

      // API 호출이 성공하면 다음 단계로 진행
      onNext(password);
    } catch (error: any) {
      // 에러 발생 시 (이미 사용 중인 이메일 등)
      setVerificationError(
        error.message || "이메일 확인 중 오류가 발생했습니다."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* 타이틀 */}
      <div className="pt-[34px] pb-[24px] text-left">
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
          {"정보를 입력해 주세요"}
        </h1>
      </div>

      <div className="flex flex-col gap-3">
        {/* 이메일 */}
        <div className="flex flex-col gap-1">
          <NormalInput2
            label="이메일"
            placeholder="TeenyFinny@test.com"
            value={form.email}
            onChange={handleEmailChange}
          />
        </div>
        {emailError && (
          <p className="pl-4 text-body-08 text-error">{emailError}</p>
        )}
        {verificationError && (
          <p className="pl-4 text-body-08 text-error">{verificationError}</p>
        )}

        {/* 비밀번호 */}
        <div className="flex flex-col gap-1">
          <PasswordInput
            label="비밀번호"
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && (
            <p className="px-1 text-body-08 text-error">{passwordError}</p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="flex flex-col gap-1">
          <PasswordInput
            label="비밀번호 확인"
            value={passwordConfirm}
            onChange={handleConfirmChange}
          />
          {confirmError && (
            <p className="px-1 text-body-08 text-error">{confirmError}</p>
          )}
        </div>

        {/* 이름 (읽기 전용) */}
        <NormalInput2 label="이름" value={form.name} onChange={() => {}} />

        {/* 성별 (읽기 전용) */}
        <NormalInput2 label="성별" value={genderLabel} onChange={() => {}} />

        {/* 생년월일 (읽기 전용) */}
        <NormalInput2
          label="생년월일"
          value={formattedBirthDate}
          onChange={() => {}}
        />
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-[56px] w-full max-w-[327px]">
        {isButtonEnabled ? (
          <BigButtonActivated
            label={isVerifying ? "확인 중..." : "다음"}
            onClick={handleNext}
          />
        ) : (
          <BigButtonDisabled label="다음" onClick={() => {}} />
        )}
      </div>
    </div>
  );
}
