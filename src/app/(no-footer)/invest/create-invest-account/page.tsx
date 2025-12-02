"use client";
import { useState } from "react";
import Intro from "./Intro";
import Move from "./Move";
import Complete from "./Complete";

export default function Page() {
  const [page, setPage] = useState<'intro' | 'move' | 'complete'>('intro');


  return (
    <>
      {page === 'intro' && <Intro onNext={() => setPage('move')} />}
      {page === 'move' && <Move onNext={() => setPage('complete')} />}
      {page === 'complete' && <Complete />}
    </>
  );
}
