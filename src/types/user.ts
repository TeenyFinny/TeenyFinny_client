export interface ChildSummary {
  user_id: number;
  name: string;
  balance: number;
}

export interface User {
  user_id: number;
  name: string;
  email: string;
  role: string;
  balance?: number;
}
