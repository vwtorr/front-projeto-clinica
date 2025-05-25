interface ButtonProps {
  id: string;
  initialChecked?: boolean;
  change?: (status: boolean) => void;
  disabled?: boolean; 
}

import { useState } from "react";

export default function ButtonSelector({ id, initialChecked, change, disabled = false }: ButtonProps) {
  const [isChecked, setIsChecked] = useState(initialChecked);

  const handleToggle = () => {
    if (disabled) return; // <- bloqueia se estiver desabilitado

    const newValue = !isChecked;
    setIsChecked(newValue);
    if (change) change(newValue);
  };

  return (
    <div className="flex items-center">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          checked={isChecked}
          onChange={handleToggle}
          disabled={disabled} // <- previne tab/teclado também
        />
        <label
          htmlFor={id}
          className={`w-20 h-10 flex items-center rounded-full cursor-pointer transition-all duration-300 ease-in-out
            ${isChecked ? 'bg-[#03BB85]' : 'bg-[#E55353]'}
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
          `}
        >
          <div
            className={`w-8 h-8 bg-white rounded-full transition-all duration-300 ease-in-out transform
              ${isChecked ? 'translate-x-10' : 'translate-x-2'}
            `}
          />
        </label>

        <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-2">
          <span
            className={`text-sm text-white ${!isChecked ? 'block' : 'hidden'} pointer-events-none`}
            style={{ position: 'absolute', right: '7px', transform: 'translateY(-50%)' }}
          >
            NÃO
          </span>

          <span
            className={`text-sm text-white ${isChecked ? 'block' : 'hidden'} pointer-events-none`}
            style={{ position: 'absolute', left: '10px', transform: 'translateY(-50%)' }}
          >
            SIM
          </span>
        </div>
      </div>
    </div>
  );
}
