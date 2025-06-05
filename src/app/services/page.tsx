"use client";

import Layout from "@/components/layout";
import { Input } from "@/components/input";
import Button from "@/components/button";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { useServiceContext } from "@/context/service";
import { TableServices } from "@/components/table/services";
import { useRouter } from "next/navigation";

export default function ListServices() {
  const { token } = useAuth();
  const router = useRouter();
  const { listServices, searchRegister, deleteService } = useServiceContext()
  const [services, setServices] = useState<any>([]);

  const handleDelete = useCallback(async (id: number) => {
    try {
      if (!token) return;
      await deleteService(token, id);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }, [token, deleteService])

  const handleListServices = useCallback(async () => {
    try {
      if (!token) return;
      const response = await listServices(token);
      const data = response?.data;

      if (data) {
        setServices(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [token, listServices]);

  const handlesSearch = useCallback(async (search?: string) => {
    try {
      if (!token) return;
      const response = await searchRegister(token, search);
      const data = response?.data;

      if (data) {
        setServices(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [token, searchRegister, setServices]);

  const handlesNewService = () => {
    router.push('service/new')
  }

  useEffect(() => {
    handleListServices()
  }, [token])
  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 text-[#5D7285]">Serviços</h1>
      <div className="w-full h-[1px] my-8 bg-slate-400" ></div>
      <section className="flex flex-row gap-4  justify-between mb-4">
        <Input isFlex fullWidth searchIcon type="search" placeholder="Buscar..." onChange={(event) => handlesSearch(event.target.value)} />
        { }
        <Button
          iconPlus
          label="Novo"
          onClick={() => handlesNewService()}
          style={{ backgroundColor: '#5D7285', color: 'white' }}
        />

      </section>
      <TableServices
        data={services}
      />
    </Layout>
  );
}
