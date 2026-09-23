import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-sm focus-visible:ring-[#4F46E5]',
    secondary: 'bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4F46E5] font-semibold focus-visible:ring-[#4F46E5]',
    outline: 'border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#111827] focus-visible:ring-[#4F46E5]',
    ghost: 'hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] focus-visible:ring-[#4F46E5]',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus-visible:ring-red-500',
    success: 'bg-[#059669] hover:bg-[#047857] text-white shadow-sm focus-visible:ring-[#059669]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
};
