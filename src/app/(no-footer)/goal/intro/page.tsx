import { Suspense } from "react";
import GoalIntroClient from "./GoalIntroClient";

export const dynamic = "force-dynamic"; // CSR 강제 렌더링 보조

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoalIntroClient />
    </Suspense>
  );
}
