import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import { ExpenseProvider } from "@/context/expense";
import { ServiceProvider } from "@/context/service";
import { PatientProvider } from "@/context/patient";
import { UserProvider } from "@/context/user";
import { ExamProvider } from "@/context/exam";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Labsys",
  description: "Nome do sistema",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <AuthProvider>
          <ExpenseProvider>
            <ServiceProvider>
              <PatientProvider>
                <UserProvider>
                  <ExamProvider>
                    {children}
                  </ExamProvider>
                </UserProvider>
              </PatientProvider>
            </ServiceProvider>
          </ExpenseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
