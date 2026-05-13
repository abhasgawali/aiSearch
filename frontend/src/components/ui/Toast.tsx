import React, { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const typeStyles: Record<ToastType, string> = {
  success: 'bg-success-bg border-success-border text-success',
  error:   'bg-error-bg border-error-border text-error',
  info:    'bg-info-bg border-info-border text-info',
  warning: 'bg-warning-bg border-warning-border text-warning',
};

const typeIcons: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
};

export const Toast: React.FC<ToastProps> = ({
  message, type = 'info', duration = 5000, onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={[
        typeStyles[type],
        'border rounded-sm px-4 py-3',
        'flex items-center gap-3',
        'shadow-toast',
        'animate-slideIn',
      ].join(' ')}
    >
      <span className="text-base font-bold">{typeIcons[type]}</span>
      <span className="text-sm tracking-wide">{message}</span>
      <button
        onClick={() => { setIsVisible(false); onClose?.(); }}
        className="ml-auto text-base opacity-60 hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>;
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => (
  <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
    {toasts.map((toast) => (
      <Toast key={toast.id} {...toast} onClose={() => onRemove(toast.id)} />
    ))}
  </div>
);
