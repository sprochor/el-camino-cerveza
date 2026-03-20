"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>("user");
  const [displayName, setDisplayName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name, avatar_url")
          .eq("id", session.user.id)
          .single();
          
        if (profile) {
          setRole(profile.role);
          setDisplayName(profile.full_name || "");
          setAvatarUrl(profile.avatar_url || "");
        }
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        setRole("user");
        setAvatarUrl("");
        setDisplayName("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.refresh();
  };

const NavLinks = ({ mobile = false }: { mobile?: boolean }) => {
    const linkClass = mobile 
      ? "block text-gray-700 hover:text-amber-700 hover:bg-amber-50 font-bold py-3 px-4 rounded-xl transition text-lg" 
      : "text-gray-700 hover:text-amber-700 font-medium transition";

    return (
      <>
        <Link href="/" className={linkClass}>Inicio</Link>
        <Link href="/cervecerias" className={linkClass}>Cervecerías</Link>
        <Link href="/cervezas" className={linkClass}>Cervezas</Link>
        <Link href="/notas" className={linkClass}>Notas</Link>
        <Link href="/nosotros" className={linkClass}>Nosotros</Link>
        <Link href="/juego" className={`${linkClass} flex items-center gap-1`}>
          Juego 🎮
        </Link>
        <Link href="/contacto" className={linkClass}>Contacto</Link>
        
        {(role === "admin" || role === "editor") && (
          <Link
            href="/admin"
            className={mobile 
              ? "block text-stone-800 bg-amber-50 py-3 px-4 rounded-xl font-bold border border-amber-200" 
              : "text-stone-800 bg-amber-50 px-4 py-1.5 rounded-md font-bold text-sm md:text-base border border-amber-200 hover:bg-amber-100 transition shadow-sm"}
          >
            Panel Admin
          </Link>
        )}
      </>
    );
  };
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm relative">
      <div className="container mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
        
        {/* LOGO Y NOMBRE */}
        <Link href="/" className="flex items-center gap-3 md:gap-4 hover:opacity-90 transition z-50">
          <Image
            src="/logo-cerveza.webp"
            alt="Logo El Camino de la Cerveza"
            width={56}
            height={56}
            className="rounded-full shadow-md object-cover md:w-16 md:h-16 w-12 h-12"
          />
          <span className="text-2xl md:text-3xl font-extrabold text-stone-800 hidden sm:block tracking-tight">
            El Camino
          </span>
        </Link>

        {/* MENÚ CENTRAL (Solo Desktop) */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <NavLinks />
        </div>

        {/* BOTONES DERECHA Y HAMBURGUESA */}
        <div className="flex items-center gap-3 md:gap-4 z-50">
          {user ? (
            <div className="flex items-center gap-3 md:gap-4">
              <Link
                href="/mi-camino"
                className="text-amber-700 font-bold hover:bg-amber-50 px-3 py-2 rounded-xl transition border border-transparent hover:border-amber-100 flex items-center gap-2 text-sm md:text-base"
              >
                <span className="hidden sm:inline">Mi Camino</span> 🍺
              </Link>

              {/* Foto de perfil o Inicial */}
              <Link href="/mi-camino">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Perfil" className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-amber-200 shadow-sm hover:scale-105 transition" />
                ) : (
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 text-amber-800 rounded-full flex items-center justify-center font-bold text-lg shadow-sm hover:scale-105 transition uppercase">
                    {displayName ? displayName.charAt(0) : user.email?.[0]}
                  </div>
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="hidden lg:block text-sm md:text-base font-medium border border-gray-300 px-4 py-1.5 rounded-full hover:bg-gray-100 transition shadow-sm"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <button className="bg-amber-700 text-white px-6 py-2 md:py-2.5 rounded-full hover:bg-amber-800 transition font-bold shadow-md text-sm md:text-base">
                Ingresar
              </button>
            </Link>
          )}

          {/* BOTÓN HAMBURGUESA */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MENÚ DESPLEGABLE MÓVIL */}
      <div 
        className={`lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl transition-all duration-300 ease-in-out origin-top ${
          isMenuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        <div className="p-4 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
          <NavLinks mobile />
          
          <div className="border-t border-gray-100 my-2 pt-4">
            {!user ? (
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full bg-amber-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm">
                  Ingresar a tu cuenta
                </button>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full text-center text-gray-600 font-bold border border-gray-200 px-6 py-3 rounded-xl hover:bg-gray-50 transition"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}