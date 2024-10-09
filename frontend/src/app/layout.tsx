import { headers } from 'next/headers'
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cookieToInitialState } from 'wagmi'
import { ThemeProvider } from '@/store/ThemeProvider';
import { ConnectProvider } from "@/store/ConnectProvider";
import { Providers } from "@/redux/providers";
import { configWallet } from "@/config/configWallet";
import MainLayout from '@/components/layouts/MainLayout';

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
  title: "Decentralized Exchange",
  description: "The center exchange crypto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const initialState = cookieToInitialState(
    configWallet,
    headers().get('cookie')
  )

  return (
    <html lang="en">

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <ConnectProvider initialState={initialState}>
              <MainLayout>
                {children}
              </MainLayout>
            </ConnectProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
