import React, { useState } from 'react';

interface SidebarItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  subItems?: SidebarItem[];
  onClick?: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
  activeItem?: string;
  onSelect?: (value: string) => void;
  footer?: React.ReactNode;
  collapsible?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items, activeItem, onSelect, footer, collapsible = true,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleSubItems = (value: string) => {
    const newSet = new Set(expandedItems);
    if (newSet.has(value)) newSet.delete(value);
    else newSet.add(value);
    setExpandedItems(newSet);
  };

  return (
    <>
      {collapsible && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 lg:hidden text-warm-400 hover:text-warm-50 transition-colors"
        >
          ☰
        </button>
      )}

      <aside
        className={[
          'fixed top-0 left-0 h-screen',
          'bg-warm-900 border-r border-warm-800',
          'transition-all duration-300 z-40',
          isOpen ? 'w-64' : '-translate-x-full lg:translate-x-0 lg:w-64',
        ].join(' ')}
      >
        <div className="flex flex-col h-full pt-20 lg:pt-4">
          <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
            {items.map((item) => (
              <div key={item.value}>
                <button
                  onClick={() => {
                    onSelect?.(item.value);
                    item.onClick?.();
                    if (item.subItems) toggleSubItems(item.value);
                  }}
                  className={[
                    'w-full px-4 py-2.5 rounded-sm',
                    'flex items-center gap-3',
                    'transition-colors duration-150',
                    'text-xs font-semibold tracking-widest uppercase',
                    activeItem === item.value
                      ? 'bg-warm-800 text-warm-50'
                      : 'text-warm-500 hover:bg-warm-850 hover:text-warm-300',
                  ].join(' ')}
                >
                  {item.icon && <span className="text-base">{item.icon}</span>}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.subItems && (
                    <span
                      className={[
                        'text-xs transition-transform duration-200',
                        expandedItems.has(item.value) ? 'rotate-180' : '',
                      ].join(' ')}
                    >
                      ▼
                    </span>
                  )}
                </button>

                {item.subItems && expandedItems.has(item.value) && (
                  <div className="ml-3 mt-0.5 space-y-0.5">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.value}
                        onClick={() => { onSelect?.(subItem.value); subItem.onClick?.(); }}
                        className={[
                          'w-full px-4 py-2 rounded-sm text-left',
                          'text-xs font-medium tracking-widest uppercase',
                          'transition-colors duration-150',
                          activeItem === subItem.value
                            ? 'bg-warm-800 text-warm-50'
                            : 'text-warm-600 hover:text-warm-400',
                        ].join(' ')}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {footer && (
            <div className="px-4 py-4 border-t border-warm-800">
              {footer}
            </div>
          )}
        </div>
      </aside>

      {isOpen && collapsible && (
        <div
          className="fixed inset-0 bg-warm-950/60 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
