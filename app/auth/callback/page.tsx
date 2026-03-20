"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// 1. Aislamos la lógica en un sub-componente
function CallbackLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (code) {
      const exchangeCode = async () => {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          router.push(next);
          router.refresh();
        } else {
          router.push("/login?error=true");
        }
      };
      exchangeCode();
    } else {
      router.push(next);
      router.refresh();
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-amber-700 text-xl font-bold animate-pulse">
        Verificando tus credenciales... 🍻
      </div>
    </div>
  );
}

// 2. Exportamos la página envuelta en <Suspense>
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-amber-700 text-xl font-bold animate-pulse">
          Cargando... 🍺
        </div>
      </div>
    }>
      <CallbackLogic />
    </Suspense>
  );
}