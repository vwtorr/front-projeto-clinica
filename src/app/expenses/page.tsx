"use client";

import Layout from "@/components/layout";
import { Input } from "@/components/input";
import Button from "@/components/button";
import { useExpenseContext } from "@/context/expense";
import { useAuth } from "@/context/auth";
import { useCallback, useEffect, useState } from "react";
import { TableExpenses } from "@/components/table/portfolio";
import { useRouter } from "next/navigation";

export default function ListExpenses() {
  const { token } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [initialDate, setInitialDate] = useState<string>();
  const [finalDate, setFinalDate] = useState<string>();
  const { listExpenses, searchRegister, deleteExpense } = useExpenseContext();

  const handleListExpenses = useCallback(async () => {
    try {
      if (!token) return;
      const response = await listExpenses(token);
      const data = response?.data;
      if (data) {
        setExpenses(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [token, listExpenses]);

  const handlesSearch = useCallback(async (search?: string) => {
    try {
      if (!token) return;
      const response = await searchRegister(token, search, initialDate, finalDate);
      const data = response?.data;
      if (data) {
        setExpenses(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [token, searchRegister, initialDate, finalDate]);

  const handlesNewTitle = () => {
    router.push('expense/new');
  };

  const handleDelete = async (id: number) => {
    if (!token) return;

    try {
      await deleteExpense(token, id);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
      alert("Erro ao excluir despesa.");
    }
  };

  useEffect(() => {
    handleListExpenses();
  }, [token]);

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 text-[#5D7285]">Carteira de Títulos</h1>
      <div className="w-full h-[1px] my-8 bg-slate-400" ></div>

      <section className="flex flex-row gap-4 items-center justify-between mb-4">
        <Input isFlex label="Buscar:" searchIcon type="search" placeholder="Buscar..." onChange={(event) => handlesSearch(event.target.value)} />
        <Button
          iconPlus
          label="Novo Título"
          onClick={() => handlesNewTitle()}
          style={{ backgroundColor: '#5D7285', color: 'white' }}
        />

      </section>

      <section className="py-4 flex gap-4 items-end justify-between mb-4 w-full">
        <div className="flex gap-8">
          <Input type="date" label="Período Inicial:" onChange={(event) => setInitialDate(event.target.value)} />
          <Input type="date" label="Período Final:" onChange={(event) => setFinalDate(event.target.value)} />
        </div>
        <Button label="Pesquisar" onClick={() => handlesSearch()} />
      </section>

      <TableExpenses
        data={expenses ?? []}
        onDelete={handleDelete}
      />
    </Layout>
  );
}