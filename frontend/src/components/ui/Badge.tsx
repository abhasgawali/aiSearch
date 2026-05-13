import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  default: 'bg-warm-800 text-warm-300 border border-warm-700',
  success: 'bg-success-bg text-success border border-success-border',
  warning: 'bg-warning-bg text-warning border border-warning-border',
  error:   'bg-error-bg text-error border border-error-border',
  info:    'bg-info-bg text-info border border-info-border',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  return (
    <span
      className={[
        variantStyles[variant],
        sizeStyles[size],
        'rounded-sm font-semibold tracking-widest uppercase inline-block',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  );
};
