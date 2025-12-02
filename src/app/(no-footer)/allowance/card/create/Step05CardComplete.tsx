import { BigButtonActivated } from "@/components/ui/button/BigButtonActivated";
import { useRouter } from "next/navigation";

export default function Step05CardComplete() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/account");
  }
  return (
    <div className="flex h-[712px] flex-col overflow-hidden bg-primary-4">
      <main className="flex flex-1 flex-col items-center px-6">
        {/* 성공 아이콘 */}
        <div className="mt-31 flex justify-center">
          <img
            src="/icons/check-primary-1.png"
            alt="완료 체크 아이콘"
            className="h-[40px] w-[41px] object-contain"
          />
        </div>

        {/* 텍스트 */}
        <div className="mt-4 text-center">
          <span className="text-head-01 text-neutral-1 whitespace-pre-line">
            {"TeenyFinny 카드 발급에\n성공했어요!"}
          </span>
        </div>

        {/* 캐릭터 이미지 */}
        <div className="mt-4 flex justify-center">
          <img
            src="/images/common/illust_common_1.png"
            alt="티니피니 캐릭터"
            className="h-[233px] w-[350px] object-contain"
          />
        </div>

        {/* 버튼 */}
        <div className="fixed bottom-[56px] left-1/2 -translate-x-1/2 w-[327px]">
          <BigButtonActivated label="아이관리로 돌아가기" onClick={handleClick} />
        </div>
      </main>
    </div>
  );
}
