"use client";
import { del, get, post, put } from "@/config/api";
import React, { useMemo, useContext, ReactNode, useCallback } from "react";

export interface UserContextProps {
  listUser: (token: string, type: string) => Promise<any>;
  searchRegisterUser: (token: string, type: string, search?: string) => Promise<any>;
  createUser: (token: string, data: any) => Promise<any>;
  createAddress: (token: string, data: any) => Promise<any>;
  createEmployeeData: (token: string, data: any) => Promise<any>;
  updatePatient: (id: number, data: any, token: string) => Promise<any>;
  getPatientById: (token: string, id: number) => Promise<any>;
  createPatientNotes: (token: string, data: any) => Promise<any>;
  getEmployeeById: (token: string, id: number) => Promise<any>;
  getAddressByUserId: (token: string, userId: number) => Promise<any>; 
  getEmployeeDataByUserId: (token: string, userId: number) => Promise<any>; 
  getUserById: (token: string, id: number) => Promise<any>;
  deleteUser: (token: string, id: number) => Promise<any>;
  updateAddress: (id: number, data: any, token: string) => Promise<any>;
  updatePositions: (id: number, data: any, token: string) => Promise<any>;
  createPositions: (data: any, token: string) => Promise<any>;
  updateNotes: (id: number, data: any, token: string) => Promise<any>;
  createNotes: (data: any, token: string) => Promise<any>;
}

interface Props {
  children: ReactNode;
}

const UserContext = React.createContext<UserContextProps>({} as UserContextProps);

export const UserProvider: React.FC<Props> = ({ children }) => {
  const listUser = useCallback(async (token: string, type: string): Promise<any> => {
    const response = await get(`users/${type}`, token);
    return response;
  }, []);

  const searchRegisterUser = useCallback(async (token: string, type: string, search?: string): Promise<any> => {
    const response = await get(`users/${type}?${search ? 'search=' + search : ''}`, token);
    return response;
  }, []);
  
  const createUser = useCallback(async (token: string, data: any): Promise<any> => {
    const response = await post(`users`, data, token);
    return response;
  }, []);

  const createAddress = useCallback(async (token: string, data: any): Promise<any> => {
    const response = await post(`address`, data, token);
    return response;
  }, []);

  const createEmployeeData = useCallback(async (token: string, data: any): Promise<any> => {
    const response = await post(`positions-salaries`, data, token);
    return response;
  }, []);

  const updatePatient = useCallback(async (id: number, data: any, token: string): Promise<any> => {
    const response = await put(`users/${id}`, data, token);
    return response;
  }, []);

  const updateNotes = useCallback(async (id: number, data: any, token: string): Promise<any> => {
    const response = await put(`patients-notes/${id}`, data, token);
    return response;
  }, []);

  const createNotes = useCallback(async (data: any, token: string): Promise<any> => {
    const response = await post(`patients-notes`, data, token);
    return response;
  }, []);
  
  const updateAddress = useCallback(async (id: number, data: any, token: string): Promise<any> => {
    const response = await put(`address/${id}`, data, token);
    return response;
  }, []);

  const updatePositions = useCallback(async (id: number, data: any, token: string): Promise<any> => {
    const response = await put(`positions-salaries/${id}`, data, token);
    return response;
  }, []);  
  
  const createPositions = useCallback(async (data: any, token: string): Promise<any> => {
    const response = await post(`positions-salaries`, data, token);
    return response;
  }, []);  

  const getPatientById = useCallback(async (token: string, id: number): Promise<any> => {
    const response = await get(`users/users/${id}`, token);
    return response;
  }, []);

  const createPatientNotes = useCallback(async (token: string, data: any): Promise<any> => {
    const response = await post(`patients-notes`, data, token);
    return response;
  }, []);

  const getEmployeeById = useCallback(async (token: string, id: number): Promise<any> => {
    const response = await get(`positions-salaries/${id}`, token);
    return response;
  }, []);

  const getAddressByUserId = useCallback(async (token: string, userId: number): Promise<any> => {
    const response = await get(`address/${userId}`, token);
    return response;
  }, []);

  const getEmployeeDataByUserId = useCallback(async (token: string, userId: number): Promise<any> => {
    const response = await get(`positions-salaries/${userId}`, token);
    return response;
  }, []);

  const getUserById = useCallback(async (token: string, id: number): Promise<any> => { 
    const response = await get(`users/users/${id}`, token); 
    return response;
  }, []);

  const deleteUser = useCallback(async (token: string, id: number): Promise<any> => {
    const response = await del(`users/${id}`, token);
    return response;
  }, []);
  
  const value = useMemo(() => ({
    listUser,
    createUser,
    searchRegisterUser,
    createAddress,
    createEmployeeData,
    updatePatient,
    getPatientById,
    createPatientNotes,
    getEmployeeById,
    getAddressByUserId,
    getEmployeeDataByUserId,
    getUserById,
    createPositions,
    deleteUser, 
    updateAddress,
    updatePositions,
    updateNotes,
    createNotes
  }), [
    listUser,
    createUser,
    searchRegisterUser,
    createAddress,
    createEmployeeData,
    updatePatient,
    getPatientById,
    createPatientNotes,
    getEmployeeById,
    getAddressByUserId,
    getEmployeeDataByUserId,
    getUserById,
    deleteUser,
    updatePositions,
    createPositions,
    updateAddress,
    updateNotes,
    updateNotes,
    createNotes
  ]);  

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = (): UserContextProps => useContext(UserContext);
