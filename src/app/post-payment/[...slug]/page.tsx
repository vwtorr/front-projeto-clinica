"use client";

import { useCallback, useState, useMemo } from "react";
import Layout from "@/components/layout";
import Button from "@/components/button"; // ajuste conforme estrutura
import { useParams } from "next/navigation";
import { useAuth } from "@/context/auth";
import { useExamContext } from "@/context/exam";
import Image from "next/image";
import Money from "@/assets/dinheiro.png";
import PIX from "@/assets/pix.png";
import Cartao from "@/assets/cartao.png";
import AlertBox from "@/components/alert-box";
import ConfirmationBox from "@/components/confirmation-box";
import SuccessBox from "@/components/success-box";

export default function PostPaymentIndex() {
  const params = useParams();
  const slugArray = params?.slug as string[] | undefined;
  const [value, setValue] = useState(slugArray?.[2] || "0");

  const { token } = useAuth();
  const { updateExam } = useExamContext();
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [paymentAmounts, setPaymentAmounts] = useState<{ [key: string]: string }>({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const totalInserido = Object.values(paymentAmounts).reduce((acc, val) => acc + parseBRLtoNumber(val), 0);

  const handleCheckboxChange = (payment: string) => {
    if (selectedPayments.includes(payment)) {
      setSelectedPayments((prevSelectedPayments) =>
        prevSelectedPayments.filter((p) => p !== payment)
      );
      setPaymentAmounts((prevAmounts) => {
        const { [payment]: removed, ...rest } = prevAmounts;
        return rest;
      });
    } else {
      if (selectedPayments.length < 2) {
        setSelectedPayments((prevSelectedPayments) => [...prevSelectedPayments, payment]);
      }
    }
  };

  const formatToCurrency = (num: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(num);
  };

  const getCookie = (name: string) => {
    const decodedCookies = decodeURIComponent(document.cookie);
    const cookieArr = decodedCookies.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
      let cookie = cookieArr[i].trim();
      if (cookie.startsWith(name + "=")) {
        return cookie.substring(name.length + 1);
      }
    }
    return "";
  };

  const getJsonFromCookie = (name: string) => {
    const cookieValue = getCookie(name);
    if (cookieValue) {
      try {
        return JSON.parse(cookieValue);
      } catch {
        return null;
      }
    }
    return null;
  };

  const handlesPag = useCallback(async () => {
    const key = slugArray ? slugArray[1] : null;
    if (!token || !key) return;

    const ids = getJsonFromCookie(key);
    if (!ids || !Array.isArray(ids)) return;

    for (const id of ids) {
      const data = {
        paymentStatus: "PAGO",
        statusExam: "CONCLUÍDO",
        paymentMethods: paymentAmounts,
      };
      await updateExam(id, token, data);
    }
    // Remover o redirecionamento daqui!
  }, [updateExam, slugArray, token, getJsonFromCookie, paymentAmounts]);


  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    payment: string
  ) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, ""); // Apenas números
    const number = Number(numericValue) / 100;

    // Calcula o total pago, descontando o valor antigo do método atual e adicionando o novo valor
    const oldValue = parseBRLtoNumber(paymentAmounts[payment] || "0");
    const otherPaymentsTotal = Object.entries(paymentAmounts)
      .filter(([key]) => key !== payment)
      .reduce((acc, [, val]) => acc + parseBRLtoNumber(val), 0);
    const newTotal = otherPaymentsTotal + number;

    if (newTotal > Number(value)) {
      setAlertMessage(
        `O valor total dos pagamentos não pode ultrapassar o valor a pagar (${formatToCurrency(Number(value))}).`
      );
      setAlertOpen(true);
      return; // Não atualiza o valor
    }

    const formatted = number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    setPaymentAmounts((prev) => ({
      ...prev,
      [payment]: formatted,
    }));
  };

  function parseBRLtoNumber(value: string): number {
    if (!value) return 0;
    const sanitized = value
      .replace(/[^0-9,.-]+/g, '') // remove R$, espaços e qualquer outro caractere
      .replace(/\./g, '') // remove os pontos dos milhares
      .replace(',', '.'); // troca vírgula decimal por ponto
    const numberValue = Number(sanitized);
    return isNaN(numberValue) ? 0 : numberValue;
  }

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, ""); // Remove tudo que não for número
    const number = Number(numericValue) / 100;

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handlePaymentSubmit = () => {
    const totalPaid = Object.values(paymentAmounts).reduce((acc, val) => acc + parseBRLtoNumber(val), 0);
    const totalDue = Number(value);

    if (totalPaid !== totalDue) {
      setAlertMessage("O valor pago deve ser igual ao valor total do exame.");
      setAlertOpen(true);
    } else {
      handlesPag();
    }
  };

  const getTotalPayment = () => {
    return selectedPayments.reduce((acc, payment) => {
      return acc + parseBRLtoNumber(paymentAmounts[payment] || "0");
    }, 0);
  };

  const handleTryToPay = () => {
    const totalPayment = getTotalPayment();
    const totalExpected = Number(value);

    if (totalPayment !== totalExpected) {
      setAlertMessage(`O valor total pago (${formatToCurrency(totalPayment)}) não confere com o valor esperado (${formatToCurrency(totalExpected)}).`);
      setAlertOpen(true);
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmPayment = async () => {
    setIsConfirmOpen(false);
    await handlesPag(); // realiza o pagamento
    setSuccessMessage("Pagamento realizado com sucesso!");
    setSuccessOpen(true);  // abrir modal de sucesso
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    window.location.href = "/exams";
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 text-[#5D7285]">Pagamento de Exame</h1>
      <div className="w-full h-[1px] my-8 bg-slate-400"></div>

      {/* Container das opções de pagamento */}
      <div className="flex flex-wrap justify-center items-center gap-8 w-full">
        {/* Caixa Dinheiro */}
        <label
          htmlFor="Dinheiro"
          className={`flex flex-col items-center justify-center w-80 sm:w-96 h-64 border-2 ${selectedPayments.includes("Dinheiro") ? "border-green-500" : "border-blue-500"
            } bg-white text-black rounded-lg cursor-pointer hover:shadow-lg`}
        >
          <input
            type="checkbox"
            id="Dinheiro"
            checked={selectedPayments.includes("Dinheiro")}
            onChange={() => handleCheckboxChange("Dinheiro")}
            className="mb-4 hidden"
          />

          <Image
            src={Money}
            alt="Imagem de Dinheiro"
            width={80}
            height={80}
            className="mb-4"
          />

          <p className="mt-4 text-xl font-semibold">Dinheiro</p>

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
          className={`flex flex-col items-center justify-center w-80 sm:w-96 h-64 border-2 ${selectedPayments.includes("PIX") ? "border-green-500" : "border-blue-500"
            } bg-white text-black rounded-lg cursor-pointer hover:shadow-lg`}
        >
          <input
            type="checkbox"
            id="PIX"
            checked={selectedPayments.includes("PIX")}
            onChange={() => handleCheckboxChange("PIX")}
            className="mb-4 hidden"
          />
          <Image
            src={PIX}
            alt="Imagem de PIX"
            width={60}
            height={60}
            className="mb-4"
          />

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
          className={`flex flex-col items-center justify-center w-80 sm:w-96 h-64 border-2 ${selectedPayments.includes("Cartão") ? "border-green-500" : "border-blue-500"
            } bg-white text-black rounded-lg cursor-pointer hover:shadow-lg`}
        >
          <input
            type="checkbox"
            id="Cartão"
            checked={selectedPayments.includes("Cartão")}
            onChange={() => handleCheckboxChange("Cartão")}
            className="mb-4 hidden"
          />
          <Image
            src={Cartao}
            alt="Imagem de Cartão"
            width={80}
            height={80}
            className="mb-4"
          />
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

      {/* Confirmação dos valores selecionados */}
      {selectedPayments.length > 0 && (
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mt-10 px-6 py-6 bg-gray-50 rounded-lg shadow-sm mx-auto w-full">
          <div className="flex flex-col">
            <p className="text-xl font-semibold text-[#5D7285]">
              Confirme o valor total que irá receber
            </p>

            <div className="mt-6 space-y-3 text-gray-700 font-medium">
              {selectedPayments.map((payment) => (
                <div
                  key={payment}
                  className="flex justify-between border-b border-gray-200 pb-1 w-[250px] sm:w-[300px]"
                >
                  <span>{payment}:</span>
                  <span>{formatToCurrency(parseBRLtoNumber(paymentAmounts[payment]))}</span>
                </div>
              ))}
            </div>

            <div className="mt-14 px-5 py-3 bg-white border border-gray-300 w-[250px] sm:w-[300px] font-semibold flex flex-col justify-between rounded-md shadow">
              {/* Total inserido */}
              <div className="flex justify-between text-gray-700 mb-1">
                <span>Total inserido:</span>
                <span>{formatToCurrency(
                  Object.values(paymentAmounts).reduce((acc, val) => acc + parseBRLtoNumber(val), 0)
                )}</span>
              </div>

              {/* Total a receber */}
              <div className="flex justify-between text-blue-600 text-lg">
                <span>Total a receber:</span>
                <span>{formatToCurrency(+value)}</span>
              </div>
            </div>

          </div>

          <div className="lg:mt-36">
            <Button
              onClick={handleTryToPay}
              label="Realizar Pagamento"
              className="px-8 py-4 text-lg rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            />
          </div>
        </div>
      )}

      <AlertBox
        isOpen={alertOpen}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />

      <ConfirmationBox
        isOpen={isConfirmOpen}
        message="Tem certeza que deseja realizar o pagamento?"
        onConfirm={handleConfirmPayment}
        onCancel={() => setIsConfirmOpen(false)}
      />

      <SuccessBox
        isOpen={successOpen}
        message={successMessage}
        onClose={handleSuccessClose}  // chama quando usuário clicar em OK
      />
    </Layout>
  );

}
