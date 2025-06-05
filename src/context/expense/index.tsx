"use client";
import { get, post, del, put } from "@/config/api";
import React, { useMemo, useContext, ReactNode, useCallback } from "react";

export interface ExpenseContextProps {
  listExpenses: (token: string) => Promise<any>;
  createExpenses: (token: string, data: any) => Promise<any>;
  searchRegister: (token: string, search?: string, initialDate?: string, finalDate?: string) => Promise<any>;
  deleteExpense: (token: string, id: number) => Promise<any>;
  getExpenseById: (token: string, id: number) => Promise<any>;
  updatePaymentStatus: (token: string, id: number, newStatus: string) => Promise<any>;
  updateExpense: (token: string, id: number, data: any) => Promise<any>;  // <-- adicionada
}

interface Props {
  children: ReactNode;
}

const ExpenseContext = React.createContext<ExpenseContextProps>({} as ExpenseContextProps);

export const ExpenseProvider: React.FC<Props> = ({ children }) => {
  const listExpenses = useCallback(async (token: string): Promise<any> => {
    const response = await get('expenses', token);
    return response;
  }, []);

  const searchRegister = useCallback(async (token: string, search?: string, initialDate?: string, finalDate?: string): Promise<any> => {
    const response = await get(`expenses?${search ? 'search=' + search + '&' : ''}${initialDate ? 'initialDate=' + initialDate + '&' : ''}${finalDate ? 'finalDate=' + finalDate + '' : ''}`, token);
    return response;
  }, []);

  const getExpenseById = useCallback(async (token: string, id: number): Promise<any> => {
    const response = await get(`expenses/${id}`, token);
    return response;
  }, []);

  const createExpenses = useCallback(async (token: string, data: any): Promise<any> => {
    const response = await post('expenses', data, token);
    return response;
  }, []);

  const deleteExpense = useCallback(async (token: string, id: number): Promise<any> => {
    const response = await del(`expenses/${id}`, token);
    return response;
  }, []);

  const updatePaymentStatus = useCallback(async (token: string, id: number, newStatus: string): Promise<any> => {
    const response = await put(`expenses/${id}`, { status: newStatus }, token);
    return response;
  }, []);

  // Função para atualizar o título completo
  const updateExpense = useCallback(async (token: string, id: number, data: any): Promise<any> => {
    const response = await put(`expenses/${id}`, data, token);
    return response;
  }, []);

  const value = useMemo(() => ({
    listExpenses,
    searchRegister,
    createExpenses,
    deleteExpense,
    getExpenseById,
    updatePaymentStatus,
    updateExpense,  // <-- adicionada aqui
  }), [listExpenses, createExpenses, deleteExpense, getExpenseById, updatePaymentStatus, updateExpense]);

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

export const useExpenseContext = (): ExpenseContextProps => useContext(ExpenseContext);
