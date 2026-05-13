import React from 'react';
import { Card, CardContent, CardDescription } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label, value, description, icon, trend, onClick,
}) => (
  <Card
    variant="elevated"
    onClick={onClick}
    className={onClick ? 'cursor-pointer hover:bg-warm-750 transition-colors' : ''}
  >
    <CardContent>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <CardDescription className="uppercase text-xs font-semibold tracking-widest text-warm-500 mb-3">
            {label}
          </CardDescription>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-warm-50">{value}</span>
            {trend && (
              <span className={`text-xs font-semibold tracking-wide ${trend.isPositive ? 'text-success' : 'text-error'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {description && <p className="text-warm-400 text-sm mt-2">{description}</p>}
        </div>
        {icon && <div className="text-warm-600 ml-4 mt-1">{icon}</div>}
      </div>
    </CardContent>
  </Card>
);
