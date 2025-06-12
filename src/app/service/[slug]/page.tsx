"use client";

import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/layout";
import { useCallback, useEffect, useState } from "react";
import { useServiceContext } from "@/context/service";
import { useAuth } from "@/context/auth";
import ButtonSelector from "@/components/button-selector";
import ConfirmationBox from "@/components/confirmation-box";
import SuccessBox from "@/components/success-box";
import AlertBox from "@/components/alert-box";

export default function Services() {
  const router = useRouter();
  const params = useParams();
  const { slug } = params;
  const { token } = useAuth();
  const { createServices, updateService, getServicesById, listServices } = useServiceContext();

  const [service, setService] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(slug === "new");
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
    router.push("/services");
  };

  const handleConfirmedSubmit = useCallback(async () => {
  try {
    if (!token || !service) return;

    const serviceCode = String(service.code).trim().toLowerCase();

    const allServicesResponse = await listServices(token);
    const allServices = allServicesResponse?.data ?? [];

    if (slug === "new") {
      const codeAlreadyExists = allServices.some((s: any) => {
        const existingCode = String(s.code).trim().toLowerCase();
        return existingCode === serviceCode;
      });

      if (codeAlreadyExists) {
        setAlertMessage("Já existe um serviço cadastrado com esse código!");
        setAlertOpen(true);
        setShowConfirm(false);
        return;
      }

      const response = await createServices(service, token);
      if (response?.status === 201) {
        setSuccessMessage("Serviço criado com sucesso!");
        setIsSuccessOpen(true);
      } else {
        console.error("Erro ao criar serviço:", response);
        setAlertMessage("Erro ao criar serviço. Tente novamente.");
        setAlertOpen(true);
      }
    } else {
      const id = Number(slug);
      if (!isNaN(id)) {
        // ✅ Verificação de código duplicado excluindo o próprio serviço
        const codeAlreadyExists = allServices.some((s: any) => {
          const existingCode = String(s.code).trim().toLowerCase();
          return existingCode === serviceCode && s.id !== id;
        });

        if (codeAlreadyExists) {
          setAlertMessage("Já existe um serviço cadastrado com esse código!");
          setAlertOpen(true);
          setShowConfirm(false);
          return;
        }

        const response = await updateService(id, service, token);
        if (response?.status === 200 || response?.status === 204) {
          setSuccessMessage("Serviço atualizado com sucesso!");
          setIsSuccessOpen(true);
        } else {
          console.error("Erro ao atualizar serviço:", response);
          setAlertMessage("Erro ao atualizar serviço. Tente novamente.");
          setAlertOpen(true);
        }
      } else {
        setAlertMessage("ID de serviço inválido.");
        setAlertOpen(true);
      }
    }

    setShowConfirm(false);
  } catch (error) {
    console.error(error);
    setAlertMessage("Erro inesperado. Tente novamente.");
    setAlertOpen(true);
    setShowConfirm(false);
  }
}, [service, token, slug, createServices, updateService, listServices]);


  const submitForm = useCallback((event: any) => {
    event.preventDefault();
    setShowConfirm(true);
  }, []);

  const handlesLoadingData = useCallback(async () => {
  const id = Number(slug);

  if (token && slug && !isNaN(id) && slug !== "new") {
    const serviceData = await getServicesById(token, id); 

    if (!serviceData?.data && serviceData.status !== 200) return;
    setService(serviceData.data);
  }
}, [token, getServicesById, slug]);

  useEffect(() => {
    handlesLoadingData();
  }, [handlesLoadingData]);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-[#5D7285]">
          {slug === 'new'
            ? 'Cadastro de Serviço'
            : isEditing
              ? 'Edição de Serviço'
              : 'Visualização de Serviço'}
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

      <div className="w-full h-[1px] my-8 bg-slate-400"></div>

      <form className="flex" onSubmit={submitForm}>
        <div className="w-1/2 px-2">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              {service?.status !== undefined && service?.status !== null && (
                <>
                  <ButtonSelector
                    change={(checked) => {
                      if (!isEditing) return;
                      setService((oldValue: any) => ({
                        ...oldValue,
                        status: checked,
                      }));
                    }}
                    id="toggle-usuario-ativo"
                    initialChecked={service?.status}
                    disabled={!isEditing}
                  />
                  <span className="text-black mr-10">Serviço ativo?</span>
                </>
              )}
            </div>

            <div className="w-1/2 mb-8">
              <label htmlFor="codigo-servico" className="block mb-1 text-xl font-medium required">
                <span className="text-red-500">*</span>
                <span className="text-black"> Código:</span>
              </label>
              <input
                type="text"
                className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                id="codigo-servico"
                required
                aria-label="codigo-servico"
                value={service?.code ?? ''}
                disabled={!isEditing}
                onChange={(event) =>
                  setService((oldValue: any) => ({
                    ...oldValue,
                    code: event.target.value.slice(0, 8)
                  }))
                }
              />
            </div>

            <div className="w-1/2 h-[1px] my-8 bg-slate-400"></div>

            <div className="w-1/2 mb-8">
              <label htmlFor="nome" className="block mb-1 text-xl font-medium required">
                <span className="text-red-500">*</span>
                <span className="text-black"> Nome:</span>
              </label>
              <input
                type="text"
                value={service?.name ?? ''}
                className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                id="nome"
                required
                disabled={!isEditing}
                aria-label="NOME"
                onChange={(event) =>
                  setService((oldValue: any) => ({
                    ...oldValue,
                    name: event.target.value
                  }))
                }
              />
            </div>

            <div className="w-1/2 h-[1px] my-8 bg-slate-400"></div>

            <div className="w-1/2 mb-8">
              <label htmlFor="valor" className="block mb-1 text-xl font-medium required">
                <span className="text-red-500">*</span>
                <span className="text-black"> Valor:</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={service?.price !== undefined
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)
                  : ''}
                className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                id="valor"
                disabled={!isEditing}
                aria-label="valor"
                onChange={(event) => {
                  const rawValue = event.target.value.replace(/\D/g, '');
                  const numericValue = Number(rawValue) / 100;

                  setService((oldValue: any) => ({
                    ...oldValue,
                    price: numericValue  // ✅ armazenando como número
                  }));
                }}
              />
            </div>
          </div>
        </div>

        <div className="w-1/2 pl-10">
          <div className="w-full mt-[70px]">
            <label htmlFor="descricao" className="block mb-1 text-xl font-medium required">
              <span className="text-black"> Descrição:</span>
            </label>
            <textarea
              className={`w-[600px] h-[300px] px-6 py-4 rounded-lg text-lg focus:outline-none resize-none 
              ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
              id="descricao"
              rows={9}
              aria-label="descricao"
              value={service?.description ?? ''}
              disabled={!isEditing}
              onChange={(event) =>
                setService((oldValue: any) => ({
                  ...oldValue,
                  description: event.target.value
                }))
              }
            />
          </div>

          <div className="w-3/4 flex justify-center mt-[60px] ml-[70px] mb-3">
            <button
              type="button"
              onClick={() => router.push('/services')} // navega pra lista
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

            {/* ConfirmationBox aparece só se showConfirm for true */}
            {showConfirm && (
              <ConfirmationBox
                isOpen={showConfirm}
                message="Deseja realmente confirmar a operação ?"
                onConfirm={handleConfirmedSubmit}
                onCancel={() => setShowConfirm(false)}
              />
            )}

            <SuccessBox
              isOpen={isSuccessOpen}
              message={successMessage}
              onClose={handleCloseSuccess}
            />

            <AlertBox
              isOpen={alertOpen} 
              message={alertMessage}
              onClose={() => setAlertOpen(false)} 
            />

          </div>
        </div>
      </form>
    </Layout>
  );
}