export interface ChildDto {
  userId: number;
  name: string;
  balance: string;
  gender: number;
}

export interface UserDto {
  userId: number;
  name: string;
  role: "PARENT" | "CHILD";
  email: string;
  balance?: string; // 부모
  children?: ChildDto[]; // 부모
  totalBalance?: string; // 자녀
  depositBalance?: string; // 자녀
  investmentBalance?: string; // 자녀
  savingBalance?: string; // 자녀
}

export interface HomeRes {
  user: UserDto;
}
