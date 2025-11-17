"use client";
import { useState } from "react";
import Intro from "./Intro";
import Move from "./Move";
import Complete from "./Complete";

export default function Page() {
  const [page, setPage] = useState(1);

  return (
    <>
      {page === 1 && <Intro onNext={() => setPage(2)} />}
      {page === 2 && <Move onNext={() => setPage(3)} />}
      {page === 3 && <Complete />}
    </>
  );
}
