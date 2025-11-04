import BadgeTest from "@/components/test/ui/badge/BadgeTest";
import ButtonTest from "@/components/test/ui/button/ButtonTest";
import CardForTest from "@/components/test/ui/card/CardForTest";
import HeaderBarTest from "@/components/test/ui/headerbar/HeaderBarTest";
import InputTest from "@/components/test/ui/input/InputTest";

export default function DesignSystemDemo() {
  return (
    // 화면 전체
    <div className="w-screen h-dvh bg-neutral-6 overflow-auto">
      {/* 가운데 정렬 + 좌우 24px 패딩 = 375-48=327 */}
      <section className="w-full h-full flex items-center justify-center px-6">
        {/* 버튼 고정폭 래퍼: ButtonTest 내부가 w-[327px] 여도 정확히 맞음 */}
        <div className="w-[375px]">
          <HeaderBarTest />
          <InputTest/>
          {/* <ButtonTest /> */}
          {/* <BadgeTest /> */}
          
        </div>
      </section>
    </div>
  );
}
