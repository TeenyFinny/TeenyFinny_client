import ButtonTest from "@/components/test/ui/button/ButtonTest";
import CardForTest from "@/components/test/ui/card/CardForTest";
import InputTest from "@/components/test/ui/input/InputTest";

export default function DesignSystemDemo() {
  return (
    // 화면 전체
    <div className="w-screen h-dvh bg-neutral-6 overflow-x-hidden">
      {/* 가운데 정렬 + 좌우 24px 패딩 = 375-48=327 */}
      <section className="w-full h-full flex items-center justify-center px-6">
        {/* 버튼 고정폭 래퍼: ButtonTest 내부가 w-[327px] 여도 정확히 맞음 */}
        <div className="w-[375px]">
          *<InputTest/>
          {/* *<ButtonTest /> */}
        </div>
      </section>
    </div>
  );
}
