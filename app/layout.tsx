import type { Metadata } from "next"; 
import { Analytics } from "@vercel/analytics/react"; // 👈 Importado una sola vez
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import AgeModal from "@/components/AgeModal";
import "./globals.css";

// 👇 Meta-datos para SEO y al compartir en redes/WhatsApp
export const metadata: Metadata = {
  title: "El Camino de la Cerveza",
  description: "Descubre, puntúa y explora las mejores cervezas artesanales y fábricas de Argentina.",
  icons: {
    icon: "/favicon.ico?v=2", 
  },
};

// 👇 Unificamos todo en una sola función principal
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-stone-50 text-stone-900 flex flex-col min-h-screen" suppressHydrationWarning>
        
        {/* ACÁ VA EL POP-UP DE EDAD PARA QUE CARGUE EN TODA LA WEB */}
        <AgeModal />

        <Navbar />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />

        {/* 👇 El componente de Vercel Analytics se carga al final de todo 👇 */}
        <Analytics />
      </body>
    </html>
  );
}