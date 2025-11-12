import Image from "next/image"
import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated"

type Step05PasswordInstructionProps = Readonly<{
  onNext: () => void
}>
export default function Step05PasswordInstruction({ onNext }: Step05PasswordInstructionProps) {
  return (
    <div className="flex flex-col">
      <div className="pt-[34px] pb-[10px] text-left">
        <h1 className="text-head-01 text-neutral-1 whitespace-pre-line">간편 비밀번호를 등록해 주세요</h1>
      </div>
      <div className="pb-[34px] text-left">
        <p className="text-body-05 text-neutral-2 whitespace-pre-line">
          {`간편 비밀번호를 등록하시면\n6자리 숫자 입력으로 로그인 하실 수 있습니다.`}
        </p>
      </div>
      <div className="flex justify-center px-[37px]">
        <Image src="/images/auth/img_simple_password.svg" alt="password-instruction" width={300} height={300} />
      </div>
      {/* 하단 버튼 */}
      <div className="fixed bottom-[56px] w-full max-w-[327px]">
        <BigButtonActivated label="다음" onClick={onNext} />
      </div>
    </div>
  )
}
