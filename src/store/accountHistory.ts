import { create } from "zustand";

interface AccountHistoryState {
  childName: string;
  accountName: string;
  balance: number;
  setHistoryHeader: (params: {
    childName: string;
    accountName: string;
    balance: number;
  }) => void;
}

export const useAccountHistoryStore = create<AccountHistoryState>((set) => ({
  childName: "",
  accountName: "",
  balance: 0,
  setHistoryHeader: ({ childName, accountName, balance }) =>
    set({ childName, accountName, balance }),
}));
