"use client";
import File from "@/assets/file.svg";
import Edit from "@/assets/edit.svg";
import Users from "@/assets/users.svg";
import Arrow1 from "@/assets/arrow.svg";
import Financial from "@/assets/trending.svg";
import WalletIcon from "@/assets/wallet.svg";
import Logout from "@/assets/log-out.svg";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function LeftMenu() {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubMenu] = useState<any>({});

  return (
    <nav className="px-5 w-[300px] h-full">
      <div className="flex flex-col justify-between h-full">
        <ul className="flex flex-col pt-20 text-[#5D7285] gap-1 font-medium">

          <Link href="/exams" title="Exames">
            <li className={`${pathname.includes('exams') || pathname.includes('exam') ? 'bg-[#E9F5FE]' : ''} hover:bg-[#E9F5FE] py-5 px-4 rounded-lg cursor-pointer`}>
              <figure className="flex flex-row items-center gap-2">
                <File className="w-[28px] h-[28px]" strokeWidth={2} />
                <figcaption>Exames</figcaption>
              </figure>
            </li>
          </Link>

          <Link href="/expenses" title="Carteira de Títulos">
            <li className={`${pathname.includes('expenses') ? 'bg-[#E9F5FE]' : ''} hover:bg-[#E9F5FE] py-5 px-4 rounded-lg cursor-pointer`}>
              <figure className="flex flex-row items-center gap-2">
                <WalletIcon className="w-[28px] h-[28px]" strokeWidth={2} />
                <figcaption>Carteira de Títulos</figcaption>
              </figure>
            </li>
          </Link>

          <Link href="/services" title="Serviços">
            <li className={`${pathname.includes('services') || pathname.includes('service') ? 'bg-[#E9F5FE]' : ''} hover:bg-[#E9F5FE] py-5 px-4 rounded-lg cursor-pointer`}>
              <figure className="flex flex-row items-center gap-2">
                <Edit className="w-[28px] h-[28px]" strokeWidth={2} />
                <figcaption>Serviços</figcaption>
              </figure>
            </li>
          </Link>

          <li className={`${(openSubmenu?.employee && !openSubmenu?.expenses) ? 'bg-[#E9F5FE]' : ''} hover:bg-[#E9F5FE] px-4 rounded-lg cursor-pointer`}>
            <div 
              onClick={() =>
                setOpenSubMenu({
                  expenses: false,
                  employee: !openSubmenu?.employee
                })
              }
              className="flex py-5 flex-row justify-between items-center"
            >
              <figure className="flex flex-row items-center gap-2">
                <Users className="w-[28px] h-[28px]" strokeWidth={2} />
                <figcaption>Usuários</figcaption>
              </figure>
              <Arrow1 className={`${(openSubmenu?.employee && !openSubmenu?.expenses) ? 'rotate-180' : ''}`} />
            </div>
            <ul className={`${(openSubmenu?.employee && !openSubmenu?.expenses) ? '' : 'hidden'} list-none`}>
              <Link href="/employees" title="Lista de Funcionários">
                <li className="py-4 pl-10 cursor-pointer hover:bg-blue-200 rounded-lg hover:text-black">
                  Lista de Funcionários
                </li>
              </Link>
              <Link href="/patients" title="Lista de Pacientes">
                <li className="py-4 pl-10 cursor-pointer hover:bg-blue-200 rounded-lg hover:text-black">
                  Lista de Pacientes
                </li>
              </Link>
            </ul>
          </li>

          <li 
            onClick={() =>
              setOpenSubMenu({
                employee: false,
                expenses: !openSubmenu?.expenses
              })
            }
            className={`${(openSubmenu?.expenses && !openSubmenu?.employee) ? 'bg-[#E9F5FE]' : ''} hover:bg-[#E9F5FE] px-4 rounded-lg cursor-pointer`}
          >
            <div className="flex py-5 flex-row justify-between items-center gap-3 rounded">
              <figure className="flex flex-row items-center gap-2">
                <Financial className="w-[28px] h-[28px]" strokeWidth={2} />
                <figcaption>Financeiro</figcaption>
              </figure>
              <Arrow1 className={`${(openSubmenu?.expenses && !openSubmenu?.employee) ? 'rotate-180' : ''}`} />
            </div>
            <ul className={`${(openSubmenu?.expenses && !openSubmenu?.employee) ? '' : 'hidden'} list-none`}>
              <Link href="/reports" title="Relatórios">
                <li className="py-4 pl-10 cursor-pointer hover:bg-blue-200 rounded-lg hover:text-black">
                  Relatórios
                </li>
              </Link>
            </ul>
          </li>
        </ul>

        <Link href="/logout" title="Sair">
          <li className="py-4 px-4 hover:bg-[#E9F5FE] rounded-lg cursor-pointer text-[#5D7285] font-medium fixed bottom-5 left-5 w-[250px]">
            <figure className="flex flex-row items-center gap-2">
              <Logout className="w-[28px] h-[28px]" strokeWidth={2} />
              <figcaption>Sair</figcaption>
            </figure>
          </li>
        </Link>
      </div>
    </nav>
  );
}
