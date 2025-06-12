"use client";

import Layout from "@/components/layout";
import { useState } from "react";

type OpeningHour = {
    day: string;
    working: boolean;
    open: string;
    close: string;
    lunchStart: string;
    lunchEnd: string;
};

const daysOfWeek = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
];


export default function OpeningHours() {
    const [intervalo, setIntervalo] = useState<number | ''>('') // vazio por padrão
    const [permiteMultiplos, setPermiteMultiplos] = useState(false)
    const [hours, setHours] = useState<OpeningHour[]>(
        daysOfWeek.map((day) => ({
            day,
            working: false,
            open: "",
            close: "",
            lunchStart: "",
            lunchEnd: "",
        }))
    );

    const handleChange = (
        index: number,
        field: keyof OpeningHour,
        value: string | boolean
    ) => {
        const updated = [...hours];
        updated[index][field] = value as never;
        setHours(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(hours);
        alert("Horários salvos com sucesso!");

    };

    return (
        <Layout>

            <h1 className="text-4xl font-bold mb-6 text-[#5D7285]">
                Agenda de Funcionamento da Clínica
            </h1>
            <div className="w-full h-[1px] my-8 bg-slate-400" ></div>

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-xl p-6"
            >
                <div className="overflow-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-600">
                                <th className="p-4 text-left">Dia</th>
                                <th className="p-4 text-center">Trabalha?</th>
                                <th className="p-4 text-center">Abertura</th>
                                <th className="p-4 text-center">Fechamento</th>
                                <th className="p-4 text-center">Início da Pausa</th>
                                <th className="p-4 text-center">Fim da Pausa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hours.map((item, index) => (
                                <tr
                                    key={item.day}
                                    className="hover:bg-slate-50 border-b border-slate-200"
                                >
                                    <td className="p-4 font-medium text-slate-700">
                                        {item.day}
                                    </td>
                                    <td className="p-4 text-center">
                                        <input
                                            type="checkbox"
                                            checked={item.working}
                                            onChange={(e) =>
                                                handleChange(index, "working", e.target.checked)
                                            }
                                            className="h-5 w-5 text-blue-600"
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <input
                                            type="time"
                                            disabled={!item.working}
                                            value={item.open}
                                            onChange={(e) =>
                                                handleChange(index, "open", e.target.value)
                                            }
                                            className="border rounded-md px-3 py-1 w-32 disabled:opacity-50"
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <input
                                            type="time"
                                            disabled={!item.working}
                                            value={item.close}
                                            onChange={(e) =>
                                                handleChange(index, "close", e.target.value)
                                            }
                                            className="border rounded-md px-3 py-1 w-32 disabled:opacity-50"
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <input
                                            type="time"
                                            disabled={!item.working}
                                            value={item.lunchStart}
                                            onChange={(e) =>
                                                handleChange(index, "lunchStart", e.target.value)
                                            }
                                            className="border rounded-md px-3 py-1 w-32 disabled:opacity-50"
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <input
                                            type="time"
                                            disabled={!item.working}
                                            value={item.lunchEnd}
                                            onChange={(e) =>
                                                handleChange(index, "lunchEnd", e.target.value)
                                            }
                                            className="border rounded-md px-3 py-1 w-32 disabled:opacity-50"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <p className="text-sm text-slate-500 mt-2">
                        <span className="font-semibold">Atenção:</span> O preenchimento dos campos de <span className="text-blue-600 font-medium">início</span> e <span className="text-blue-600 font-medium">fim da pausa</span> é <span className="font-semibold">opcional</span>. Caso não haja pausa neste dia, deixe os campos em branco.
                    </p>

                </div>
            </form>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-10">
                <h2 className="text-2xl font-semibold text-[#5D7285] mb-6 flex items-center gap-2 ">
                    Configuração de Agendamento
                </h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Intervalo entre exames (minutos):
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={intervalo}
                        onChange={(e) => setIntervalo(parseInt(e.target.value))}
                        placeholder="Ex: 15"
                        className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2 ">
                        Permitir agendamentos múltiplos por horário?
                    </label>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setPermiteMultiplos(true)}
                            className={`px-5 py-2 rounded-lg font-semibold transition-all ${permiteMultiplos
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                        >
                            SIM
                        </button>
                        <button
                            type="button"
                            onClick={() => setPermiteMultiplos(false)}
                            className={`px-5 py-2 rounded-lg font-semibold transition-all ${!permiteMultiplos
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                        >
                            NÃO
                        </button>
                    </div>
                </div>

                <div className="pt-4 mt-4 border-t text-sm text-slate-600 space-y-1">
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2.5 bg-[#03BB85] hover:bg-[#02996E] text-white rounded-md text-[15px] font-semibold flex items-center transition-colors"
                        >
                            <svg width="25" height="26" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.6667 28.875V17.875H9.33333V28.875M9.33333 4.125V11H20M25.3333 28.875H6.66667C5.95942 28.875 5.28115 28.5853 4.78105 28.0695C4.28095 27.5538 4 26.8543 4 26.125V6.875C4 6.14565 4.28095 5.44618 4.78105 4.93046C5.28115 4.41473 5.95942 4.125 6.66667 4.125H21.3333L28 11V26.125C28 26.8543 27.719 27.5538 27.219 28.0695C26.7189 28.5853 26.0406 28.875 25.3333 28.875Z"
                                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="ml-2">SALVAR CONFIGURAÇÕES</span>
                        </button>
                    </div>
                </div>
            </div>

        </Layout>
    );
}
