import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThirdwebProvider } from "components/ThirdWebProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web3 Projects by Tomster",
  description: "Web3 projects built by Tomster.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThirdwebProvider
        clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
        activeChain="base-goerli"
      >
        <body className={`${inter.className} bg-black text-white`}>
          {children}
        </body>
      </ThirdwebProvider>
    </html>
  );
}
