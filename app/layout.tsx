import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next"; 
import Navbar from "@/components/navbar";
import "./globals.css";
import AgeModal from "@/components/AgeModal";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics /> {/* 👈 2. Lo ponés justo antes de cerrar el body */}
      </body>
    </html>
  )
}

// 👇 Meta-datos para SEO y al compartir en redes/WhatsApp
export const metadata: Metadata = {
  title: "El Camino de la Cerveza",
  description: "Descubre, puntúa y explora las mejores cervezas artesanales y fábricas de Argentina.",
  icons: {
    icon: "/favicon.ico?v=2", // 👈 Cambié a v=2 para forzar que el navegador refresque el nuevo ícono
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-stone-50 text-stone-900 flex flex-col min-h-screen" suppressHydrationWarning>
        
        {/* 👇 ACÁ VA EL POP-UP DE EDAD PARA QUE CARGUE EN TODA LA WEB 👇 */}
        <AgeModal />

        <Navbar />
        {/* Sacamos el 'container mx-auto p-4' de acá para que el Hero pueda ocupar todo el ancho si queremos, 
            y dejamos que cada página maneje sus propios márgenes (como ya hicimos en page.tsx) */}
        <main className="flex-grow">
          {children}
        </main>
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}