"use client";
import Image from "next/image";
import Login from "@/assets/image-login.png";
import { useAuth } from "@/context/auth";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { signIn, setCookies } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userData = { email: username, password };
      const response: any = await signIn(userData);

      if (response.status !== 200 || response.data.access_token == null) {
        setErrorLogin(true);
        return;
      }

      setCookies(response.data.access_token);
      router.push("/exams");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  useEffect(() => {
    const isMobileDevice = window.innerWidth < 1024; 
    setIsMobile(isMobileDevice);
  }, []);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-screen px-4 text-center">
        <p className="text-lg font-semibold text-red-600">
          Este sistema foi desenvolvido para uso em computadores até o momento. Por favor, acesse pelo seu desktop.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 grid grid-cols-1 xl:grid-cols-2 items-center">
      <div className="hidden xl:block h-screen w-full relative shadow-xl">
        <Image
          src={Login}
          alt="Imagem de login"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>
      <div className="px-24 h-screen grid items-center">
        <form onSubmit={handleSubmit} className="text-[#5D7285] flex flex-col gap-4">
          <h1 className="text-2xl font-bold ">Login</h1>
          <label htmlFor="username" className="cursor-pointer">
            Usuário:
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`${errorLogin ? "!border-red-500" : ""} custom-input`}
              autoComplete="off"
              placeholder="Insira seu CPF aqui..."
            />
          </label>
          <label htmlFor="password" className="cursor-pointer">
            Senha
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${errorLogin ? "!border-red-500" : ""} custom-input`}
              autoComplete="off"
              placeholder="Insira sua senha aqui..."
            />
          </label>
          <a href="#" className="text-custom-link no-underline hover:underline">
            Esqueceu a senha?
          </a>
          <button type="submit" className="custom-button">
            Entrar
          </button>
          {errorLogin && (
            <p className="font-bold !text-red-600 text-center text-xl">
              Usuário e/ou senha incorretos.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
