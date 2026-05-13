import React from 'react';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  maxValue?: number;
  height?: number;
  showGrid?: boolean;
  title?: string;
  description?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  maxValue,
  height = 200,
  title,
  description,
}) => {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-warm-50 font-bold tracking-widest uppercase text-sm mb-1">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-warm-400 text-sm mb-5">{description}</p>
      )}

      <div
        className="flex items-end justify-center gap-2 md:gap-3"
        style={{ height }}
      >
        {data.map((item, index) => {
          const percentage = (item.value / max) * 100;
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
              style={{ height: '100%', justifyContent: 'flex-end' }}
            >
              <div className="relative flex-1 w-full flex items-end">
                <div
                  className={[
                    'w-full rounded-t-sm',
                    'transition-all duration-500 ease-out',
                    'hover:brightness-125',
                    'cursor-pointer',
                    'group',
                  ].join(' ')}
                  style={{
                    height: `${percentage}%`,
                    minHeight: percentage > 0 ? '4px' : '0',
                    backgroundColor: item.color || 'var(--color-warm-400)',
                  }}
                >
                  {/* Tooltip */}
                  <div
                    className={[
                      'hidden group-hover:flex',
                      'absolute -top-8 left-1/2 -translate-x-1/2',
                      'bg-warm-800 border border-warm-700',
                      'text-warm-50 text-xs px-2 py-1 rounded-sm',
                      'whitespace-nowrap',
                    ].join(' ')}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
              <span className="text-xs text-warm-500 text-center tracking-wide">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
