import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppWalletProvider from "@/components/wallet/WalletProvider";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solana Academy | Apprends Solana en pratiquant",
  description: "Un parcours interactif pour découvrir Solana, Devnet et tes premières transactions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
}
