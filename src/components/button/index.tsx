import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  iconPlus?: boolean;
  variant?: 'default' | 'primary';
}

export default function Button({ label, iconPlus, className = '', variant = 'default', ...rest }: ButtonProps) {
  const baseStyle = 'text-white font-semibold py-2 px-6 rounded';
  const variantStyle =
    variant === 'primary'
      ? 'bg-[#5D7285] hover:bg-[#4e6173]'
      : 'bg-blue-500 hover:bg-blue-600';

  return (
    <div>
      <button
        {...rest}
        className={`${baseStyle} ${variantStyle} ${className}`}
      >
        {iconPlus && <span className="mr-2">+</span>}
        {label}
      </button>
    </div>
  );
}
