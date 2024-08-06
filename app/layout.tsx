import type { Metadata } from "next";
import "./globals.css";
import { PantryProvider } from "@/components/provider";
import { AuthProvider } from "@/components/auth-context";

export const metadata: Metadata = {
  title: "Pantry tracker",
  description: "Manage inventory on the go!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <AuthProvider>
        <PantryProvider>
            <body>{children}</body>
        </PantryProvider>
      </AuthProvider>
    </html>
  );
}
