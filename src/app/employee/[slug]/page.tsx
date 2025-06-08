"use client";

import ButtonSelector from "@/components/button-selector";
import Layout from "@/components/layout";
import { useCallback, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/auth";
import { useUserContext } from "@/context/user";
import ConfirmationBox from "@/components/confirmation-box";
import SuccessBox from "@/components/success-box";
import AlertBox from "@/components/alert-box";


export default function EmployeerRegistration() {
  const router = useRouter();
  const { token } = useAuth();
  const {
    createUser,
    createAddress,
    createEmployeeData,
    getUserById,
    updatePatient,
    updateAddress,
    updatePositions,
    createPositions,
    searchRegisterUser
  } = useUserContext();

  const [employee, setEmployee] = useState<any>(null);
  const [positions, setPositions] = useState<any>(null);
  const params = useParams();
  const employeeId = params?.slug;
  const [isEditing, setIsEditing] = useState(employeeId === 'new');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [cep, setCep] = useState('');
  const [address, setAddress] = useState<any>({
    zipCode: "",
    street: "",
    neighborhood: "",
    city: "",
    state: ""
  });

  const fetchAddressByCep = async (cep: any) => {
    if (cep.length < 8) return
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setAddress((prev: any) => ({
          ...prev,
          street: data.logradouro !== "" ? data.logradouro : "",
          neighborhood: data.bairro !== "" ? data.bairro : "",
          city: data.localidade !== "" ? data.localidade : "",
          state: data.uf !== "" ? data.uf : "",
        }));
      } else {
        setAlertMessage("CEP não encontrado!");
        setAlertOpen(true);
        return
      }

    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  };

  const submitForm = useCallback((event: any) => {
    event.preventDefault();
    setShowConfirm(true);
  }, []);


  const handleConfirmedSubmit = useCallback(async () => {
    try {
      if (!token || !employee) return;

      if (employee?.document.length !== 11) {
        setAlertMessage("O CPF deve conter exatamente 11 dígitos.");
        setAlertOpen(true);
        return;
      }

      if (employeeId === "new") {
        const existingUsers = await searchRegisterUser(token, "users", employee.document);

        const cpfJaExiste = existingUsers?.data?.some(
          (user: any) => user.role_id === employee.role_id
        );

        if (cpfJaExiste) {
          setAlertMessage("Já existe um funcionário cadastrado com esse CPF.");
          setAlertOpen(true);
          setShowConfirm(false);
          return;
        }

        const newEmployee = await createUser(token, employee);

        if (newEmployee.status !== 201) {
          setSuccessMessage("Erro ao criar funcionário.");
          setIsSuccessOpen(true);
          setShowConfirm(false);
          return;
        }

        const newAddress = {
          userId: newEmployee?.data?.id,
          zipCode: address.zipCode,
          street: address.street,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
        };
        await createAddress(token, newAddress);

        const newEmployeeData = {
          userId: newEmployee?.data?.id,
          ...positions,
        };
        await createEmployeeData(token, newEmployeeData);

        setSuccessMessage("Funcionário cadastrado com sucesso!");
        setIsSuccessOpen(true);
        setShowConfirm(false);

      } else {
        const id = Number(employeeId);

        const existingUsers = await searchRegisterUser(token, "users", employee.document);

        const cpfJaExiste = existingUsers?.data?.find(
          (user: any) => user.id !== employee.id && user.role_id === employee.role_id
        );

        if (cpfJaExiste) {
          console.log("Usuário encontrado:", cpfJaExiste);

          let roleMessage = "";

          if (cpfJaExiste.roleId === 1) {
            roleMessage = "Já existe um administrador cadastrado com esse CPF.";
          } else if (cpfJaExiste.roleId === 2) {
            roleMessage = "Já existe um funcionário cadastrado com esse CPF.";
          } else if (cpfJaExiste.roleId === 3) {
            roleMessage = "Já existe um paciente cadastrado com esse CPF.";
          } else {
            roleMessage = "Já existe um usuário cadastrado com esse CPF.";
          }

          setAlertMessage(roleMessage);
          setAlertOpen(true);
          setShowConfirm(false);
          return;
        }

        const updatedService = await updatePatient(id, employee, token);

        if (address.id) {
          await updateAddress(address.id, { ...address }, token);
        } else {
          const newAddress = {
            userId: employee?.id,
            zipCode: address.zipCode,
            street: address.street,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
          };
          await createAddress(token, newAddress);
        }

        if (positions.id) {
          await updatePositions(positions.id, positions, token);
        } else {
          const data = {
            userId: employeeId,
            ...positions,
          };
          await createPositions(data, token);
        }

        if (updatedService.status === 200 || updatedService.status === 204) {
          setSuccessMessage("Funcionário atualizado com sucesso!");
        } else {
          setSuccessMessage("Erro ao atualizar funcionário.");
        }

        setIsSuccessOpen(true);
        setShowConfirm(false);
      }
    } catch (error) {
      console.log(error);
      setSuccessMessage("Erro ao salvar dados.");
      setIsSuccessOpen(true);
      setShowConfirm(false);
    }
  }, [
    employee,
    token,
    employeeId,
    createUser,
    createAddress,
    createEmployeeData,
    updatePatient,
    address,
    updateAddress,
    positions,
    updatePositions,
    createPositions,
    searchRegisterUser,
  ]);



  const handleLoadingData = useCallback(async () => {
    if (!token || !employeeId) return;
    try {
      const result = await getUserById(token, +employeeId);
      if (!result?.data) return;
      const employeeData = result?.data;
      setEmployee(employeeData);
      setAddress(employeeData?.address || { zipCode: "", street: "", neighborhood: "", city: "", state: "" });
      setCep(employeeData?.address?.zipCode || "");
      setPositions(employeeData?.salary);
    } catch (error) {
      console.error("Erro ao buscar dados do funcionário:", error);
    }
  }, [token, employeeId, getUserById]);

  useEffect(() => {
    handleLoadingData();
  }, [handleLoadingData]);

  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
    router.push("/employees");
  };

  function formatPhoneNumber(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  return (
    <Layout>
      <section className="px-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold text-[#5D7285]">
            {employeeId === 'new'
              ? 'Cadastro de Funcionário'
              : isEditing
                ? 'Edição de Funcionário'
                : 'Visualização de Funcionário'}
          </h1>

          {employeeId !== 'new' && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-3 bg-[#2196F3] text-white rounded hover:bg-[#1E88E5] font-semibold flex items-center"
            >
              <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"> <rect width="30" height="30" fill="url(#pattern0_384_923)" /> <defs> <pattern id="pattern0_384_923" patternContentUnits="objectBoundingBox" width="1" height="1"> <use xlinkHref="#image0_384_923" transform="scale(0.0078125)" /> </pattern> <image id="image0_384_923" width="128" height="128" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" /> </defs> </svg>
              <span className="ml-2">EDITAR</span>
            </button>
          )}
        </div>

        <form className="flex text-black" onSubmit={submitForm}>
          <div className="w-1/2">

            <div className="flex items-center">
              <div className="flex items-center gap-2">
                {employee?.status !== undefined && employee?.status !== null && (
                  <>
                    <ButtonSelector
                      change={(checked) => {
                        if (!isEditing) return;
                        setEmployee((oldValue: any) => ({
                          ...oldValue,
                          status: checked,
                        }));
                      }}
                      id="toggle-usuario-ativo"
                      initialChecked={employee?.status}
                      disabled={!isEditing}
                    />
                    <span className="text-black mr-10">Usuário ativo?</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <ButtonSelector
                  change={(checked) => {
                    if (!isEditing) return;
                    setEmployee((oldValue: any) => ({
                      ...oldValue,
                      resetPassword: checked,
                    }));
                  }}
                  id="toggle-resetar-senha"
                  initialChecked={false}
                  disabled={!isEditing}
                />
                <span className="text-black">Resetar senha?</span>
              </div>
            </div>


            <div className="flex gap-12 mb-5">
              <div className="w-1/2 mt-8">
                <label
                  htmlFor="cpf"
                  className="block mb-1 text-xl font-medium required"
                >
                  <span className="text-red-500">*</span>
                  <span className="text-black"> CPF:</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                  id="cpf"
                  aria-label="CPF"
                  value={employee?.document ?? ""}
                  disabled={!isEditing}
                  required
                  maxLength={11}
                  onChange={(event) => {
                    const onlyNumbers = event.target.value.replace(/\D/g, '').slice(0, 11);
                    setEmployee((oldValue: any) => ({
                      ...oldValue,
                      document: onlyNumbers
                    }));
                  }}
                />
              </div>
              <div className="w-1/2 mt-8">
                <label
                  htmlFor="nome"
                  className="block mb-1 text-xl font-medium required"
                >
                  <span className="text-red-500">*</span>
                  <span className="text-black"> Nome:</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                  id="nome"
                  required
                  aria-label="NOME"
                  value={employee?.name ?? ""}
                  disabled={!isEditing}
                  onChange={(event) =>
                    setEmployee((oldValue: any) => ({
                      ...oldValue,
                      name: event.target.value
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex gap-12 mb-5">
              <div className="w-1/2">
                <label
                  htmlFor="dataNascimento"
                  className="block mb-1 text-xl font-medium required"
                >
                  <span className="text-black">Data de Nascimento:</span>
                </label>
                <input
                  type="date"
                  className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                  id="dataNascimento"
                  value={employee?.birthDate ?? ""}
                  disabled={!isEditing}
                  onChange={(event) =>
                    setEmployee((oldValue: any) => ({
                      ...oldValue,
                      birthDate: event.target.value
                    }))
                  }
                  aria-label="DATA DE NASCIMENTO"
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="telefone"
                  className="block mb-1 text-xl font-medium required"
                >
                  <span className="text-red-500">*</span>
                  <span className="text-black"> Telefone:</span>
                </label>
                <input
                  type="text"
                  value={employee?.phoneNumber ?? ""}
                  disabled={!isEditing}
                  onChange={(event) => {
                    const formatted = formatPhoneNumber(event.target.value);
                    setEmployee((oldValue: any) => ({
                      ...oldValue,
                      phoneNumber: formatted,
                    }));
                  }}
                  className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""
                    }`}
                  id="telefone"
                  required
                  aria-label="TELEFONE"
                />
              </div>
            </div>

            <div className="flex gap-12 mb-5">
              <div className="w-1/2">
                <label
                  htmlFor="dataAdmissao"
                  className="block mb-1 text-xl font-medium required"
                >
                  <span className="text-black">Data de Admissão:</span>
                </label>
                <input
                  type="date"
                  className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                  id="dataAdmissao"
                  aria-label="DATA DE ADMISSÃO"
                  value={positions?.hiringDate ?? ""}
                  disabled={!isEditing}
                  onChange={(event) =>
                    setPositions((oldValue: any) => ({
                      ...oldValue,
                      hiringDate: event.target.value
                    }))
                  }
                />
              </div>

              <div className="w-1/2">
                <label
                  htmlFor="salario"
                  className="block mb-1 text-xl font-medium required"
                >
                  <span className="text-red-500">*</span>
                  <span className="text-black"> Salário:</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                  id="salario"
                  value={
                    positions?.remuneration !== undefined && positions?.remuneration !== null
                      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(positions.remuneration)
                      : ''
                  }
                  disabled={!isEditing}
                  required
                  aria-label="SALÁRIO"
                  onChange={(event) => {
                    const rawValue = event.target.value.replace(/\D/g, '');
                    const numericValue = Number(rawValue) / 100;

                    setPositions((oldValue: any) => ({
                      ...oldValue,
                      remuneration: numericValue,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="flex gap-12 mb-5">

              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block mb-1 text-xl font-medium required"
                >
                  <span className="text-black">Email:</span>
                </label>
                <input
                  type="email"
                  required
                  className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                  id="email"
                  value={employee?.email ?? ""}
                  disabled={!isEditing}
                  aria-label="EMAIL"
                  onChange={(event) =>
                    setEmployee((oldValue: any) => ({
                      ...oldValue,
                      email: event.target.value
                    }))
                  }
                />
              </div>
            </div>

          </div>
          <div className="w-[2px] h-[70vh] bg-black ml-10"></div>
          <div className="w-1/2">

            <div className="ml-10">
              <p className="text-4xl font-bold mb-6 text-[#5D7285]">Endereço:</p>


              <div className="w-3/5 mb-3 mr-10">
                <label htmlFor="CEP" className="block mb-1 text-xl font-medium required">
                  <span className="text-red-500">*</span>
                  <span className="text-black"> CEP:</span>
                </label>
                <input
                  value={address.zipCode}
                  disabled={!isEditing}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const numericValue = rawValue.replace(/\D/g, '').slice(0, 8);
                    fetchAddressByCep(numericValue);
                    setAddress((prev: any) => ({
                      ...prev,
                      zipCode: numericValue,
                    }));
                  }}
                  type="text"
                  className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                  id="CEP"
                  required
                  aria-label="CEP"
                />
              </div>

              <div className="w-3/5 mb-3">
                <label htmlFor="RUA" className="block mb-1 text-xl font-medium required">
                  <span className="text-red-500">*</span>
                  <span className="text-black"> RUA:</span>
                </label>
                <input
                  value={address.street}
                  disabled={!isEditing}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  type="text"
                  className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                  id="RUA"
                  aria-label="RUA"
                />
              </div>

              <div className="w-3/5 mb-3">
                <label htmlFor="BAIRRO" className="block mb-1 text-xl font-medium required">
                  <span className="text-red-500">*</span>
                  <span className="text-black"> BAIRRO:</span>
                </label>
                <input
                  value={address.neighborhood}
                  disabled={!isEditing}
                  onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                  type="text"
                  className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                  id="BAIRRO"
                  aria-label="BAIRRO"
                />
              </div>

              <div className="w-3/5 mb-3">
                <label htmlFor="CIDADE" className="block mb-1 text-xl font-medium required">
                  <span className="text-red-500">*</span>
                  <span className="text-black"> CIDADE:</span>
                </label>
                <input
                  value={address.city}
                  disabled={!isEditing}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  type="text"
                  className={`w-full px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                  id="CIDADE"
                  aria-label="CIDADE"
                />
              </div>

              <div className="w-1/6 mb-3">
                <label htmlFor="UF" className="block mb-1 text-xl font-medium required">
                  <span className="text-red-500">*</span>
                  <span className="text-black"> UF:</span>
                </label>
                <input
                  value={address.state}
                  disabled={!isEditing}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  type="text"
                  className={`w-[80px] px-6 py-4 rounded-lg text-lg focus:outline-none ${!isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                  id="UF"
                  aria-label="UF"
                />
              </div>
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
                isOpen={alertOpen} // em vez de isAlertOpen
                message={alertMessage}
                onClose={() => setAlertOpen(false)} // em vez de setIsAlertOpen
              />
            </div>
          </div>
        </form>

      </section>
    </Layout>
  );
}