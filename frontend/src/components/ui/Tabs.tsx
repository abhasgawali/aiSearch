import React, { useState } from 'react';

interface Tab {
  label: string;
  value: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (value: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  return (
    <div className="w-full">
      <div className="flex border-b border-warm-800">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={[
              'px-4 py-3 text-xs font-semibold tracking-widest uppercase',
              'transition-all duration-200',
              'border-b-2 -mb-px',
              'flex items-center gap-2',
              activeTab === tab.value
                ? 'border-warm-200 text-warm-50'
                : 'border-transparent text-warm-500 hover:text-warm-300',
            ].join(' ')}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.map(
          (tab) =>
            activeTab === tab.value && (
              <div key={tab.value} className="animate-fadeIn">
                {tab.content}
              </div>
            )
        )}
      </div>
    </div>
  );
};
