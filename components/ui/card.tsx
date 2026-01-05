import React from 'react';

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, hover = false, className = '', onClick }: CardProps) {
  const hoverClasses = hover
    ? 'cursor-pointer hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200'
    : '';

  return (
    <div
      className={`bg-white rounded-xl border border-stone-200 shadow-sm ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 border-b border-stone-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-lg font-semibold text-stone-900 ${className}`}>{children}</h3>;
}

