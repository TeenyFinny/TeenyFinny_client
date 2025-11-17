export interface ChildSummary {
  userId: number;
  name: string;
  balance: number;
  gender: number;
}

export interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
  balance?: number;
}
