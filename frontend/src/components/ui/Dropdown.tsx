import React, { useState, useRef, useEffect } from 'react';

interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  divider?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  trigger: React.ReactNode;
  onSelect: (value: string) => void;
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({
  items, trigger, onSelect, align = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={[
            'absolute top-full mt-2 min-w-[200px]',
            'bg-warm-850 border border-warm-700',
            'rounded-sm shadow-dropdown',
            'z-50 overflow-hidden animate-fadeIn',
            align === 'right' ? 'right-0' : 'left-0',
          ].join(' ')}
        >
          {items.map((item, index) => (
            <div key={index}>
              {item.divider ? (
                <div className="border-t border-warm-800" />
              ) : (
                <button
                  onClick={() => { onSelect(item.value); setIsOpen(false); }}
                  className={[
                    'w-full text-left px-4 py-2.5',
                    'text-warm-300 hover:bg-warm-800 hover:text-warm-50',
                    'text-xs tracking-widest uppercase font-medium',
                    'transition-colors duration-150',
                    'flex items-center gap-2',
                  ].join(' ')}
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
