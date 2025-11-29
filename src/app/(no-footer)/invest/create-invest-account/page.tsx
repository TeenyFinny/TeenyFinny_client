"use client";
import { useState } from "react";
import Intro from "./Intro";
import Move from "./Move";
import Complete from "./Complete";

export default function Page() {
  const [page, setPage] = useState('intro'); // 'intro' | 'move' | 'complete'

  return (
    <>
      {/* {page === 1 && <Intro onNext={() => setPage(2)} />}
      {page === 2 && <Move onNext={() => setPage(3)} />}
      {page === 3 && <Complete />} */}

      {page === 'intro' && <Intro onNext={() => setPage('move')} />}
      {page === 'move' && <Move onNext={() => setPage('complete')} childId = {1} />}
      {page === 'complete' && <Complete />}
    </>
  );
}
