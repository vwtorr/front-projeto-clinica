import { InputHTMLAttributes } from "react";
import Search from "@/assets/search.svg";

interface InputPros extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  searchIcon?: boolean;
  fullWidth?: boolean;
  isFlex?: boolean
}

export function Input({ label, fullWidth, searchIcon, isFlex, ...rest }: InputPros) {
  return (
    <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}>
      {label && (<label className="text-sm text-gray-600">{label}</label>)}
      <div className={`${isFlex ? 'flex' : ''} relative justify-center items-center`}>
        {searchIcon && (<Search className="w-[24px] absolute left-3" />)}
        <input
          className={`${searchIcon ? 'pl-12' : 'pl-4'} pr-10 ${fullWidth ? 'w-full' : ''} py-2 border rounded-md focus:outline-none`}
          {...rest}
        />
      </div>
    </div>
  );
}