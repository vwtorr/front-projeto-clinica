"use client";
import { del, get, post, put } from "@/config/api";
import React, { useMemo, useContext, ReactNode, useCallback } from "react";

export interface ExamContextProps {
  listExam: (token: string) => Promise<any>;
  deleteExam: (token: string, id: number) => Promise<any>;
  createExam: (token: string, data: any) => Promise<any>;
  updateExam: (id: number, token: string, data: any) => Promise<any>;
  searchRegister: (token: string, search?: string, initialDate?: string, finalDate?: string) => Promise<any>;
  getExams: (token: string, id: number) => Promise<any>;
  getExamById: (token: string, examId: number) => Promise<any>; // 👈 novo método
  getExamView: (token: string, id: number, date: string) => Promise<any>; // 👈 novo método
}

interface Props {
  children: ReactNode;
}

const ExamContext = React.createContext<ExamContextProps>({} as ExamContextProps);

export const ExamProvider: React.FC<Props> = ({ children }) => {

  const listExam = useCallback(async (token: string): Promise<any> => {
    const response = await get('patients-exams', token);
    return response;
  }, []);

  const createExam = useCallback(async (token: string, data: any): Promise<any> => {
    const response = await post('patients-exams', data, token);
    return response;
  }, []);

  const updateExam = useCallback(async (id: number, token: string, data: any): Promise<any> => {
    const response = await put(`patients-exams/${id}`, data, token);
    return response;
  }, []);

  const getExams = useCallback(async (token: string, id: number): Promise<any> => {
    const response = await get(`patients-exams/group-by-user-id/${id}`, token);
    return response;
  }, []);

  const getExamById = useCallback(async (token: string, examId: number): Promise<any> => {
    const response = await get(`patients-exams/${examId}`, token); // 👈 ajusta conforme rota da sua API
    return response;
  }, []);

    const getExamView = useCallback(async (token: string, id: number, date: string): Promise<any> => {
    const response = await get(`patients-exams/group-by-user-id/${id}/${date}`, token); // 👈 ajusta conforme rota da sua API
    return response;
  }, []);

  const deleteExam = useCallback(async (token: string, id: number): Promise<any> => {
    const response = await del(`patients-exams/${id}`, token);
    return response;
  }, []);

  const searchRegister = useCallback(async (token: string, search?: string, initialDate?: string, finalDate?: string): Promise<any> => {
    const response = await get(`patients-exams?${search ? `search=${search}&` : ''}${initialDate ? `initialDate=${initialDate}&` : ''}${finalDate ? `finalDate=${finalDate}` : ''}`, token);
    return response;
  }, []);

  const value = useMemo(() => ({
    listExam,
    deleteExam,
    searchRegister,
    updateExam,
    createExam,
    getExams,
    getExamById,
    getExamView
  }), [listExam, updateExam, searchRegister, deleteExam, createExam, getExams, getExamById, getExamView]);

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};

export const useExamContext = (): ExamContextProps => useContext(ExamContext);
