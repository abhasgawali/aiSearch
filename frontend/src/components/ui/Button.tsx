import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
}

const variantStyles: Record<string, string> = {
  primary: [
    'bg-cream text-warm-950',
    'hover:bg-warm-100',
    'border border-sand',
    'font-semibold tracking-widest uppercase text-2xl',
    'transition-colors duration-200',
  ].join(' '),
  secondary: [
    'bg-warm-800 text-warm-50',
    'hover:bg-warm-750',
    'border border-warm-700',
    'font-medium tracking-wider uppercase text-xs',
    'transition-colors duration-200',
  ].join(' '),
  tertiary: [
    'bg-transparent text-warm-300',
    'hover:text-warm-50 hover:bg-warm-800',
    'border border-warm-700',
    'font-medium tracking-wider uppercase text-xs',
    'transition-colors duration-200',
  ].join(' '),
  ghost: [
    'bg-transparent text-warm-400',
    'hover:text-warm-50',
    'font-medium tracking-wider uppercase text-xs',
    'transition-colors duration-200',
  ].join(' '),
};

const sizeStyles: Record<string, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-sm',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    disabled = false,
    children,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={[
          variantStyles[variant],
          sizeStyles[size],
          'rounded-sm',
          'cursor-pointer',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'inline-flex items-center justify-center gap-2',
          className,
        ].join(' ')}
        {...props}
      >
        {isLoading ? (
          <>
            <span
              className="w-3 h-3 border-2 border-current border-t-transparent rounded-full"
              style={{ animation: 'spinRing 0.8s linear infinite' }}
            />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
