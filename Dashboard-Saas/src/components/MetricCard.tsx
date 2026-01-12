import { MetricData } from '../types';

interface MetricCardProps {
  metric: MetricData;
}

export const MetricCard = ({ metric }: MetricCardProps) => {
  const isIncrease = metric.changeType === 'increase';
  const changeColor = isIncrease ? 'text-green-600' : 'text-red-600';
  const changeIcon = isIncrease ? '↑' : '↓';

  const formatValue = (value: number): string => {
    if (metric.label.includes('Faturamento')) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    }
    if (metric.label.includes('Taxa')) {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString('pt-BR');
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-3xl font-bold text-gray-900">{formatValue(metric.value)}</p>
        <div className={`flex items-center text-sm font-medium ${changeColor}`}>
          <span className="mr-1">{changeIcon}</span>
          <span>{Math.abs(metric.change)}%</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">vs. mês anterior</p>
    </div>
  );
};
