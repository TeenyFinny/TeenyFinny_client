"use client";

import { useEffect, useState } from "react";

export default function TermsServicePage() {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const response = await fetch("/terms/terms_service.html");
        const html = await response.text();
        // style 태그 내용 추출
        const styleMatch = html.match(/<style[^>]*>([\s\S]*)<\/style>/i);
        let styleContent = styleMatch ? styleMatch[1] : "";
        // body 스타일을 스코프화 (body를 .terms-content로 변경)
        styleContent = styleContent.replace(/body\s*{/g, '.terms-content {');
        // body 태그 내용 추출
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1] : html;
        // style과 body 내용을 합쳐서 렌더링
        const fullContent = styleContent 
          ? `<style>${styleContent}</style><div class="terms-content">${bodyContent}</div>`
          : `<div class="terms-content">${bodyContent}</div>`;
        setHtmlContent(fullContent);
      } catch (error) {
        console.error("약관 HTML 로드 실패:", error);
        setHtmlContent("<p>약관을 불러올 수 없습니다.</p>");
      } finally {
        setLoading(false);
      }
    };

    fetchHtml();
  }, []);

  if (loading) {
    return (
      <main className="flex flex-col h-full bg-neutral-7 items-center justify-center">
        <p className="text-neutral-3">로딩 중...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col h-full bg-neutral-7">
      {/* 본문 (HTML 직접 렌더링) */}
      <div 
        className="flex-1 px-[27px] pb-[20px] overflow-y-auto"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </main>
  );
}
