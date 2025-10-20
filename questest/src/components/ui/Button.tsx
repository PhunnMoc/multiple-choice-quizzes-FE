'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'white';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const baseClasses = 'font-bold rounded-xl transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#c3f832] text-black hover:bg-[#b0e82a] hover:scale-105 focus:ring-[#c3f832]',
  secondary: 'bg-black hover:bg-black-800 text-[#c3f832] hover:scale-105',
  danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
  ghost: 'bg-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-400 border border-gray-200',
  white: 'bg-white text-gray-900 hover:bg-gray-100 focus:ring-gray-300',
};

const sizeClasses: Record<Exclude<ButtonSize, 'full'>, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3',
  xl: 'px-8 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const sizeClass = size === 'full' ? 'w-full px-6 py-3' : sizeClasses[size];
  const classes = [baseClasses, variantClasses[variant], sizeClass, className].join(' ').trim();

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}

export default Button;


