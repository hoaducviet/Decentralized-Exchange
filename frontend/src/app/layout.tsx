import { headers } from 'next/headers'
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cookieToInitialState } from 'wagmi'
import { ThemeProvider } from '@/store/ThemeProvider';
import { ConnectProvider } from "@/store/ConnectProvider";
import { Web3Provider } from '@/store/Web3Provider';
import { LoadProvider } from '@/store/LoadProvider';
import { ReduxProvider } from "@/redux/ReduxProvider";
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
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <Web3Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ConnectProvider initialState={initialState}>
                <LoadProvider>
                  <MainLayout>
                    {children}
                  </MainLayout>
                </LoadProvider>
              </ConnectProvider>
            </ThemeProvider>
          </Web3Provider>
        </ReduxProvider>
      </body>
    </html>
  );
}
