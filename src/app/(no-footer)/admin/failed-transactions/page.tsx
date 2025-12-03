"use client";

import { useState, useEffect } from "react";
import {
  getFailedTransactions,
  FailedTransaction,
  PageResponse,
} from "@/lib/api/adminApi";
import { PushNotification } from "@/components/ui/notice/PushNotification";

export default function FailedTransactionsPage() {
  const [data, setData] = useState<PageResponse<FailedTransaction> | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // PushNotification 상태
  const [notiOpen, setNotiOpen] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");

  // 필터 상태
  const [autoTransferOnly, setAutoTransferOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(20);

  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getFailedTransactions({
        autoTransferOnly,
        page,
        size,
      });
      setData(result);
    } catch (error) {
      console.error("실패 거래 조회 실패:", error);
      setNotiMessage("실패 거래 목록을 불러오는데 실패했습니다.");
      setNotiOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 및 필터 변경 시 로드
  useEffect(() => {
    loadData();
  }, [page, autoTransferOnly]);

  // 거래 코드 배지 색상
  const getCodeBadge = (code: string) => {
    if (code.includes("AUTO")) {
      return "bg-purple-100 text-purple-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-head-04 text-neutral-1 mb-4">필터</h2>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoTransferOnly}
              onChange={(e) => {
                setAutoTransferOnly(e.target.checked);
                setPage(0);
              }}
              className="w-4 h-4 text-primary-1 border-neutral-4 rounded focus:ring-primary-1"
            />
            <span className="text-sm font-medium text-gray-700">
              자동이체 관련 거래만 보기
            </span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-monochrome-lightgray">
          <h2 className="text-head-04 text-neutral-1">
            실패한 거래 목록
            {data && (
              <span className="ml-2 text-body-07 text-neutral-2">
                (총 {data.totalElements}건)
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">로딩 중...</div>
        ) : data && data.content.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-monochrome-lightgray">
                <thead className="bg-monochrome-lightgray">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-2 uppercase tracking-wider">
                      거래 ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-2 uppercase tracking-wider">
                      사용자 ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-2 uppercase tracking-wider">
                      계좌번호
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-2 uppercase tracking-wider">
                      거래 코드
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-2 uppercase tracking-wider">
                      가맹점명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-2 uppercase tracking-wider">
                      금액
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-2 uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-2 uppercase tracking-wider">
                      거래 일시
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-monochrome-lightgray">
                  {data.content.map((item) => (
                    <tr key={item.id} className="hover:bg-monochrome-lightgray">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-1">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-1">
                        {item.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-1 font-mono">
                        {item.accountNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getCodeBadge(
                            item.code
                          )}`}
                        >
                          {item.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-1 max-w-xs truncate">
                        {item.merchantName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-1">
                        {item.amount.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-1">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-1">
                        {new Date(item.transactionDate).toLocaleString("ko-KR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이징 */}
            <div className="px-6 py-4 border-t border-monochrome-lightgray flex items-center justify-between">
              <div className="text-sm text-gray-700">
                페이지 {data.number + 1} / {data.totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={data.first}
                  className="px-4 py-2 bg-white border border-monochrome-lightgray rounded-md text-sm font-medium text-neutral-1 hover:bg-neutral-7 disabled:bg-neutral-4 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={data.last}
                  className="px-4 py-2 bg-white border border-monochrome-lightgray rounded-md text-sm font-medium text-neutral-1 hover:bg-neutral-7 disabled:bg-neutral-4 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-body-07 text-neutral-2">
            조회된 실패 거래가 없습니다.
          </div>
        )}
      </div>

      {/* 상단 푸시 알림 */}
      <PushNotification
        open={notiOpen}
        setOpen={setNotiOpen}
        message={notiMessage}
      />
    </div>
  );
}


