import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * @typedef {Object} TermsState
 * @property {boolean} service - 서비스 이용 약관 동의 여부
 * @property {boolean} privacy - 개인정보 수집·이용 동의 여부
 * @property {boolean} thirdParty - 개인정보 제3자 제공 동의 여부
 * @property {boolean} finance - 전자금융거래 이용 약관 동의 여부
 */
export interface TermsState {
  service: boolean;
  privacy: boolean;
  thirdParty: boolean;
  finance: boolean;
}

/**
 * @typedef {Object} RegisterForm
 * @property {TermsState} terms - 약관 동의 상태 (1단계)
 * @property {"PARENT" | "CHILD" | null} role - 사용자 역할 (2단계)
 * @property {string} phoneNumber - 휴대폰 번호 (3단계)
 * @property {boolean} isVerified - 본인인증 완료 여부 (3단계)
 * @property {string} name - 이름 (4단계)
 * @property {string} email - 이메일 (4단계)
 * @property {string} birthDate - 생년월일 (YYYYMMDD) 형식 (4단계)
 * @property {"M" | "F" | null} gender - 성별 (3단계)
 */
export interface RegisterForm {
  terms: TermsState;
  role: "PARENT" | "CHILD" | null;
  phoneNumber: string;
  isVerified: boolean;
  name: string;
  email: string;
  birthDate: string;
  gender: "M" | "F" | null;
}

/** 회원가입 폼의 초기 상태 (중복 방지용 상수) */
const initialForm: RegisterForm = {
  terms: {
    service: false,
    privacy: false,
    thirdParty: false,
    finance: false,
  },
  role: null,
  phoneNumber: "",
  isVerified: false,
  name: "",
  email: "",
  birthDate: "",
  gender: null,
};

/**
 * @typedef {Object} RegisterStore
 * @property {RegisterForm} form - 현재 회원가입 단계별 데이터 상태
 * @property {(key: keyof RegisterForm, value: any) => void} setField - 특정 필드 값 갱신 함수
 * @property {() => void} reset - 모든 상태를 초기값으로 되돌리는 함수
 * @property {(step: number) => boolean} isStepValid - 단계별 입력값 검증 함수
 */
interface RegisterStore {
  form: RegisterForm;
  setField: <K extends keyof RegisterForm>(
    key: K,
    value: RegisterForm[K]
  ) => void;
  reset: () => void;
  isStepValid: (step: number) => boolean;
}

/**
 * useRegisterStore
 *
 * 회원가입 전 과정을 전역적으로 관리하는 Zustand 스토어입니다.
 *
 * ### 주요 기능
 * - 단계별 입력값(`form`)을 전역 상태로 유지
 * - `setField()`로 부분 업데이트
 * - `reset()`으로 모든 데이터 초기화
 * - `isStepValid()`로 각 단계별 검증 수행
 * - `persist` 미들웨어로 localStorage에 자동 저장 (`register-form-storage`)
 *
 * ### 단계별 검증 조건
 * | 단계 | 검증 항목 | 조건 |
 * |------|------------|------|
 * | 1 | 약관 동의 | 4개 항목 모두 true |
 * | 2 | 역할 선택 | `role`이 비어있지 않음 |
 * | 3 | 본인인증 | `isVerified`가 true |
 * | 4 | 개인정보 입력 | 이름 존재, 이메일 형식 유효, 생년월일 8자리 |
 * | 5 | 간편비밀번호 | `isStepValid` 함수에서 검증` |
 */
export const useRegisterStore = create<RegisterStore>()(
  persist(
    (set, get) => ({
      /** 초기 상태 */
      form: initialForm,

      /**
       * 지정된 필드(key)의 값을 업데이트합니다.
       * @param {keyof RegisterForm} key - 갱신할 필드명
       * @param {any} value - 새로운 값
       */
      setField: (key, value) =>
        set((state) => ({ form: { ...state.form, [key]: value } })),

      /**
       * 모든 입력값을 초기화합니다.
       * (얕은 복사로 새로운 참조를 생성하여 불변성 보장)
       */
      reset: () =>
        set({
          form: {
            ...initialForm,
            terms: { ...initialForm.terms },
          },
        }),

      /**
       * 단계별 입력값 유효성 검증 함수입니다.
       * @param {number} step - 현재 회원가입 단계 (1~5)
       * @returns {boolean} 해당 단계의 필수 입력값이 유효한 경우 true
       */
      isStepValid: (step) => {
        const f = get().form;
        switch (step) {
          case 1:
            return Object.values(f.terms).every(Boolean);
          case 2:
            return Boolean(f.role);
          case 3:
            return f.isVerified;
          case 4:
            return (
              Boolean(f.name) &&
              /\S+@\S+\.\S+/.test(f.email) &&
              f.birthDate.length === 8
            );
          default:
            return false;
        }
      },
    }),
    {
      name: "register-form-storage",
      /** sessionStorage 기반 persist */
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
