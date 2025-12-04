"use client";

import { useState, useEffect } from "react";
import {
  getAutoTransferList,
  executeAutoTransfer,
  AutoTransfer,
  PageResponse,
} from "@/lib/api/adminApi";
import { PushNotification } from "@/components/ui/notice/PushNotification";
import { ConfirmationDialog } from "@/components/ui/modal/ConfirmationDialog";

export default function AutoTransferPage() {
  const [data, setData] = useState<PageResponse<AutoTransfer> | null>(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState<number | null>(null);

  // PushNotification 상태
  const [notiOpen, setNotiOpen] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");

  // 실행 확인 모달 상태
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState<number | null>(null);

  // 필터 상태
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(20);

  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    try {
      const params: Parameters<typeof getAutoTransferList>[0] = { page, size };
      if (status) params.status = status;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const result = await getAutoTransferList(params);
      setData(result);
    } catch (error) {
      console.error("자동이체 목록 조회 실패:", error);
      setNotiMessage("자동이체 목록을 불러오는데 실패했습니다.");
      setNotiOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // 실제 자동이체 실행
  const executeNow = async (id: number) => {
    setExecuting(id);
    try {
      await executeAutoTransfer(id);
      setNotiMessage("자동이체가 실행되었습니다.");
      setNotiOpen(true);
      loadData(); // 목록 새로고침
    } catch (error) {
      console.error("자동이체 실행 실패:", error);
      setNotiMessage("자동이체 실행에 실패했습니다.");
      setNotiOpen(true);
    } finally {
      setExecuting(null);
    }
  };

  // 버튼 클릭 → 모달 열기
  const handleExecuteClick = (id: number) => {
    setTargetId(id);
    setConfirmOpen(true);
  };

  // 초기 로드 및 필터 변경 시 로드
  useEffect(() => {
    loadData();
  }, [page, status, startDate, endDate]);

  // 상태 배지 색상
  const getStatusBadge = (status: string) => {
    const colors = {
      PROCESSING: "bg-info/10 text-info",
      SUCCESS: "bg-success/10 text-success",
      FAIL: "bg-error/10 text-error",
    };
    return (
      colors[status as keyof typeof colors] || "bg-neutral-7 text-neutral-2"
    );
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-head-04 text-neutral-1 mb-4">필터</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-body-07 text-neutral-2 mb-2">
              상태
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 border border-neutral-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-1"
            >
              <option value="">전체</option>
              <option value="PROCESSING">처리중</option>
              <option value="SUCCESS">성공</option>
              <option value="FAIL">실패</option>
            </select>
          </div>

          <div>
            <label className="block text-body-07 text-neutral-2 mb-2">
              시작 날짜
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 border border-neutral-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              종료 날짜
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 border border-neutral-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-1"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setStatus("");
                setStartDate("");
                setEndDate("");
                setPage(0);
              }}
              className="w-full px-4 py-2 bg-neutral-4 text-neutral-1 rounded-md hover:bg-neutral-7"
            >
              필터 초기화
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-monochrome-lightgray">
          <h2 className="text-head-04 text-neutral-1">
            자동이체 목록
            {data && (
              <span className="ml-2 text-body-07 text-neutral-2">
                (총 {data.totalElements}건)
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-body-07 text-neutral-2">
            로딩 중...
          </div>
        ) : data && data.content.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-monochrome-lightgray">
                <thead className="bg-monochrome-lightgray">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-2 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-2 uppercase tracking-wider">
                      사용자 ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-2 uppercase tracking-wider">
                      금액
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-2 uppercase tracking-wider">
                      이체일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-2 uppercase tracking-wider">
                      다음 실행일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-2 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-2 uppercase tracking-wider">
                      메모
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-2 uppercase tracking-wider">
                      작업
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-1">
                        {item.amount.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-1">
                        매월 {item.transferDay}일
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-1">
                        {item.nextTransferDay}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-1 max-w-xs truncate">
                        {item.memo || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-1">
                        <button
                          onClick={() => handleExecuteClick(item.id)}
                          disabled={executing === item.id}
                          className="px-3 py-1 bg-primary-1 text-neutral-7 rounded-md hover:bg-primary-1 disabled:bg-neutral-4 disabled:cursor-not-allowed"
                        >
                          {executing === item.id ? "실행 중..." : "즉시 실행"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이징 */}
            <div className="px-6 py-4 border-t border-monochrome-lightgray flex items-center justify-between">
              <div className="text-sm text-neutral-1">
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
            조회된 자동이체가 없습니다.
          </div>
        )}
      </div>

      {/* 실행 확인 모달 */}
      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={"이 자동이체를\n즉시 실행하시겠어요?"}
        description={""}
        confirmText="실행하기"
        onConfirm={() => {
          if (targetId !== null) {
            executeNow(targetId);
          }
        }}
      />

      {/* 상단 푸시 알림 */}
      <PushNotification
        open={notiOpen}
        setOpen={setNotiOpen}
        message={notiMessage}
      />
    </div>
  );
}


