"use client";

import { Moon, Sun } from "lucide-react";

/** Botón luna/sol que alterna el tema claro y oscuro, y recuerda la elección. */
export default function ThemeToggle() {
  function cambiarTema() {
    const esOscuro = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", esOscuro ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={cambiarTema}
      aria-label="Cambiar entre tema claro y oscuro"
      title="Cambiar tema"
      className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
    >
      {/* Luna: se ve en modo claro (pasa a oscuro) · Sol: se ve en modo oscuro (pasa a claro) */}
      <Moon className="h-5 w-5 dark:hidden" aria-hidden="true" />
      <Sun className="hidden h-5 w-5 dark:block" aria-hidden="true" />
    </button>
  );
}