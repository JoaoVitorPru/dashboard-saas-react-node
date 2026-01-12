import { useState, useEffect } from 'react';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Header } from '../components/Header';
import { MetricCard } from '../components/MetricCard';
import { RevenueChart } from '../components/RevenueChart';
import { UsersTable } from '../components/UsersTable';
import { api } from '../services/api';
import { MetricData, ChartData, User } from '../types';

export const Dashboard = () => {
  useProtectedRoute();

  const [metrics, setMetrics] = useState<{
    activeUsers: MetricData;
    monthlyRevenue: MetricData;
    newRegistrations: MetricData;
    conversionRate: MetricData;
  } | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [metricsData, chartDataResult, usersData] = await Promise.all([
        api.getMetrics(),
        api.getChartData(),
        api.getUsers(),
      ]);

      setMetrics(metricsData);
      setChartData(chartDataResult);
      setUsers(usersData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Dashboard SaaS" />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Dashboard SaaS" />
        <div className="flex items-center justify-center h-96">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard SaaS" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard metric={metrics.activeUsers} />
          <MetricCard metric={metrics.monthlyRevenue} />
          <MetricCard metric={metrics.newRegistrations} />
          <MetricCard metric={metrics.conversionRate} />
        </div>

        {/* Gráfico de Faturamento */}
        <div className="mb-8">
          <RevenueChart data={chartData} />
        </div>

        {/* Tabela de Usuários */}
        <div>
          <UsersTable users={users} onRefresh={fetchData} />
        </div>
      </main>
    </div>
  );
};
