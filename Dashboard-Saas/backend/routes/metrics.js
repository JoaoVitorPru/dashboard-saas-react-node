import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Obter métricas gerais (KPIs)
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Usuários ativos
    const [activeUsersResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM platform_users WHERE status = "active"'
    );
    const activeUsers = activeUsersResult[0].count;

    // Faturamento mensal (último mês)
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const [revenueResult] = await pool.execute(
      `SELECT SUM(amount) as total FROM transactions 
       WHERE status = 'completed' 
       AND DATE_FORMAT(transaction_date, '%Y-%m') = ?`,
      [currentMonth]
    );
    const monthlyRevenue = parseFloat(revenueResult[0].total || 0);

    // Novos cadastros (mês atual)
    const [newRegistrationsResult] = await pool.execute(
      `SELECT COUNT(*) as count FROM platform_users 
       WHERE DATE_FORMAT(created_at, '%Y-%m') = ?`,
      [currentMonth]
    );
    const newRegistrations = newRegistrationsResult[0].count;

    // Taxa de conversão (usuários ativos / total)
    const [totalUsersResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM platform_users'
    );
    const totalUsers = totalUsersResult[0].count;
    const conversionRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

    // Calcular variação (simplificado - comparando com mês anterior)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().slice(0, 7);

    const [lastMonthActive] = await pool.execute(
      `SELECT COUNT(*) as count FROM platform_users 
       WHERE status = 'active' 
       AND DATE_FORMAT(created_at, '%Y-%m') <= ?`,
      [lastMonthStr]
    );
    const lastMonthActiveCount = lastMonthActive[0].count;
    const activeUsersChange = lastMonthActiveCount > 0
      ? ((activeUsers - lastMonthActiveCount) / lastMonthActiveCount) * 100
      : 0;

    const [lastMonthRevenue] = await pool.execute(
      `SELECT SUM(amount) as total FROM transactions 
       WHERE status = 'completed' 
       AND DATE_FORMAT(transaction_date, '%Y-%m') = ?`,
      [lastMonthStr]
    );
    const lastMonthRevenueValue = parseFloat(lastMonthRevenue[0].total || 0);
    const revenueChange = lastMonthRevenueValue > 0
      ? ((monthlyRevenue - lastMonthRevenueValue) / lastMonthRevenueValue) * 100
      : 0;

    res.json({
      activeUsers: {
        label: 'Usuários Ativos',
        value: activeUsers,
        change: parseFloat(activeUsersChange.toFixed(1)),
        changeType: activeUsersChange >= 0 ? 'increase' : 'decrease',
      },
      monthlyRevenue: {
        label: 'Faturamento Mensal',
        value: monthlyRevenue,
        change: parseFloat(revenueChange.toFixed(1)),
        changeType: revenueChange >= 0 ? 'increase' : 'decrease',
      },
      newRegistrations: {
        label: 'Novos Cadastros',
        value: newRegistrations,
        change: -5.2, // Simplificado
        changeType: 'decrease',
      },
      conversionRate: {
        label: 'Taxa de Conversão',
        value: parseFloat(conversionRate.toFixed(1)),
        change: 2.1, // Simplificado
        changeType: 'increase',
      },
    });
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    res.status(500).json({ error: 'Erro ao buscar métricas' });
  }
});

// Obter dados para gráfico (últimos 6 meses)
router.get('/chart', authenticateToken, async (req, res) => {
  try {
    const [metrics] = await pool.execute(
      `SELECT 
        month_year,
        active_users as value,
        revenue
      FROM monthly_metrics 
      ORDER BY month_year DESC 
      LIMIT 6`
    );

    // Formatar para o formato esperado pelo frontend
    const formatted = metrics.reverse().map(metric => ({
      month: new Date(metric.month_year + '-01').toLocaleDateString('pt-BR', { month: 'short' }),
      value: metric.value,
      revenue: parseFloat(metric.revenue),
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Erro ao buscar dados do gráfico:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do gráfico' });
  }
});

// Obter transações
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const [transactions] = await pool.execute(
      `SELECT 
        t.id,
        t.amount,
        t.type,
        t.description,
        t.status,
        t.transaction_date as date,
        p.name as userName,
        p.id as userId
      FROM transactions t
      JOIN platform_users p ON t.platform_user_id = p.id
      ORDER BY t.transaction_date DESC
      LIMIT 50`
    );

    res.json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

export default router;
