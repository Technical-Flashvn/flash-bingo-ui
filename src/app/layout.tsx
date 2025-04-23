import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ReactQueryProvider } from "@/lib/react-query-provider";

export const metadata: Metadata = {
  title: "FLASH Bingo",
  icons: {
    icon: "/FLASH-logo-colorful.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ReactQueryProvider>
          
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
