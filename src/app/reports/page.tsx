"use client";

import Layout from "@/components/layout";
import { useState } from "react";

export default function Reports() {
    const [expandedReport, setExpandedReport] = useState<string | null>(null);
    const [dateRanges, setDateRanges] = useState<Record<string, { start: string; end: string }>>({
        financeiro: { start: "", end: "" },
        usuarios: { start: "", end: "" },
        agendamentos: { start: "", end: "" },
        servicos: { start: "", end: "" },
    });

    const [activeFilterType, setActiveFilterType] = useState<"todos" | "funcionario" | "paciente">("todos");

    const handleFilterTypeChange = (type: "todos" | "funcionario" | "paciente") => {
        setActiveFilterType(type);
    };

    const toggleReport = (reportName: string) => {
        setExpandedReport(prev => (prev === reportName ? null : reportName));
    };

    const handleDateChange = (report: string, field: "start" | "end", value: string) => {
        setDateRanges(prev => ({
            ...prev,
            [report]: { ...prev[report], [field]: value },
        }));
    };

    const reports = [
        {
            key: "financeiro",
            title: "Relatório de Fluxo Financeiro",
            description: "Visão detalhada das transações financeiras que ocorreram ao longo de um período específico. Este relatório ajuda a administração a monitorar a saúde financeira da clínica.",
        },
        {
            key: "usuarios",
            title: "Relatório de Usuários",
            description: "Informações completas sobre todos os usuários cadastrados na plataforma.",
        },
        {
            key: "agendamentos",
            title: "Relatório de Agendamentos",
            description: "Resumo de todos os agendamentos realizados, pendentes ou concluídos em determinado intervalo.",
        },
        {
            key: "servicos",
            title: "Relatório de Serviços",
            description: "Informações completas sobre os serviços cadastrados na plataforma.",
        },
    ];

    return (
        <Layout>
            <h1 className="text-4xl font-bold mb-8 text-[#5D7285]">Relatórios</h1>
            <div className="w-full h-[1px] my-8 bg-slate-400"></div>

            {reports.map(report => (
                <div
                    key={report.key}
                    className="border-4 border-[#2196F3] bg-[#2196F3] p-6 rounded-lg cursor-pointer mb-6"
                    onClick={() => toggleReport(report.key)}
                >
                    <h2 className="text-white text-2xl font-bold mb-2" style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}>
                        {report.title}
                    </h2>
                    <p className="text-white text-sm mb-4">{report.description}</p>

                    {expandedReport === report.key && (
                        <div>
                            {report.key === "usuarios" && (
                                <div className="mb-4">
                                    <label className="text-white mr-4">Filtrar por:</label>
                                    <select
                                        value={activeFilterType}
                                        onChange={(e) => handleFilterTypeChange(e.target.value as "todos" | "funcionario" | "paciente")}
                                        className="p-2 rounded-md"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="funcionario">Funcionário</option>
                                        <option value="paciente">Paciente</option>
                                    </select>
                                </div>
                            )}

                            {(report.key === "financeiro" || report.key === "agendamentos") && (
                                <div className="flex space-x-4 mb-4">
                                    <div className="flex flex-col space-y-2 w-0/2">
                                        <label htmlFor={`start-${report.key}`} className="text-white">Data Inicial:</label>
                                        <input
                                            type="date"
                                            id={`start-${report.key}`}
                                            value={dateRanges[report.key].start}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => handleDateChange(report.key, "start", e.target.value)}
                                            className="p-2 rounded-md w-full"
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-2 w-0/2">
                                        <label htmlFor={`end-${report.key}`} className="text-white">Data Final:</label>
                                        <input
                                            type="date"
                                            id={`end-${report.key}`}
                                            value={dateRanges[report.key].end}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => handleDateChange(report.key, "end", e.target.value)}
                                            className="p-2 rounded-md w-full"
                                        />
                                    </div>
                                </div>
                            )}


                            <div className="mt-6">
                                <div className="flex space-x-4">
                                    <a
                                        href="URL_DA_PLANILHA"
                                        target="_blank"
                                        className="flex items-center space-x-2 border-2 border-[#03BB85] bg-white p-2 rounded-md"
                                    >
                                        <svg
                                            width="26"
                                            height="26"
                                            viewBox="0 0 26 26"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                        >
                                            <rect width="26" height="26" fill="url(#pattern0_217_351)" />
                                            <defs>
                                                <pattern
                                                    id="pattern0_217_351"
                                                    patternContentUnits="objectBoundingBox"
                                                    width="1"
                                                    height="1"
                                                >
                                                    <use
                                                        xlinkHref="#image0_217_351"
                                                        transform="scale(0.03125)"
                                                    />
                                                </pattern>
                                                <image
                                                    id="image0_217_351"
                                                    width="32"
                                                    height="32"
                                                    preserveAspectRatio="none"
                                                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKFSURBVFiF7ZdNSBRhGMd/M7O7rdvmR5rakpp96UawdlEQFQkpECTw0K1TkNLNCAwPBXnqAwoq8BLUsYstCUEaQeihD4iCwkOFYlogaaZmurvzTgcbaD50X91ZuvTc5vfMPu9v3vnPzq6CrXxDvc0GahzIs/fWq2qx/KOAxMmRY5cHNvI51UEMrW2jiwMEMPKiRiLe8Li7LTMBxYVJVhBDjRrJeONQ9/HNC2RYQYRarSf7ZSU8FzAlqlJyElkRAMhRViXSZSJrAqZEtUiuG0zPBAxlbYmDRjLeOni2I6sCU0qApTXGbUGolULvax3s6rT3fF4JzKJxVyt07e1RFqhXv7FihE4DfX/3spoBmfovkDYDBf4gvZVNFPiCUgM1FKI520kagvb3D5hYmc9MoDmvnFM7Y1KLm6XrOkIIOiOH6Rl7lpmApqzepUczn7g99drS6z/UDkD7u34Lv7m3hbJAGJ+S/g5LP4aTKws8/T5uYQIDwMF/6gnZsfICdbkReiubLMz/5wrtvCSw1XuBWLiYWLjYtXeuvM5ybGbAU4Hhuc/cnx61sOv7WwDo+vDEws/vqqPEH/JWYHRphjtf31rY1X1HABy8ozTmvUBNuNix1WbK7bzInyM7Vl6gNjdCbW7EtWcPYVYy8HL+CwMzHy3swu4GAC6Nj1j4mdIainxyuyAt8GZxmmsTLyysp6IewMFPFFZ5LxANFTq+ks0M2Lnse0NKIGnoADTml9GYX+Z6zq0DRy3HZgaWRSpzgcHZMS6ODbNNC6QdBhBQNWKhHSyLFDcmX2Uu8EukuDLxXGrxzdQ//0Hi8ucUuQd4E6XgnO22Aw+BOa8W9WFQoSyRQDEWhXrP3v8NKVPMH9i9mDcAAAAASUVORK5CYII="
                                                />
                                            </defs>
                                        </svg>
                                        <span className="text-sm font-semibold text-[#03BB85]">Planilha</span>
                                    </a>


                                    <a
                                        href="URL_DO_PDF"
                                        target="_blank"
                                        className="flex items-center space-x-2 border-2 border-[#FF0000] bg-white p-2 rounded-md"
                                    >
                                        <svg
                                            width="26"
                                            height="26"
                                            viewBox="0 0 26 26"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                        >
                                            <rect width="26" height="26" fill="url(#pattern0_217_353)" />
                                            <defs>
                                                <pattern
                                                    id="pattern0_217_353"
                                                    patternContentUnits="objectBoundingBox"
                                                    width="1"
                                                    height="1"
                                                >
                                                    <use xlinkHref="#image0_217_353" transform="scale(0.03125)" />
                                                </pattern>
                                                <image
                                                    id="image0_217_353"
                                                    width="32"
                                                    height="32"
                                                    preserveAspectRatio="none"
                                                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJsSURBVFiFzZdNSxtRFIafGzvJjE6SUly02hYS6EZwIYbSJlXstuAHuvEXiMvShXv/gZRu+gPcCboUg7aF+oHFhTuJVpFYDAQ0aTIaHTPThSQmjTNJTSb2Xd17zhneZ849d2AEForHj9+ZLj4DT61q7PTzML76NvzyTbU6l1WiHnOAdDoT+bK2+f3OAPWYl0J8Xd9cvytAQ5RKZV7ZQTgOUA2iKQB2EI4BuKUHt0J8W/9RNpiOATzr7MAtSRXx09TvSClEJWaD5Pep+H0v0M4vyGi5v9ORwsLxGWhTPHjbZMt8U4bQDqJpt8AKomkAVhCODaEdhGmaxX1TO1CQ2nrTBVFY/BobWwXCThiawSDG+w9lseedTwSUd8ARcwCxv2+Zu5cjKJXlEMqhEHJvLwD64SFn0ShCUWgbHES0tGBkMuS2trg6OgIh8I6OIhQFgKvjY86Wl2sCsOyAEg4jZBn94AClvx91ZAQpEKB1YAAjm8WlqrRPT+Pu6kLIMt7x8eKzpq7X9vpUuYaXOztoS0uYuo4cCnEZi2GkUmQXFgC4SiRQh4c5nZkB4HxtDYB8ItEYAKWvDykYxNPTQ2Z2tiKfPznB5fNdb4Tg4eQkANriImcrK/UD5JNJLmMxtGgUfW8PT3d3MefyelGHhrjY3r4OmCbJqamaTGsCyKfT6Lu7xbYCGJqGFAjQMTeHoWnkNjbIzs+DYZBPJv/ZHMo/RKZdYb3Kf/xUtr/tQ3QvugEwzao/EXdV7nXEMiesEpvbOw07ErfUwiO/WhYrHIHlED5u9zfK31b/0QxU6shB33hVAOFiorSwkeZCmBOFzR/HxtEXiuMO4AAAAABJRU5ErkJggg=="
                                                />
                                            </defs>
                                        </svg>
                                        <span className="text-sm font-semibold text-[#FF0000]">PDF</span>
                                    </a>

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </Layout>
    );
}
