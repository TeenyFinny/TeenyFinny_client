import Image from "next/image";
import { FamilyInfoActions } from "@/components/custom/family/FamilyInfoActions";

/**
 * 가족 등록 정보 페이지 (서버 컴포넌트)
 * - 서버 컴포넌트로 유지하여 SEO 및 초기 로딩 성능 최적화
 * - 클라이언트 인터랙션은 FamilyInfoActions 컴포넌트로 분리
 */
export default function IntroductionPage() {
  return (
    <main className="px-6 overflow-y-auto">
      {/* 타이틀 */}
      <div className="flex flex-col">
        <div className="pt-[36px] pb-[10px] text-left flex items-center">
          <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">
            가족 등록
          </h1>
        </div>
        <div className="text-left pb-[101px]">
          <p className="text-body-06 text-neutral-3 whitespace-pre-line">
            {`서비스 이용을 위해 가족 인증 번호를 입력해주세요.`}
          </p>
        </div>
      </div>

      {/* image container */}
      <div className="flex justify-center items-center w-full pb-[105px]">
        <Image
          src="/images/auth/illust_auth_2.png"
          alt="auth_2_image"
          width={222}
          height={222}
          priority
        />
      </div>

      {/* 하단 확인 버튼 - 클라이언트 컴포넌트로 분리 */}
      <FamilyInfoActions />
    </main>
  );
}
