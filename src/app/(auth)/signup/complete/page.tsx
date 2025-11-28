"use client";

import Image from "next/image";
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { saveAuthToken } from "@/lib/auth/token";
import { useUserStore } from "@/store/userStore";
import { HttpError } from "@/types/axios/httpError.t";
import { TitleOnlyDialog } from "@/components/ui/modal/TitleOnlyDialog";
import { RegisterForm } from "@/store/registerStore";

type UserRole = RegisterForm["role"];

function SignupCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useUserStore((state) => state.setUser);

  // useState로 이메일, 비밀번호, 역할 관리
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    // URL 쿼리 파라미터에서 이메일, 비밀번호, 역할 읽기
    const emailParam = searchParams.get("email");
    const passwordParam = searchParams.get("password");
    const roleParam = searchParams.get("role") as UserRole;

    if (emailParam && passwordParam && roleParam) {
      setEmail(emailParam);
      setPassword(passwordParam);
      setRole(roleParam);
      return;
    }

    // 카카오 회원가입인 경우 sessionStorage에서 role 읽기
    if (globalThis.window === undefined) return;

    const savedRole = globalThis.window.sessionStorage.getItem(
      "signup-complete-role"
    ) as UserRole;

    if (!savedRole) return;

    setRole(savedRole);
    globalThis.window.sessionStorage.removeItem("signup-complete-role");
    globalThis.window.sessionStorage.removeItem("register-form-storage");
  }, [searchParams]);

  /** 로그인 API 호출 및 페이지 이동 */
  const handleLoginAndNavigate = async (
    emailValue?: string,
    passwordValue?: string,
    roleValue?: UserRole
  ) => {
    if (isLoading) return; // 이미 처리 중이면 중복 실행 방지

    const finalEmail = emailValue || email;
    const finalPassword = passwordValue || password;
    const finalRole = roleValue || role;

    if (!finalEmail || !finalPassword || !finalRole) {
      setModalMessage("정보를 불러오는 중입니다.\n잠시 후 다시 시도해주세요.");
      setModalOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      // 로그인 API 호출
      const res = await api.post(requests.login, {
        email: finalEmail.trim(),
        password: finalPassword.trim(),
      });

      // 로그인 API 응답 처리 (useLoginForm과 동일한 형식)
      const payload = res.data;
      const { user, tokenType, accessToken } = payload ?? {};

      if (!user) {
        throw new HttpError({
          message: "서버 응답이 올바르지 않습니다.",
          statusCode: res.status,
        });
      }

      if (!tokenType || !accessToken) {
        throw new HttpError({
          message: "인증 토큰을 받지 못했습니다. 잠시 후 다시 시도해주세요.",
          statusCode: res.status,
        });
      }

      // 토큰 저장
      saveAuthToken(tokenType, accessToken);

      // 사용자 정보 저장
      const userRole = user.role?.toLowerCase();
      if (userRole !== "parent" && userRole !== "child") {
        throw new HttpError({
          message: "잘못된 요청입니다. 관리자에게 문의해주세요.",
          statusCode: res.status,
        });
      }

      // userStore에 사용자 정보 저장
      setUser(
        user.name,
        userRole as "parent" | "child",
        user.userId,
        Array.isArray(user.children) && user.children.length > 0
      );

      // 역할에 따라 페이지 이동
      if (finalRole === "PARENT") {
        router.push("/home");
      } else {
        router.push("/family/info");
      }
    } catch (err) {
      if (err instanceof HttpError) {
        setModalMessage(err.message || "로그인에 실패했습니다.");
      } else if (err instanceof Error) {
        setModalMessage("예기치 못한 오류가 발생했습니다.");
      } else {
        setModalMessage("알 수 없는 오류가 발생했습니다.");
      }
      setModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="px-6 flex flex-col items-center">
      <div className="w-full max-w-[327px]">
        {/* 상단 여백 + 아이콘 */}
        <div className="flex flex-col items-center gap-[16px]">
          <div className="flex items-center justify-center pt-[84px] pb-[16px]">
            <Image
              src="/icons/check-primary-1.png"
              alt="check"
              width={41}
              height={40}
            />
          </div>
          <h1 className="text-head-01 text-neutral-1">가입이 완료되었어요!</h1>
        </div>

        {/* 캐릭터 이미지 */}
        <div className="flex justify-center items-center w-full pb-[40px] pt-[16px]">
          <Image
            src="/images/auth/illust_auth_3.png"
            alt="티니피니 캐릭터"
            width={222}
            height={222}
            className="object-contain"
          />
        </div>

        {/* 설명 문구 */}
        <p className="text-head-01 text-neutral-1 text-center whitespace-pre-line">
          {"티니피니와 함께\n즐거운 금융 생활을 시작해요"}
        </p>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-[56px] w-full max-w-[327px]">
        {role === "PARENT" && (
          <BigButtonActivated
            label={isLoading ? "처리 중..." : "내 계좌 불러오기"}
            onClick={() => {
              if (isLoading) return;

              // 카카오 회원가입인 경우 (이메일/비밀번호 없음)
              if (!email || !password) {
                // 이미 토큰이 있으므로 바로 이동
                router.push("/home");
              } else {
                // 일반 회원가입인 경우 로그인 API 호출
                handleLoginAndNavigate();
              }
            }}
          />
        )}
        {role === "CHILD" && (
          <BigButtonActivated
            label={isLoading ? "처리 중..." : "가족 등록하기"}
            onClick={() => {
              if (isLoading) return;

              // 카카오 회원가입인 경우 (이메일/비밀번호 없음)
              if (!email || !password) {
                // 이미 토큰이 있으므로 바로 이동
                router.push("/family/info");
              } else {
                // 일반 회원가입인 경우 로그인 API 호출
                handleLoginAndNavigate();
              }
            }}
          />
        )}
      </div>

      {/* 에러 모달 */}
      <TitleOnlyDialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={modalMessage}
        confirmText="확인"
        onConfirm={() => setModalOpen(false)}
      />
    </main>
  );
}

/**
 * 회원가입 완료 페이지
 *
 * Suspense로 감싸서 useSearchParams 사용
 */
export default function SignupCompletePage() {
  return (
    <Suspense
      fallback={
        <main className="px-6 flex flex-col items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-1"></div>
            <div className="text-body-04 text-neutral-1">로딩 중...</div>
          </div>
        </main>
      }
    >
      <SignupCompleteContent />
    </Suspense>
  );
}
