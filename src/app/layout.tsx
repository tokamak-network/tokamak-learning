import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ShortcutHelp from "@/components/ShortcutHelp";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TokamakLearn[:run] - Interactive Solidity Coding Platform",
    template: "%s | TokamakLearn",
  },
  description:
    "An interactive Solidity smart contract learning platform by Tokamak Network. Master Solidity through hands-on, step-by-step exercises.",
  keywords: [
    "Solidity",
    "Smart Contracts",
    "Ethereum",
    "Blockchain",
    "Web3",
    "Tokamak Network",
    "Learn Solidity",
  ],
  authors: [{ name: "Tokamak Network" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TokamakLearn",
    title: "TokamakLearn[:run] - Interactive Solidity Coding Platform",
    description:
      "Master Solidity through hands-on, step-by-step exercises. 80+ problems from basics to advanced patterns.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TokamakLearn[:run]",
    description:
      "Master Solidity through hands-on, step-by-step exercises.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch{}`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Header />
          <ShortcutHelp />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
