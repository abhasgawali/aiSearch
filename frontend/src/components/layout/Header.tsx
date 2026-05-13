import React from 'react';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';

interface HeaderProps {
  logo?: React.ReactNode;
  title?: string;
  rightContent?: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  logo, title, rightContent, user, onLogout,
}) => {
  return (
    <header className="bg-warm-900 border-b border-warm-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {logo && <div>{logo}</div>}
            {title && (
              <h1 className="text-sm font-bold tracking-widest uppercase text-warm-50">
                {title}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-4">
            {rightContent}
            {user && (
              <Dropdown
                trigger={
                  <Avatar
                    size="md"
                    initials={user.name.split(' ').map((n) => n[0]).join('')}
                    src={user.avatar}
                  />
                }
                items={[
                  { label: user.name,  value: 'name'  },
                  { label: user.email, value: 'email' },
                  { divider: true, label: '', value: '' },
                  { label: 'Settings', value: 'settings' },
                  { label: 'Profile',  value: 'profile'  },
                  { divider: true, label: '', value: '' },
                  { label: 'Logout',   value: 'logout'   },
                ]}
                onSelect={(value) => { if (value === 'logout') onLogout?.(); }}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
