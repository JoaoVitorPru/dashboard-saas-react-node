export interface User {
  id: number | string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  created_at: string | Date;
  last_login: string | Date | null;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

export interface MetricData {
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
}

export interface ChartData {
  month: string;
  value: number;
  revenue?: number;
}

export interface AuthUser {
  email: string;
  password: string;
}
