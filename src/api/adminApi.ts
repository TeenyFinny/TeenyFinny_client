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
  /**
   * ⚠️ 주의: `api` 래퍼는 런타임에서 `res.data`만 반환하지만,
   * 타입 시그니처는 여전히 AxiosResponse 기반이라서 바로 캐스팅 시 TS 에러가 발생합니다.
   * 따라서 `any`로 한 번 우회 캐스팅한 뒤, 해당 엔드포인트가
   * Spring `Page<AdminAutoTransferRes>`를 그대로 반환한다고 가정하고 `PageResponse<AutoTransfer>`로 사용합니다.
   */
  const response = (await api.get('/admin/auto-transfer', {
    params,
  })) as any;
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
  const response = (await api.get('/admin/transaction/failed', {
    params,
  })) as any;
  return response as PageResponse<FailedTransaction>;
};
