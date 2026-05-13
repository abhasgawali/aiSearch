import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'secondary';
  fullScreen?: boolean;
}

const sizeMap: Record<string, string> = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const variantMap: Record<string, { track: string; head: string }> = {
  default:   { track: '#2a2420', head: '#f2ede4' },
  secondary: { track: '#3d3830', head: '#8a7a6a' },
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  fullScreen = false,
}) => {
  const { track, head } = variantMap[variant];

  const spinner = (
    <div
      className={[sizeMap[size], 'rounded-full border-[3px]'].join(' ')}
      style={{
        borderColor: track,
        borderTopColor: head,
        animation: 'spinRing 0.8s linear infinite',
      }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#100e0b]/70 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};
