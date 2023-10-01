import "./globals.css";
import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { ThirdwebProvider } from "components/ThirdWebProvider";
import Navbar from "components/Navbar";

const inter = Kanit({
  weight: ["300", "400", "500", "600", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web3 Projects by Tomster",
  description: "Web3 projects built by Tomster.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ThirdwebProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID} activeChain="base-goerli">
        <body className={`${inter.className}`}>
          <Navbar />
          {children}
        </body>
      </ThirdwebProvider>
    </html>
  );
}
