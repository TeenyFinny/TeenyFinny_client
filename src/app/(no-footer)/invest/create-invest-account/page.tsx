"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Intro from "./Intro";
import Move from "./Move";
import Complete from "./Complete";

export default function Page() {
  const [page, setPage] = useState<'intro' | 'move' | 'complete'>('intro');

  const searchParams = useSearchParams();
  const childIdParam = searchParams.get('childId'); // URL에서 childId 가져오기
  const childId = Number(childIdParam);

  return (
    <>
      {page === 'intro' && <Intro onNext={() => setPage('move')} />}
      {page === 'move' && <Move onNext={() => setPage('complete')} childId={childId} />}
      {page === 'complete' && <Complete />}
    </>
  );
}
