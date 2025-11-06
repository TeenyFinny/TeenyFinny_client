"use client"

import {Button} from "@/components/ui/button"
import CardForTest from "@/components/test/ui/card/CardForTest";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation"

export default function Home() {
  const { userName, userType, setUser } = useUserStore()
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start text-head-02">
        <h1>추후 랜딩 페이지가 될 페이지입니다.</h1>
        이름 : {userName || "미정"} <br/>
        역할 : {userType || "미정"}
        <button onClick={() => setUser("민트", "aso8eyf2o3rkes", "child")}
          className="bg-primary-3 text-neutral-1 text-body-01 rounded-sm p-2">
          자녀 유저로 설정하기
        </button>
        <button onClick={() => setUser("박부모", "aso8eyf2o3rkes", "parent")}
          className="bg-primary-3 text-neutral-1 text-body-01 rounded-sm p-2">
          부모 유저로 설정하기
        </button>
        <button onClick={() => router.push("/home")}
          className="bg-primary-1 text-neutral-7 text-body-01 rounded-sm p-2">
          홈 메뉴 페이지로 이동하기
        </button>
        <button onClick={() => router.push("/login")}
          className="bg-primary-1 text-neutral-7 text-body-01 rounded-sm p-2">
          Auth 페이지로 이동하기
        </button>
      </main>
    </div>
  );
}
