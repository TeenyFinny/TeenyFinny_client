export default function TermsServicePage() {

  return (
    <main className="flex flex-col h-full bg-neutral-7">
      {/* 본문 (HTML 파일 iframe) */}
      <div className="flex-1 px-[27px] pb-[20px]">
        <iframe
            title="서비스 이용 약관"
            src="/terms/terms_service.html"
            className="w-full h-full border-0 no-scrollbar"
        />
      </div>
    </main>
  );
}
