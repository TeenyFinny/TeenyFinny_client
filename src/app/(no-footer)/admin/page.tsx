'use client';

export default function AdminPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          자동이체 관리
        </h2>
        <p className="text-gray-600 mb-4">
          전체 자동이체를 조회하고 수동으로 실행할 수 있습니다.
        </p>
        <a
          href="/admin/auto-transfer"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          자동이체 관리로 이동
        </a>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          실패 거래 조회
        </h2>
        <p className="text-gray-600 mb-4">
          실패한 거래 내역을 조회하고 분석할 수 있습니다.
        </p>
        <a
          href="/admin/failed-transactions"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          실패 거래 조회로 이동
        </a>
      </div>
    </div>
  );
}
