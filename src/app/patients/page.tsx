"use client";

import { TablePatient } from "@/components/table/patients";
import Layout from "@/components/layout";
import { Input } from "@/components/input";
import Button from "@/components/button";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { usePatientContext } from "@/context/patient";
import { useRouter } from "next/navigation";

export default function ListPatients() {
  const { token } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState<any>([]);
  const [filteredPatients, setFilteredPatients] = useState<any>([]); // Estado para armazenar os pacientes filtrados
  const { listPatients, searchRegister, deletePatient } = usePatientContext();

  const handleDelete = useCallback(async (id: number) => {
    try {
      if (!token) return;
      await deletePatient(token, id);
      // Após a exclusão, refazer a listagem dos pacientes
      handleListPatients();
    } catch (error) {
      console.log(error);
    }
  }, [token, deletePatient]);

  const handleListPatients = useCallback(async () => {
    try {
      if (!token) return;
      const response = await listPatients(token, 'patient');
      const data = response?.data;

      if (data) {
        setPatients(data); // Armazena todos os pacientes
        setFilteredPatients(data); // Armazena também os pacientes não filtrados
      }
    } catch (error) {
      console.log(error);
    }
  }, [token, listPatients]);

  const handlesSearch = useCallback((search?: string) => {
    if (search) {
      const filtered = patients.filter((patient: any) => {
        const normalizedSearch = search.toLowerCase();

        const normalizedCpf = patient.cpf ? patient.cpf.replace(/[^\d]/g, '') : ''; // Remove não numéricos
        const normalizedPhoneNumber = patient.phoneNumber ? patient.phoneNumber.replace(/[^\d]/g, '') : ''; // Remove não numéricos

        return (
          (patient.name && patient.name.toLowerCase().includes(normalizedSearch)) ||
          (normalizedCpf && normalizedCpf.includes(normalizedSearch)) ||
          (normalizedPhoneNumber && normalizedPhoneNumber.includes(normalizedSearch)) ||
          (patient.email && patient.email.toLowerCase().includes(normalizedSearch)) ||
          (patient.status && patient.status.toLowerCase().includes(normalizedSearch))
        );
      });
      setFilteredPatients(filtered); // Filtra e atualiza os pacientes exibidos
    } else {
      setFilteredPatients(patients); // Se não houver busca, exibe todos os pacientes
    }
  }, [patients]);

  useEffect(() => {
    handleListPatients();
  }, [token]);

  const handlesNewPatient = () => {
    router.push('patient/new');
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 text-[#5D7285]">Lista de Pacientes</h1>

      <div className="w-full h-[1px] my-8 bg-slate-400" ></div>
      <section className="flex flex-row gap-4 justify-between mb-4">
        <Input
          isFlex={true}
          fullWidth
          searchIcon
          type="search"
          placeholder="Buscar..."
          onChange={(event) => handlesSearch(event.target.value)} // Chama a função de filtro na busca
        />
        <Button
          iconPlus
          label="Novo"
          onClick={() => handlesNewPatient()}
          style={{ backgroundColor: '#5D7285', color: 'white' }}
        />
      </section>

      <TablePatient
        onDelete={(id: number) => handleDelete(id)}
        data={filteredPatients} // Passa os pacientes filtrados para a tabela
      />
    </Layout>
  );
}
