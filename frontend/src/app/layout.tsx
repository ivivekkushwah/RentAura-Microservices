import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/context/SessionContext";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import ClientChatBot from "@/components/ClientChatBot";

export const metadata: Metadata = {
  title: "RentAura",
  description: "Rental property management app",
  verification: {
    google: "GwvmBj6z_cCDL4n6_PlBhl9UXTclYDIVeDhW_b0NRpM",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}

            {/* ✅ Chatbot rendered safely from client component */}
            <ClientChatBot />

            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
