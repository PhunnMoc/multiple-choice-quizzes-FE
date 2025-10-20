'use client';

import React from 'react';

type Align = 'left' | 'center' | 'right';

interface TypographyProps {
  children: React.ReactNode;
  align?: Align;
  className?: string;
}

export function H1({ children, align = 'left', className = '' }: TypographyProps) {
  return (
    <h1 className={[
      'text-3xl font-bold text-gray-800',
      'font-[Euclid_Circular_A,Helvetica_Neue,Helvetica,Arial,sans-serif]',
      align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left',
      className,
    ].join(' ').trim()}>
      {children}
    </h1>
  );
}

export function H2({ children, align = 'left', className = '' }: TypographyProps) {
  return (
    <h2 className={[
      'text-2xl font-bold text-gray-800',
      'font-[Euclid_Circular_A,Helvetica_Neue,Helvetica,Arial,sans-serif]',
      align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left',
      className,
    ].join(' ').trim()}>
      {children}
    </h2>
  );
}

export function H3({ children, align = 'left', className = '' }: TypographyProps) {
  return (
    <h3 className={[
      'text-xl font-bold text-gray-800',
      'font-[Euclid_Circular_A,Helvetica_Neue,Helvetica,Arial,sans-serif]',
      align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left',
      className,
    ].join(' ').trim()}>
      {children}
    </h3>
  );
}

export function Subtle({ children, align = 'left', className = '' }: TypographyProps) {
  return (
    <p className={[
      'text-gray-600 text-[13px]',
      'font-[Euclid_Circular_A,Helvetica_Neue,Helvetica,Arial,sans-serif]',
      align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left',
      className,
    ].join(' ').trim()}>
      {children}
    </p>
  );
}

export function Body({ children, align = 'left', className = '' }: TypographyProps) {
  return (
    <p className={[
      'text-gray-400 text-[13px]',
      'font-[Euclid_Circular_A,Helvetica_Neue,Helvetica,Arial,sans-serif]',
      align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left',
      className,
    ].join(' ').trim()}>
      {children}
    </p>
  );
}

export default { H1, H2, H3, Subtle, Body };


