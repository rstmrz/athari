import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// On indique à Next.js de remonter d'un dossier pour trouver "components"
import SmoothScroll from "../components/SmoothScroll";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sticky Clone Boilerplate",
  description: "Landing page premium avec Next.js et GSAP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}