export type UserRole = 'ADMIN' | 'GOVERNMENT_OFFICE' | 'RESIDENT' | 'UTILITY_PROVIDER' | 'EMPLOYEE' | 'MAINTENANCE_TEAM';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  accountStatus: AccountStatus;
}

export interface GovernmentRegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  location: string;
  description: string;
}

export interface ResidentRegisterData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface LoginData {
  email: string;
  password: string;
}
