"use client";

import { useParams, useRouter } from "next/navigation";
import SaveIcon from "@/assets/Save.svg";
import Layout from "@/components/layout";
import { useAuth } from "@/context/auth";
import { useExpenseContext } from "@/context/expense";
import { useCallback, useEffect, useState } from "react";

export default function Expense() {
  const router = useRouter();
  const { slug } = useParams();
  const params = useParams();
  const expenseId = params?.slug;
  const { token } = useAuth();
  const [expense, setExpense] = useState<any>();
  const [isEditing, setIsEditing] = useState(slug === "new");


  const { createExpenses, getExpenseById } = useExpenseContext();

  const submitForm = useCallback(async (event: any) => {
    event.preventDefault();
    try {
      if (!token || !expense) return;

      const expenseToCreate = {
        ...expense,
        status: "PENDENTE",
        paymentStatus: "PENDENTE" 
      };


      const newEmployee = await createExpenses(token, expenseToCreate);
      const status = newEmployee.status;

      if (status != 201 || !newEmployee?.data) return;

      router.push("/expenses");
    } catch (error) {
      console.log(error);
    }
  }, [token, router, expense, createExpenses]);


  const handleLoadingData = useCallback(async () => {
    if (!token) return;
    if (expenseId && expenseId != 'new') {
      const expenseData = await getExpenseById(token, + expenseId);
      if (!expenseData?.data && expenseData.status != 200) return;
      setExpense(expenseData?.data);
    }
  }, [setExpense, token, expenseId]);
  useEffect(() => {
    handleLoadingData();
  }, [token, handleLoadingData])
  if (expenseId && expenseId != 'new' && !expense?.type) {
    return (<div className="flex items-center justify-center gap-2 h-40">
      <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500 border-solid"></div>
      <span className="text-gray-700 font-medium">Carregando...</span>
    </div>
    )
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold mb-10 text-[#5D7285]">
          {slug === "new"
            ? "Cadastro de Despesa"
            : isEditing
              ? "Edição de Despesa"
              : "Visualização de Despesa"}
        </h1>

        {slug !== 'new' && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-3 bg-[#2196F3] text-white rounded hover:bg-[#1E88E5] font-semibold flex items-center"
          >
            <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"> <rect width="30" height="30" fill="url(#pattern0_384_923)" /> <defs> <pattern id="pattern0_384_923" patternContentUnits="objectBoundingBox" width="1" height="1"> <use xlinkHref="#image0_384_923" transform="scale(0.0078125)" /> </pattern> <image id="image0_384_923" width="128" height="128" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" /> </defs> </svg>
            <span className="ml-2">EDITAR</span>
          </button>
        )}
      </div>

      <div className="w-full h-[1px] my-8 bg-slate-400" ></div>
      <form className="flex" onSubmit={submitForm}>
        <div className="w-1/2 px-2  ">
          <div className=" grid grid-cols-2 gap-4">
            <div >
              <label
                htmlFor="numdocumento"
                className="blocktext-xl font-medium required"
              >
                <span className="text-red-500">*</span>
                <span className="text-black"> Número do Documento:</span>
              </label>
              <input
                type="text"
                className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                id="numdocumento"
                aria-label="numdocumento"
                required
                placeholder="DOC-20250302-002"
                onChange={(event) =>
                  setExpense((oldValue: any) => ({
                    ...oldValue,
                    document: event.target.value
                  }))
                }
                value={expense?.document ?? ""}
                disabled={!isEditing}
              />
              <div className="w-full h-[1px] my-8 bg-slate-400" ></div>
            </div>


            <div >
              <label
                htmlFor="valor"
                className="blocktext-xl font-medium required"
              >
                <span className="text-red-500">*</span>
                <span className="text-black"> Valor:</span>
              </label>
              <input
                type="text"
                className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                id="valor"
                placeholder="150"
                required
                onChange={(event) =>
                  setExpense((oldValue: any) => ({
                    ...oldValue,
                    value: event.target.value
                  }))
                }
                value={expense?.value ?? ""}
                disabled={!isEditing}
                aria-label="valor"
              />
              <div className="w-full h-[1px] my-8 bg-slate-400" ></div>
            </div>

            <div >
              <label
                htmlFor="datalancamento"
                className="blocktext-xl font-medium required"
              >
                <span className="text-red-500">*</span>
                <span className="text-black"> Data de Lançamento:</span>
              </label>
              <input
                type="date"
                className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                id="datalancamento"
                required
                onChange={(event) =>
                  setExpense((oldValue: any) => ({
                    ...oldValue,
                    releaseDate: event.target.value
                  }))
                }
                value={expense?.releaseDate ?? ""}
                disabled={!isEditing}
                aria-label="datalancamento"
              />
              <div className="w-full h-[1px] my-8 bg-slate-400" ></div>
            </div>

            <div className="mt-1.5">
              <label htmlFor="tipo" className="blocktext-xl font-medium required">
                <span className="text-red-500">*</span>
                <span className="text-black"> Título:</span>
              </label>
              <select
                id="tipo"
                className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none
                ${isEditing ? 'bg-white text-black' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                required
                onChange={(event) =>
                  setExpense((oldValue: any) => ({
                    ...oldValue,
                    type: event.target.value
                  }))
                }
                value={expense?.type ?? ""}
                disabled={!isEditing}
                aria-label="titulo"
              >
                <option value="" disabled>
                  Selecione o tipo de título
                </option>
                <option value="Conta a Pagar">Conta a Pagar</option>
                <option value="Conta a Receber">Conta a Receber</option>
              </select>
              <div className="w-full h-[1px] my-8 bg-slate-400"></div>
            </div>
          </div>
        </div>

        <div className="w-1/2 pl-10">
          <div className="w-full max-w-2xl">
            <label
              htmlFor="descricao"
              className="block text-base font-medium required"
            >
              <span className="text-red-500">*</span>
              <span className="text-black"> Descrição:</span>
            </label>
            <textarea
              onChange={(event) =>
                setExpense((oldValue: any) => ({
                  ...oldValue,
                  description: event.target.value
                }))
              }
              required
              value={expense?.description ?? ""}
              disabled={!isEditing}
              className={`w-[650px] h-[300px] px-6 py-4 rounded-lg text-lg focus:outline-none resize-none 
                ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
              id="descricao"
              aria-label="descricao"
            />
          </div>

          <div className="w-3/4 flex justify-center mt-[60px] ml-[70px] mb-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2.5 mr-4 rounded-md bg-[#5D7285] hover:bg-[#4c5e6e] text-white text-[15px] font-semibold transition-colors flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <g clipPath="url(#clip0)">
                  <path d="M11.25 13.75L6.25 18.75M6.25 18.75L11.25 23.75M6.25 18.75H20C21.3261 18.75 22.5979 18.2232 23.5355 17.2855C24.4732 16.3479 25 15.0761 25 13.75C25 12.4239 24.4732 11.1521 23.5355 10.2145C22.5979 9.27678 21.3261 8.75 20 8.75H18.75"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="30" height="30" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              VOLTAR
            </button>

            {isEditing && (
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#03BB85] hover:bg-[#02996E] text-white rounded-md text-[15px] font-semibold flex items-center transition-colors"
              >
                <svg width="25" height="26" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.6667 28.875V17.875H9.33333V28.875M9.33333 4.125V11H20M25.3333 28.875H6.66667C5.95942 28.875 5.28115 28.5853 4.78105 28.0695C4.28095 27.5538 4 26.8543 4 26.125V6.875C4 6.14565 4.28095 5.44618 4.78105 4.93046C5.28115 4.41473 5.95942 4.125 6.66667 4.125H21.3333L28 11V26.125C28 26.8543 27.719 27.5538 27.219 28.0695C26.7189 28.5853 26.0406 28.875 25.3333 28.875Z"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="ml-2">SALVAR</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </Layout>
  );
}