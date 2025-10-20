'use client';

import React from 'react';

type IconButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'white';
type IconButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  isLoading?: boolean;
  icon: React.ReactNode;
  'aria-label': string; // Required for accessibility
}

const baseClasses = 'font-bold rounded-xl transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center';

const variantClasses: Record<IconButtonVariant, string> = {
  primary: 'bg-[#c3f832] text-black hover:bg-[#b0e82a] hover:scale-105 focus:ring-[#c3f832]',
  secondary: 'bg-black hover:bg-black-800 text-[#c3f832] hover:scale-105',
  danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
  ghost: 'bg-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-400 border border-gray-200',
  white: 'bg-white text-gray-900 hover:bg-gray-100 focus:ring-gray-300',
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-14 h-14',
};

const iconSizeClasses: Record<IconButtonSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7',
};

export function IconButton({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  icon,
  disabled,
  ...props
}: IconButtonProps) {
  const sizeClass = sizeClasses[size];
  const iconSizeClass = iconSizeClasses[size];
  const classes = [baseClasses, variantClasses[variant], sizeClass, className].join(' ').trim();

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className={`${iconSizeClass} animate-spin rounded-full border-2 border-current border-t-transparent`} />
      ) : (
        <div className={iconSizeClass}>
          {icon}
        </div>
      )}
    </button>
  );
}

export default IconButton;
