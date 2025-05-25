"use client";
import { TableEmployee } from "@/components/table/employee";
import Layout from "@/components/layout";
import { useAuth } from "@/context/auth";
import { useCallback, useEffect, useState } from "react";
import { useUserContext } from "@/context/user";
import { Input } from "@/components/input";
import Button from "@/components/button";
import { useRouter } from "next/navigation";

export default function ListEmployee() {
  const { token } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]); // Estado para armazenar os funcionários filtrados
  const { listUser, searchRegisterUser, deleteUser } = useUserContext();

  const handleListEmployees = useCallback(async () => {
    try {
      if (!token) return;
      const response = await listUser(token, "employee");
      const data = response?.data;

      console.log("Data received:", data); 

      if (data) {
        
        const activeEmployees = data.filter((employee: any) => employee.isActive !== false && employee.id);
        setEmployees(activeEmployees); 
        setFilteredEmployees(activeEmployees); 
      }
    } catch (error) {
      console.error("Erro ao listar funcionários:", error);
    }
  }, [token, listUser]);

  const handlesSearch = useCallback(
    async (search?: string) => {
      if (!search) {
        setFilteredEmployees(employees); 
        return;
      }

      // Filtra os funcionários por nome, cpf, e outros campos
      const filtered = employees.filter((employee: any) =>
        (employee.name && employee.name.toLowerCase().includes(search.toLowerCase())) ||
        (employee.cpf && employee.cpf.includes(search)) ||
        (employee.phoneNumber && employee.phoneNumber.includes(search)) ||
        (employee.email && employee.email.toLowerCase().includes(search.toLowerCase())) ||
        (employee.status && employee.status.toLowerCase().includes(search.toLowerCase()))
      );

      console.log("Filtered employees:", filtered); // Verificando o resultado do filtro

      setFilteredEmployees(filtered); // Atualiza a lista filtrada
    },
    [employees]
  );

  const handlesNewEmployee = () => {
    router.push("employee/new");
  };

  const handleDelete = async (id: number) => {
    if (!token) return;

    try {
      await deleteUser(token, id);
      setEmployees((prev) => prev.filter((employee) => employee.id !== id));
      setFilteredEmployees((prev) => prev.filter((employee) => employee.id !== id)); // Atualiza a lista filtrada
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
      alert("Erro ao excluir funcionário.");
    }
  };

  useEffect(() => {
    handleListEmployees();
  }, [token]);

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 text-[#5D7285]">Lista de Funcionários</h1>
      <div className="w-full h-[1px] my-8 bg-slate-400"></div>
      <section className="flex flex-row gap-4 justify-between mb-4">
        <Input
          isFlex
          fullWidth
          searchIcon
          type="search"
          placeholder="Buscar..."
          onChange={(event) => handlesSearch(event.target.value)} // Chama a função de filtro na busca
        />
        <Button
          iconPlus
          label="Novo"
          onClick={() => handlesNewEmployee()}
          style={{ backgroundColor: '#5D7285', color: 'white' }}
        />
      </section>
      <TableEmployee data={filteredEmployees} onDelete={handleDelete} />
    </Layout>
  );
}
