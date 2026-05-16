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
  children?: React.ReactNode;
  onNewChat?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items, activeItem, onSelect, footer, collapsible = true, children, onNewChat
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
          className="fixed top-4 left-4 z-50 lg:hidden text-cyber-400 hover:text-cyber-50 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      <aside
        className={[
          'fixed top-0 left-0 h-screen',
          'bg-[#0a0a0a] border-r border-[#1a1a1a]',
          'transition-transform duration-300 z-40',
          'font-mono flex flex-col',
          isOpen ? 'w-64' : '-translate-x-full lg:translate-x-0 lg:w-64',
        ].join(' ')}
      >
        <div className="flex flex-col h-full pt-16 lg:pt-8">
          <div className="px-6 mb-10 flex items-center gap-4">
             <div className="w-10 h-10 rounded-lg bg-cyber-900 border border-cyber-800 flex items-center justify-center shadow-md flex-shrink-0">
                <svg className="w-6 h-6 text-cyber-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
             <span className="text-xl font-bold tracking-tight text-white">aiSearch</span>
          </div>

          <div className="px-4 mb-8">
            <button 
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-cyber-primary hover:bg-cyber-primary-hover text-white text-sm font-bold transition-all shadow-lg active:scale-95"
            >
              <span className="text-lg">+</span>
              New Chat
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 space-y-2">
            {items.map((item) => {
              const isActive = activeItem === item.value;
              return (
                <div key={item.value}>
                  <button
                    onClick={() => {
                      onSelect?.(item.value);
                      item.onClick?.();
                      if (item.subItems) toggleSubItems(item.value);
                    }}
                    className={[
                      'w-full px-4 py-3 rounded-lg',
                      'flex items-center gap-3',
                      'transition-all duration-200',
                      'text-sm font-medium tracking-wide',
                      isActive
                        ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/20'
                        : 'text-cyber-400 hover:bg-cyber-800/50 hover:text-cyber-200 border border-transparent',
                    ].join(' ')}
                  >
                    {item.icon && <span className={`text-lg ${isActive ? 'text-cyber-primary' : 'text-cyber-500'}`}>{item.icon}</span>}
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                </div>
              );
            })}
            
            <div className="pt-10">
               <div className="px-4 text-[10px] font-bold text-cyber-600 mb-4 tracking-[0.2em] uppercase">History</div>
               {children}
            </div>
          </nav>

          {footer && (
            <div className="p-4 mt-auto">
               <div className="p-3 bg-[#111111] border border-[#222] rounded-xl">
                  {footer}
               </div>
            </div>
          )}
        </div>
      </aside>

      {isOpen && collapsible && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
