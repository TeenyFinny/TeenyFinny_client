import api from "@/lib/axios/axios";

// 자동이체 목록 응답 타입
export interface AutoTransfer {
  id: number;
  userId: number;
  userName?: string;
  fromAccountId: number;
  fromAccountNumber?: string;
  toAccountId: number;
  toAccountNumber?: string;
  amount: number;
  memo: string;
  transferDay: number;
  nextTransferDay: string;
  status: 'PROCESSING' | 'SUCCESS' | 'FAIL';
  createdAt: string;
}

// 실패 거래 응답 타입
export interface FailedTransaction {
  id: number;
  userId: number;
  accountId: number;
  accountNumber: string;
  code: string;
  type: string;
  amount: number;
  balanceAfter: number;
  merchantName: string;
  category: string;
  status: string;
  transactionDate: string;
  createdAt: string;
}

// 페이징 응답 타입
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

/**
 * 자동이체 목록 조회
 */
export const getAutoTransferList = async (params: {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<AutoTransfer>> => {
  // axios 래퍼(api)는 res.data를 그대로 반환하므로 .data를 한 번 더 접근하면 안 됨
  const response = await api.get<PageResponse<AutoTransfer>>('/admin/auto-transfer', { params });
  return response as PageResponse<AutoTransfer>;
};

/**
 * 자동이체 수동 실행
 */
export const executeAutoTransfer = async (autoTransferId: number): Promise<void> => {
  await api.post(`/admin/auto-transfer/${autoTransferId}/execute`);
};

/**
 * 실패한 거래 목록 조회
 */
export const getFailedTransactions = async (params: {
  autoTransferOnly?: boolean;
  page?: number;
  size?: number;
}): Promise<PageResponse<FailedTransaction>> => {
  const response = await api.get<PageResponse<FailedTransaction>>('/admin/transaction/failed', { params });
  return response as PageResponse<FailedTransaction>;
};
