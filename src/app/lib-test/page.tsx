import BadgeTest from "@/components/test/ui/badge/BadgeTest";
import ButtonTest from "@/components/test/ui/button/ButtonTest";
import CardForTest from "@/components/test/ui/card/CardForTest";
import HeaderBarTest from "@/components/test/ui/headerbar/HeaderBarTest";
import InputTest from "@/components/test/ui/input/InputTest";
import ModalTest from "@/components/test/ui/modal/ModalTest";
import NoticeTest from "@/components/test/ui/notice/NoticeTest";


export default function DesignSystemDemo() {
  return (
    // 화면 전체
    <div className="w-screen h-dvh bg-green-500 overflow-x-hidden">
      {/* 가운데 정렬 + 좌우 24px 패딩 = 375-48=327 */}
      <section className="w-full h-full flex items-center justify-center px-6">
        {/* 버튼 고정폭 래퍼: ButtonTest 내부가 w-[327px] 여도 정확히 맞음 */}
        <div className="w-[375px]">
          {/* *<InputTest/> */}
          {/* *<ButtonTest /> */}
<<<<<<< HEAD
          {/* <ModalTest /> */}
          <BadgeTest />
=======
          <NoticeTest />
>>>>>>> 97892ca47a5c41364bfa9e38c674e48302a67099
        </div>
      </section>
    </div>
  );
}
