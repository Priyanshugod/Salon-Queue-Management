import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans tracking-[0.14em] uppercase font-medium rounded-full transition-all duration-200 active:scale-[0.98] focus:outline-none';
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-[11px]',
    md: 'px-6 py-3 text-xs sm:text-sm',
    lg: 'px-8 py-3.5 text-xs sm:text-sm font-semibold',
  };

  const variantStyles = {
    primary: 'bg-[#E07A5F] hover:bg-[#D36B50] text-white shadow-sm hover:shadow-soft-lg',
    secondary: 'bg-[#1F1F1F] hover:bg-[#2C2B2A] text-white shadow-sm',
    outline: 'border border-[#1F1F1F] text-[#1F1F1F] hover:bg-[#1F1F1F] hover:text-white',
    ghost: 'bg-transparent text-[#E07A5F] hover:bg-[#FDF0EC]',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${widthStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
