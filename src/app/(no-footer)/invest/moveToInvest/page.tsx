export default function moveToInvest() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 pt-16">
      {/* Title Section */}
      <div className="text-center mb-12">
        <h1 className="text-head-00 text-[#0067ac] mb-2">우리투자증권</h1>
        <p className="text-head-01 text-[#343434]">화면으로 이동합니다</p>
      </div>

      {/* Illustration */}
      <div className="mb-12">
        <img
          src="/images/invest/illust_invest_2.png"
          alt="토끼가 빨간 자동차를 운전하는 일러스트"
          className="w-[280px] h-[280px] object-contain"
        />
      </div>

      {/* Information Section */}
      <div className="w-full space-y-6 px-2">
        <div className="flex gap-3">
          <span className="text-body-07 text-[#898989] flex-shrink-0">•</span>
          <p className="text-body-07 text-[#898989] leading-relaxed">
            본 서비스는 우리은행의 제휴사인 우리투자증권에서 제공합니다
          </p>
        </div>

        <div className="flex gap-3">
          <span className="text-body-07 text-[#898989] flex-shrink-0">•</span>
          <p className="text-body-07 text-[#898989] leading-relaxed">
            우리은행은 서비스 페이지에 연결하는 역할을 하며 서비스의 제공과 책임은 우리투자증권에 있습니다.
          </p>
        </div>

        <div className="flex gap-3">
          <span className="text-body-07 text-[#898989] flex-shrink-0">•</span>
          <p className="text-body-07 text-[#898989] leading-relaxed">
            문의: 우리투자증권 고객센터{" "}
            <a href="tel:1588-1000" className="text-[#0067ac] font-semibold">
              1588-1000
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
