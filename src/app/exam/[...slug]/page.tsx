"use client";

import Layout from "@/components/layout";
import Button from "@/components/button";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { useExamContext } from "@/context/exam";
import { useRouter, useParams } from "next/navigation";
import { Input } from '@/components/input';
import { useUserContext } from "@/context/user";
import { useServiceContext } from "@/context/service";
import Loading from "@/components/loading";
import AlertBox from "@/components/alert-box";

export default function Page() {
  const { slug } = useParams();

  const router = useRouter();
  const { token } = useAuth();
  const { searchRegisterUser, getUserById } = useUserContext();
  const { searchRegister } = useServiceContext();
  const { createExam, getExamView, deleteExam, updateExam } = useExamContext();

  const [patient, setPatient] = useState<any[]>([]);
  const [seletedPatient, setSelectedPatient] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [timeDate, setTimeData] = useState(new Date().toISOString());
  const [popup, setPopup] = useState(false);
  const [searchText, setSearchText] = useState('');
  const params = useParams();
  const examId = params?.slug ? params.slug[0] : 0;
  const [isEditing, setIsEditing] = useState(examId === 'new');
  const isRegisteringPatient = examId === 'new';
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const newPatient = () => router.push('/patient/new');

  const handlesSearchServices = useCallback(async (search?: string) => {
    try {
      setSearchText(search ?? '');
      if (!search || !token) {
        setServices([]);
        return;
      }
      const response = await searchRegister(token, search);
      let availableServices = response?.data || [];

      availableServices = availableServices.filter((service: any) => service.status === true);

      const filteredServices = availableServices.filter((service: any) =>
        !selectedServices.some((selectedItem: any) => selectedItem.id === service.id)
      );

      setServices(filteredServices);
    } catch (error) {
      console.log(error);
    }
  }, [token, searchRegister, selectedServices]);


  const removeItem = (id: string | number) => {
    setSelectedServices((prev) => prev.filter(s => s.id !== id));
  };

  const handlesSearchUser = useCallback(async (search?: string) => {
    try {
      setSelectedPatient({ document: search });
      if (!search || !token) {
        setPatient([]);
        return;
      }
      const response = await searchRegisterUser(token, 'patient', search);
      const users = response?.data || [];
      const filteredPatients = users.filter((user: any) => user.roleId === 3);
      setPatient(filteredPatients);
    } catch (error) {
      console.log(error);
    }
  }, [token, searchRegisterUser]);

  const submitForm = useCallback(async (event: any) => {
    event.preventDefault();
    try {
      if (!token || !seletedPatient || !slug) return;

      setPopup(true);

      const existingExams = await getExamView(token, seletedPatient.id, slug[1] as string);
      const hasPendingExam = existingExams.data?.some((exam: any) => exam.statusExam === "PENDENTE");
      
      if (hasPendingExam) {
       setAlertMessage("Este paciente já possui um exame com status 'PENDENTE'. Para continuar, edite ou conclua o exame existente.");
       setAlertOpen(true);
       setPopup(false);
       return;
      }

      const isEditingExam = slug[0] !== 'new';

      if (isEditingExam) {
        const id = Number(slug[0]);
        const serviceData = await getExamView(token, id, slug[1] as string);
        const originalItems = serviceData.data.map((item: any) => ({
          ...item.service,
          itemId: item?.id,
          existItem: true,
        }));

        const removedItems = originalItems.filter((originalItem: any) =>
          !selectedServices.some((selectedItem: any) => selectedItem.itemId === originalItem.itemId)
        );

        for (const item of removedItems) {
          await deleteExam(token, item.itemId);
        }
      }

      for (const item of selectedServices) {
        if (item.existItem && isEditingExam) {

          await updateExam(Number(item.itemId), token, {
            dateTime: timeDate,
            statusExam: "PENDENTE",
            paymentStatus: "PENDENTE"
          });

        } else {

          await createExam(token, {
            ...seletedPatient,
            userId: seletedPatient.id,
            serviceId: item.id,
            dateTime: timeDate,
            statusExam: "PENDENTE",
            paymentStatus: "PENDENTE"
          });
        }
      }

      setPopup(false);
      router.push('/exams');

    } catch (error) {
      console.log(error);
      setPopup(false);
    }
  }, [token, seletedPatient, selectedServices, timeDate, createExam, deleteExam, getExamView, slug]);


  const selectPatient = (item: any) => {
    setSelectedPatient(item);
    setPatient([]);
  };

  const selectService = (item: any) => {
    // Verifica se o serviço já foi selecionado antes de adicionar
    if (!selectedServices.some((service: any) => service.id === item.id)) {
      setSelectedServices((prev) => [...prev, item]);
      setServices([]);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
    setSelectedPatient(null); // Evita novo envio com mesmo paciente
  };

  const handlesLoadingData = useCallback(async () => {
    if (!slug || slug === 'new' || !token) return;

    const id = Number(slug[0]);
    if (isNaN(id)) return;

    const serviceData = await getExamView(token, id, slug[1] as string);
    if (serviceData.status !== 200) return;

    const data = serviceData.data;
    const items = data.map((item: any) => ({
      ...item.service,
      itemId: item?.id,
      existItem: true,
    }));

    setSelectedServices(items);
    setTimeData(data[0]?.dateTime || '');

    const request = await getUserById(token, id);
    setSelectedPatient(request.data);
  }, [token, slug, getExamView, getUserById]);

  useEffect(() => {
    handlesLoadingData();
  }, [handlesLoadingData]);

  function formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return dateTimeString; // Verifica se a data é inválida
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const formatPrice = (value: any) => {
    // Garantir que o valor seja tratado como número
    const numericValue = Number(value);

    if (isNaN(numericValue)) {
      return `R$ 0,00`;
    }

    return `R$ ${numericValue.toFixed(2).replace('.', ',')}`;
  };

  return (
    <Layout>
      {popup && <Loading />}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold text-[#5D7285]">
          {examId === 'new'
            ? 'Cadastro de Exame'
            : isEditing
              ? 'Edição de Exame'
              : 'Visualização de Exame'}
        </h1>

        {examId !== 'new' && !isEditing && seletedPatient?.exams[0]?.paymentStatus !== 'PAGO' && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-3 bg-[#2196F3] text-white rounded hover:bg-[#1E88E5] font-semibold flex items-center"
          >
            <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"> <rect width="30" height="30" fill="url(#pattern0_384_923)" /> <defs> <pattern id="pattern0_384_923" patternContentUnits="objectBoundingBox" width="1" height="1"> <use xlinkHref="#image0_384_923" transform="scale(0.0078125)" /> </pattern> <image id="image0_384_923" width="128" height="128" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" /> </defs> </svg>
            <span className="ml-2">EDITAR</span>
          </button>
        )}
      </div>
      <div className="w-full h-[1px] my-8 bg-slate-400" />

      <form className="grid grid-cols-2 gap-4" onSubmit={submitForm}>
        <div className="flex gap-4 ">
          <div className="flex flex-col gap-4 relative">
            <Input
              required
              label="CPF:"
              placeholder="Busque o paciente"
              value={seletedPatient?.document ?? ""}
              className={`w-[260px] px-4 py-2 rounded-lg text-lg focus:outline-none ${examId !== 'new' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''
                }`}
              onChange={(event) => {
                if (examId === 'new') {
                  handlesSearchUser(event.target.value);
                }
              }}
              disabled={examId !== 'new'}
            />

            {patient.length > 0 && (
              <ul className="absolute z-10 top-20 bg-white border rounded shadow">
                {patient.map((item) => (
                  <li
                    key={item?.id}
                    className="py-2 px-4 border-b cursor-pointer hover:bg-gray-300"
                    onClick={() => selectPatient(item)}
                  >
                    ➕ {item.name}
                  </li>
                ))}
              </ul>
            )}

            <Input
              label="Nome:"
              value={seletedPatient?.name ?? ""}
              className="w-[260px] px-4 py-2 rounded-lg text-lg focus:outline-none bg-gray-300 text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>

          <Input
            required
            label="Data e Hora da consulta:"
            type={isEditing ? "datetime-local" : "text"}
            value={isEditing ? timeDate : formatDateTime(timeDate)}
            className={`w-[260px] px-4 py-2 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
            onChange={(event) => setTimeData(event.target.value)}
            disabled={!isEditing}
          />


        </div>

        {isRegisteringPatient && (
          <div className="bg-yellow-500 px-4 py-2 bg-opacity-75 rounded-xl">
            <div className="flex justify-center items-center gap-4">
              <div className="w-6 h-6">
                <svg fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              Caso o paciente não esteja cadastrado no sistema, faça o cadastro para continuar com o agendamento.
            </div>
            <Button type="button" label="Cadastrar Paciente" onClick={newPatient} />
          </div>
        )}


        <div className="col-span-2">
          <div className="w-full h-[1px] my-8 bg-slate-400" />


          <div className={`relative w-full border rounded-lg px-4 py-2 ${!isEditing ? 'bg-gray-300' : 'bg-white'}`}>
            <div className="flex flex-wrap items-center gap-2">
              {selectedServices?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  {/* Exibindo o nome e o valor formatado */}
                  <span>{item?.name} - {formatPrice(item?.price)}</span>

                  {isEditing && (
                    <button
                      type="button"
                      className="ml-2 hover:text-red-300 focus:outline-none"
                      onClick={() => removeItem(item?.id)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              {isEditing && (
                <input
                  type="text"
                  value={searchText ?? ""}
                  onChange={(e) => handlesSearchServices(e.target.value)}
                  className="flex-grow min-w-[120px] border-none focus:outline-none bg-white text-black px-4 py-2 rounded"
                  placeholder={selectedServices?.length === 0 ? "Atribuir serviços..." : ""}
                />
              )}
            </div>

            {/* Lista de sugestões */}
            {isEditing && services?.length > 0 && (
              <ul className="absolute z-10 top-full left-0 mt-1 w-full bg-white shadow-lg border rounded max-h-40 overflow-y-auto">
                {services.map((item: any) => (
                  <li
                    key={item?.id}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => selectService(item)}
                  >
                    ➕ {item?.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-4 justify-right px-4 py-2 bg-white border border-gray-400 w-[200px] font-semibold">
            <span className="text-blue-600">Valor Total:</span>{' '}
            R$ {selectedServices?.reduce((total: number, item: any) => total + Number(item.price), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="col-span-2 flex justify-end">
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

          <AlertBox
            isOpen={alertOpen}
            message={alertMessage}
            onClose={handleCloseAlert}
          />
        </div>
      </form>
    </Layout>
  );
}