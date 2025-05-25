"use client";

import { del, get, post, put } from "@/config/api";
import React, { useMemo, useContext, ReactNode, useCallback } from "react";

export interface ServiceContextProps {
  listServices: (token: string) => Promise<any>;
  searchRegister: (token: string, search?: string) => Promise<any>;
  deleteService: (token: string, id: number) => Promise<any>;
  createServices: (token: string, service: any) => Promise<any>;
  updateService: (id:number, token: string, data: any) => Promise<any>;
  getServicesById: (token: string, id: number) => Promise<any>;
}

interface Props {
  children: ReactNode;
}

const ServiceContext = React.createContext<ServiceContextProps>({} as ServiceContextProps);

export const ServiceProvider: React.FC<Props> = ({ children }) => {
  const listServices = useCallback(async (token: string): Promise<any> => {
    const response = await get('services', token);
    return response;
  }, []);

  const getServicesById = useCallback(async (token: string, id: number): Promise<any> => {
    const response = await get(`services/${id}`, token);
    return response;
  }, []);
  

  const createServices = useCallback(async (service: any, token: string): Promise<any> => {
    const response = await post('services', service, token);
    console.log('Resposta de criação do serviço:', response); // Verifique a resposta
    return response;
  }, []);
  

  const updateService = useCallback(async (id:number, data: any, token: string): Promise<any> => {
    const response = await put(`services/${id}`, data, token);
    return response;
  }, []);


  const searchRegister = useCallback(async (token: string, search?: string): Promise<any> => {
    const response = await get(`services?${search ? 'search=' + search : ''}`, token);
    return response;
  }, []);

  const deleteService = useCallback(async (token: string, id: number): Promise<any> => {
    const response = await del(`services/${id}`, token);
    return response;
  }, []);

  const value = useMemo(() => ({
    listServices,
    searchRegister,
    deleteService,
    createServices,
    updateService,
    getServicesById
  }), [listServices, deleteService, searchRegister, createServices, updateService, getServicesById]);

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
};

export const useServiceContext = (): ServiceContextProps => useContext(ServiceContext);
