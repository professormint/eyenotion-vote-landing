"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Configure wallets
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-[#15151F] bg-cover bg-center flex flex-col items-center justify-center" style={{ backgroundImage: "url('/bg.png')" }}>
               <Toaster  position="bottom-left" toastOptions={{style: {"fontSize": "14px", background: "#2E2E3A", color:"#ffff" }}} reverseOrder={false} />

       <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_RPC!}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}
