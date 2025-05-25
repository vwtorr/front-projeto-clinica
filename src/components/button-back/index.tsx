// components/Button.tsx
import { ReactNode } from 'react';

interface ButtonProps {
  children?: ReactNode; 
  onClick?: () => void; 
}

export default function ButtonBack({ children, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className="btn-back">
      {children}
    </button>
  );
}
