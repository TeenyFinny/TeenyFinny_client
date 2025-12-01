import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { useSelectedChildStore } from "@/store/selectedChildStore";
import { useEffect } from "react";


export default function Move({
  onNext,
  childId,
}: {
  onNext: () => void;
  childId: number;   // 부모가 선택한 childId 전달받도록 추가
}) {

  const MOVE_PAGE_DELAY = 2500;
  const { selectedChildId } = useSelectedChildStore();

  useEffect(() => {
    const createAccount = async () => {
      try {
        // childId를 body에 담아서 POST
        await api.post(requests.investMyAccount, { childId: selectedChildId });

        // 계좌 생성 성공 → 다음 화면으로 이동
        onNext();

      } catch (err) {
        console.error(err);
        alert("계좌 생성 중 오류가 발생했습니다.");
        window.history.back();
      }
    };

    const t = setTimeout(createAccount, MOVE_PAGE_DELAY);
    return () => clearTimeout(t);
  }, [selectedChildId, onNext]);

  return (
    <div className="flex flex-col items-center px-6 pt-13">
      {/* Title Section */}
      <div className="text-center mb-16">
        <h1 className="text-head-00 text-primary-1">우리투자증권</h1>
        <p className="text-head-01 text-neutral-1">화면으로 이동합니다</p>
      </div>

      {/* Illustration */}
      <div className="mb-8">
        <img
          src="/images/invest/illust_invest_2.png"
          alt="토끼가 빨간 자동차를 운전하는 일러스트"
          className="w-[324px] h-[216px] object-contain"
        />
      </div>

      {/* Information Section */}
      <ul className="w-full space-y-6 px-2">
        <li className="flex gap-3">
          <span className="text-body-06 text-neutral-2 flex-shrink-0">•</span>
          <p className="text-body-06 text-neutral-2 leading-relaxed">
            본 서비스는 우리은행의 제휴사인 우리투자증권에서 제공합니다.
          </p>
        </li>

        <li className="flex gap-3">
          <span className="text-body-06 text-neutral-2 flex-shrink-0">•</span>
          <p className="text-body-06 text-neutral-2 leading-relaxed">
            우리은행은 서비스 페이지에 연결하는 역할을 하며 서비스의 제공과 책임은 우리투자증권에 있습니다.
          </p>
        </li>

        <li className="flex gap-3">
          <span className="text-body-06 text-neutral-2 flex-shrink-0">•</span>
          <p className="text-body-06 text-neutral-2 leading-relaxed">
            문의: 우리투자증권 고객센터{" "}
            <a href="tel:1588-1000" className="text-primary-1 text-body-06">
              1588-1000
            </a>
          </p>
        </li>
      </ul>
    </div>
  );
}
