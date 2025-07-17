import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = ({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  let variantClasses = '';
  let sizeClasses = '';

  switch (variant) {
    case 'default':
      variantClasses = 'bg-orange-500 text-white hover:bg-orange-600';
      break;
    case 'outline':
      variantClasses = 'border border-input bg-background hover:bg-accent hover:text-accent-foreground';
      break;
    case 'ghost':
      variantClasses = 'hover:bg-accent hover:text-accent-foreground';
      break;
  }

  switch (size) {
    case 'default':
      sizeClasses = 'h-10 px-4 py-2';
      break;
    case 'sm':
      sizeClasses = 'h-9 rounded-md px-3';
      break;
    case 'lg':
      sizeClasses = 'h-11 rounded-md px-8';
      break;
    case 'icon':
      sizeClasses = 'h-10 w-10';
      break;
  }

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

export default Button;