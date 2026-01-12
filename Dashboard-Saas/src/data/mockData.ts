import { User, Transaction, ChartData } from '../types';

// Dados mockados de usuários
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@example.com',
    role: 'Administrador',
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2024-12-20',
  },
  {
    id: '2',
    name: 'Carlos Santos',
    email: 'carlos.santos@example.com',
    role: 'Usuário',
    status: 'active',
    createdAt: '2024-02-20',
    lastLogin: '2024-12-19',
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@example.com',
    role: 'Editor',
    status: 'active',
    createdAt: '2024-03-10',
    lastLogin: '2024-12-18',
  },
  {
    id: '4',
    name: 'João Pereira',
    email: 'joao.pereira@example.com',
    role: 'Usuário',
    status: 'inactive',
    createdAt: '2024-01-05',
    lastLogin: '2024-11-15',
  },
  {
    id: '5',
    name: 'Fernanda Costa',
    email: 'fernanda.costa@example.com',
    role: 'Editor',
    status: 'active',
    createdAt: '2024-04-12',
    lastLogin: '2024-12-20',
  },
  {
    id: '6',
    name: 'Ricardo Alves',
    email: 'ricardo.alves@example.com',
    role: 'Usuário',
    status: 'active',
    createdAt: '2024-05-18',
    lastLogin: '2024-12-19',
  },
  {
    id: '7',
    name: 'Juliana Lima',
    email: 'juliana.lima@example.com',
    role: 'Administrador',
    status: 'active',
    createdAt: '2024-06-22',
    lastLogin: '2024-12-20',
  },
  {
    id: '8',
    name: 'Pedro Martins',
    email: 'pedro.martins@example.com',
    role: 'Usuário',
    status: 'inactive',
    createdAt: '2024-02-14',
    lastLogin: '2024-10-30',
  },
];

// Dados mockados de transações
export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    userId: '1',
    userName: 'Ana Silva',
    amount: 1500.00,
    type: 'credit',
    description: 'Assinatura Premium',
    status: 'completed',
    date: '2024-12-20',
  },
  {
    id: 't2',
    userId: '2',
    userName: 'Carlos Santos',
    amount: 299.90,
    type: 'credit',
    description: 'Plano Básico',
    status: 'completed',
    date: '2024-12-19',
  },
  {
    id: 't3',
    userId: '3',
    userName: 'Maria Oliveira',
    amount: 750.00,
    type: 'credit',
    description: 'Assinatura Pro',
    status: 'pending',
    date: '2024-12-19',
  },
  {
    id: 't4',
    userId: '5',
    userName: 'Fernanda Costa',
    amount: 1500.00,
    type: 'credit',
    description: 'Assinatura Premium',
    status: 'completed',
    date: '2024-12-18',
  },
  {
    id: 't5',
    userId: '6',
    userName: 'Ricardo Alves',
    amount: 299.90,
    type: 'credit',
    description: 'Plano Básico',
    status: 'failed',
    date: '2024-12-18',
  },
  {
    id: 't6',
    userId: '7',
    userName: 'Juliana Lima',
    amount: 750.00,
    type: 'credit',
    description: 'Assinatura Pro',
    status: 'completed',
    date: '2024-12-17',
  },
];

// Dados mockados para gráficos (últimos 6 meses)
export const mockChartData: ChartData[] = [
  { month: 'Jul', value: 1250, revenue: 45000 },
  { month: 'Ago', value: 1420, revenue: 52000 },
  { month: 'Set', value: 1680, revenue: 61000 },
  { month: 'Out', value: 1890, revenue: 69000 },
  { month: 'Nov', value: 2100, revenue: 78000 },
  { month: 'Dez', value: 2350, revenue: 85000 },
];

// Métricas calculadas
export const getMetrics = () => {
  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const monthlyRevenue = mockTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const newRegistrations = mockUsers.filter(
    u => new Date(u.createdAt) >= new Date('2024-12-01')
  ).length;
  const conversionRate = ((activeUsers / mockUsers.length) * 100).toFixed(1);

  return {
    activeUsers: {
      label: 'Usuários Ativos',
      value: activeUsers,
      change: 12.5,
      changeType: 'increase' as const,
    },
    monthlyRevenue: {
      label: 'Faturamento Mensal',
      value: monthlyRevenue,
      change: 8.3,
      changeType: 'increase' as const,
    },
    newRegistrations: {
      label: 'Novos Cadastros',
      value: newRegistrations,
      change: -5.2,
      changeType: 'decrease' as const,
    },
    conversionRate: {
      label: 'Taxa de Conversão',
      value: parseFloat(conversionRate),
      change: 2.1,
      changeType: 'increase' as const,
    },
  };
};
