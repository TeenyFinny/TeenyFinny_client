// app/saving/page.tsx
'use client'

import api from "@/lib/axios/axios";
import requests from "@/lib/axios/requests";
import { ApiResponse } from "@/types/apiRes.t";
import { HttpError } from "@/types/httpError.t";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Notice<T = unknown> = {
  message: string,
  time: string
};

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState<Notice | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // 인터셉터가 res.data를 반환하므로 res가 응답 바디
        // <ApiResponse<Notice>>는 없어도 작동함 (타입 지정)
        const res = await api.get<ApiResponse<Notice>>(requests.fetchTest);
        if (!mounted) return;
        setData(res.data as Notice);

      } catch (e) {
        const err = e as HttpError;
        if (err.statusCode === 403) {
          alert(err.message);
          router.push("/");
        } else {
          // 필요 시 다른 에러 처리
          console.error(err);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <section>
      <h2 className="text-head-01 mb-12">알림함 페이지입니다.</h2>
      <div>
        메시지 : {data?.message}
      </div>
      <div>
        시간 : {data?.time}
      </div>
    </section>
  );
}