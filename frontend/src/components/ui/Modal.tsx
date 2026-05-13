import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeButton?: boolean;
}

const sizeMap: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeButton = true,
}) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(10,8,6,0.75)' }}
      onClick={onClose}
    >
      <div
        className={[
          sizeMap[size],
          'w-11/12',
          'bg-warm-850',
          'border border-warm-700',
          'rounded-md',
          'p-7',
          'shadow-2xl',
          'max-h-[90vh] overflow-y-auto',
          'animate-fadeIn',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          {title && (
            <h2 className="text-warm-50 font-bold tracking-widest uppercase text-sm">
              {title}
            </h2>
          )}
          {closeButton && (
            <button
              onClick={onClose}
              className="text-warm-500 hover:text-warm-50 transition-colors text-lg leading-none ml-4"
            >
              ✕
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
