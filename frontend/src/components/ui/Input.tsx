import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', icon, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={[
              'w-full',
              'bg-warm-900',
              'border',
              error
                ? 'border-error focus:border-error focus:ring-error/20'
                : 'border-warm-700 focus:border-warm-400 focus:ring-warm-400/20',
              'rounded-sm',
              'px-4 py-3',
              icon ? 'pl-10' : '',
              'text-warm-50 text-sm',
              'placeholder-warm-600',
              'focus:outline-none focus:ring-2',
              'transition-colors duration-200',
              className,
            ].join(' ')}
            {...props}
          />
        </div>
        {error && (
          <p className="text-error text-xs mt-2 tracking-wide">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-warm-500 text-xs mt-2 tracking-wide">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
