"use client";
import { del, get } from "@/config/api";
import React, { useMemo, useContext, ReactNode, useCallback } from "react";

export interface PatientContextProps {
  listPatients: (token: string, type: string) => Promise<any>;
  deletePatient: (token: string, id: number) => Promise<any>;
  searchRegister: (token: string, type: string, search?: string) => Promise<any>;
}

interface Props {
  children: ReactNode;
}

const PatientContext = React.createContext<PatientContextProps>({} as PatientContextProps);

export const PatientProvider: React.FC<Props> = ({ children }) => {
  const listPatients = useCallback(async (token: string, type: string,): Promise<any> => {
    const response = await get(`users/${type}`, token);
    return response;
  }, []);

  const searchRegister = useCallback(async (token: string, type: string, search?: string,): Promise<any> => {
    const response = await get(`users/${type}?${search ? 'search=' + search : ''}`, token);
    return response;
  }, []);

  const deletePatient = useCallback(async (token: string, id: number): Promise<any> => {
    const response = await del(`users/${id}`, token);
    return response;
  }, []);  

  const value = useMemo(() => ({
    listPatients,
    searchRegister,
    deletePatient
  }), [listPatients, searchRegister, deletePatient]);

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
};

export const usePatientContext = (): PatientContextProps => useContext(PatientContext);
