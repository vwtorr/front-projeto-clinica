"use client";

import { TableExams } from "@/components/table/exams";
import Layout from "@/components/layout";
import { Input } from "@/components/input";
import Button from "@/components/button";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { useExamContext } from "@/context/exam";
import { useRouter } from "next/navigation";

export default function Exams() {
  const router = useRouter();
  const { token } = useAuth();
  const { listExam, searchRegister, deleteExam } = useExamContext();
  const [initialDate, setInitialDate] = useState<any>();
  const [finalDate, setFinalDate] = useState<any>();
  const [exams, setExams] = useState<any>([]);

  const handlesListExams = useCallback(async () => {
    try {
      if (!token) return;
      const response = await listExam(token);
      const data = response?.data;
      if (data) {
        const groupedData = data?.reduce((acc: any, item: any) => {
          const date = new Date(item.dateTime).toISOString().split('T')[0];
          const key = `${date}_${item.user.name}`;
          if (!acc[key]) {
            acc[key] = {
              id: item.user.id,
              date,
              userName: item.user.name,
              total: 0,
              paymentStatus: item.paymentStatus,
              records: [],
            };
          }
          acc[key].records.push(item);
          acc[key].total += (+item.service.price); // Substitua 'value' pelo nome real do campo numérico
          return acc;
        }, {});
        const result = Object.values(groupedData);
        setExams(result);
      }
    } catch (error) {
      console.log(error);
    }
  }, [token, listExam, setExams]);


  const handleDelete = useCallback(async (items: any[]) => {
    try {
      if (!token) return;
      console.clear();
      console.log(items);
      for(const item of items){
         await deleteExam(token, item?.id);
      }  
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }, [token, deleteExam]);

  const handlesSearch = useCallback(async (search?: string) => {
    try {
      if (!token) return;
      const response = await searchRegister(token, search, initialDate, finalDate);
      const data = response?.data;
      if (data) {
        setExams(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [token, searchRegister, setExams, initialDate, finalDate]);

  const handlesNewExam = () => {
    router.push('exam/new');
  }

  useEffect(() => {
    handlesListExams();
  }, [token]);

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 text-[#5D7285]">Exames</h1>
      <div className="w-full h-[1px] my-8 bg-slate-400" ></div>
      <section className="flex flex-row gap-4 items-center  justify-between mb-4">
        <Input isFlex label="Buscar:" searchIcon type="search" placeholder="Buscar..." onChange={(event) => handlesSearch(event.target.value)} />
        <Button
          iconPlus
          label="Novo Agendamento"
          onClick={() => handlesNewExam()}
          variant="primary"
        />
      </section>
      <section className=" py-4 flex gap-4 items-end justify-between mb-4 w-full">
        <div className="flex gap-8">
          <Input type="date" label="Período Inicial:" onChange={(event) => setInitialDate(event.target.value)} />
          <Input type="date" label="Período Final:" onChange={(event) => setFinalDate(event.target.value)} />
        </div>
        <Button label="Pesquisar" onClick={() => handlesSearch()} />
      </section>
      <TableExams
        data={exams ?? []}
        onDelete={(items: any) => handleDelete(items)}
      />
    </Layout>
  );
}
