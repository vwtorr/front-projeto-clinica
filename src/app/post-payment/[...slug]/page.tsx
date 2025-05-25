"use client";

import { useCallback, useState } from "react";
import Layout from "@/components/layout";
import Button from "@/components/button"; // ajusta conforme tua estrutura
import { useParams } from "next/navigation";
import { useAuth } from "@/context/auth";
import { useExamContext } from "@/context/exam";

export default function PostPaymentIndex() {
  const { slug } = useParams();
  const { token } = useAuth();
  const { updateExam } = useExamContext();
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [value, setValue] = useState(slug ? slug[2] : 0); // valor total
  const [paymentAmounts, setPaymentAmounts] = useState<{ [key: string]: string }>({});

  const handleCheckboxChange = (payment: string) => {
    if (selectedPayments.includes(payment)) {
      setSelectedPayments((prevSelectedPayments) =>
        prevSelectedPayments.filter((p) => p !== payment)
      );
      // Remove o valor associado ao método se desmarcado
      setPaymentAmounts((prevAmounts) => {
        const { [payment]: removed, ...rest } = prevAmounts;
        return rest;
      });
    } else {
      if (selectedPayments.length < 2) {
        setSelectedPayments((prevSelectedPayments) => [
          ...prevSelectedPayments,
          payment,
        ]);
      }
    }
  };

  const formatToCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'decimal', // Ou 'currency' para o símbolo de R$
      minimumFractionDigits: 0, // Sem casas decimais
    }).format(value);
  };

  const getCookie = (name: string) => {
    const decodedCookies = decodeURIComponent(document.cookie);
    const cookieArr = decodedCookies.split(';');

    for (let i = 0; i < cookieArr.length; i++) {
      let cookie = cookieArr[i].trim();
      if (cookie.indexOf(name + "=") === 0) {
        return cookie.substring(name.length + 1);
      }
    }
    return "";
  };

  const getJsonFromCookie = (name: string) => {
    const cookieValue = getCookie(name);
    if (cookieValue) {
      return JSON.parse(cookieValue); // Converte a string JSON de volta para objeto
    }
    return null;
  };

  const handlesPag = useCallback(async () => {
    const key = slug ? slug[1] : null;
    if (!token || !key) return;
    const ids = getJsonFromCookie(key);
    for (const id of ids) {
      const data = {
        paymentStatus: 'PAGO',
        statusExam: 'CONCLUIDO',
        paymentMethods: paymentAmounts
      }
      await updateExam(id, token, data)

    }
    window.location.href = '/exams';
  }, [updateExam, slug, token, getJsonFromCookie, paymentAmounts]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, payment: string) => {
    let amount = e.target.value;

    // Remove caracteres não numéricos (como R$, pontos e vírgulas)
    amount = amount.replace(/[^\d]/g, ''); // Remove tudo que não é número

    // Converte para número e armazena sem a parte decimal
    const rawAmount = parseInt(amount, 10) || 0; // Converte para inteiro

    // Atualiza o valor formatado
    setPaymentAmounts((prevAmounts) => ({
      ...prevAmounts,
      [payment]: formatToCurrency(rawAmount),
    }));

  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 text-[#5D7285]">Pagamento de Exame</h1>
      <div className="w-full h-[1px] my-8 bg-slate-400"></div>

      <div className="flex gap-10">
        {/* Caixa Dinheiro */}
        <label
          htmlFor="Dinheiro"
          className={`flex flex-col items-center justify-center w-96 h-64 border-2 ${selectedPayments.includes("Dinheiro") ? "border-green-500" : "border-blue-500"
            } bg-white text-black rounded-lg cursor-pointer hover:shadow-lg`}
        >
          <input
            type="checkbox"
            id="Dinheiro"
            checked={selectedPayments.includes("Dinheiro")}
            onChange={() => handleCheckboxChange("Dinheiro")}
            className="mb-4 hidden"
          />
          <span className="text-7xl">💵</span>
          <p className="mt-6 text-xl font-semibold">Dinheiro</p>
          {selectedPayments.includes("Dinheiro") && (
            <input
              type="text"
              value={paymentAmounts["Dinheiro"] || ""}
              onChange={(e) => handleAmountChange(e, "Dinheiro")}
              className="mt-4 px-4 py-3 rounded-[8px] w-64 outline-none border-none focus:outline-none focus:ring-0"
              placeholder="Valor"
              inputMode="decimal"
            />
          )}
        </label>

        {/* Caixa PIX */}
        <label
          htmlFor="PIX"
          className={`flex flex-col items-center justify-center w-96 h-64 border-2 ${selectedPayments.includes("PIX") ? "border-green-500" : "border-blue-500"
            } bg-white text-black rounded-lg cursor-pointer hover:shadow-lg`}
        >
          <input
            type="checkbox"
            id="PIX"
            checked={selectedPayments.includes("PIX")}
            onChange={() => handleCheckboxChange("PIX")}
            className="mb-4 hidden"
          />
          <span className="text-7xl">💱</span>
          <p className="mt-6 text-xl font-semibold">PIX</p>
          {selectedPayments.includes("PIX") && (
            <input
              type="text"
              value={paymentAmounts["PIX"] || ""}
              onChange={(e) => handleAmountChange(e, "PIX")}
              className="mt-4 px-4 py-3 rounded-[8px] w-64 outline-none border-none focus:outline-none focus:ring-0"
              placeholder="Valor"
              inputMode="decimal"
            />
          )}
        </label>

        {/* Caixa Cartão de Crédito */}
        <label
          htmlFor="Cartão"
          className={`flex flex-col items-center justify-center w-96 h-64 border-2 ${selectedPayments.includes("Cartão") ? "border-green-500" : "border-blue-500"
            } bg-white text-black rounded-lg cursor-pointer hover:shadow-lg`}
        >
          <input
            type="checkbox"
            id="Cartão"
            checked={selectedPayments.includes("Cartão")}
            onChange={() => handleCheckboxChange("Cartão")}
            className="mb-4 hidden"
          />
          <span className="text-7xl">💳</span>
          <p className="mt-6 text-xl font-semibold">Cartão</p>
          {selectedPayments.includes("Cartão") && (
            <input
              type="text"
              value={paymentAmounts["Cartão"] || ""}
              onChange={(e) => handleAmountChange(e, "Cartão")}
              className="mt-4 px-4 py-3 rounded-[8px] w-64 outline-none border-none focus:outline-none focus:ring-0"
              placeholder="Valor"
              inputMode="decimal"
            />
          )}
        </label>
      </div>

      {selectedPayments.length > 0 && (
        <div className="flex justify-between items-start mt-10">
          <div>
            <p className="text-xl font-semibold text-[#5D7285]">Confirme o valor total que irá receber</p>
            <div className="mt-10 px-4 py-2 bg-white border border-gray-400 w-[200px] font-semibold flex justify-between">
              <span className="text-blue-600">Total a receber:</span>
              <span>R$ {formatToCurrency(+value)}</span>
            </div>

            <div className="mt-10">
              {selectedPayments.map((payment) => (
                <div key={payment} className="flex justify-between">
                  <span>{payment}:</span>
                  <span>R$ {paymentAmounts[payment] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-40 mr-48">
            <Button onClick={handlesPag} label="Realizar Pagamento" className="px-8 py-4 text-lg" />
          </div>
        </div>
      )}
    </Layout>
  );
}
