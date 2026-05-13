import React from 'react';

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  initials?: string;
  online?: boolean;
}

const sizeMap: Record<string, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  initials,
  online,
  src,
  alt = 'Avatar',
  ...props
}) => {
  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={[
            sizeMap[size],
            'rounded-full object-cover',
            'border-2 border-warm-700',
          ].join(' ')}
          {...props}
        />
      ) : (
        <div
          className={[
            sizeMap[size],
            'rounded-full',
            'bg-gradient-to-br from-warm-700 to-warm-800',
            'border-2 border-warm-600',
            'flex items-center justify-center',
            'font-semibold text-warm-200 tracking-wide uppercase',
          ].join(' ')}
        >
          {initials}
        </div>
      )}
      {online && (
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-warm-900" />
      )}
    </div>
  );
};
