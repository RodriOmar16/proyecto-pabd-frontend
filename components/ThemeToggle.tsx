"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Botón luna/sol que alterna el tema claro y oscuro, y recuerda la elección. */
export default function ThemeToggle() {
  function cambiarTema() {
    const esOscuro = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", esOscuro ? "dark" : "light");
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cambiarTema}
      aria-label="Cambiar entre tema claro y oscuro"
      title="Cambiar tema"
      className="text-muted-foreground"
    >
      {/* Luna en modo claro · Sol en modo oscuro */}
      <Moon className="size-5 dark:hidden" aria-hidden="true" />
      <Sun className="hidden size-5 dark:block" aria-hidden="true" />
    </Button>
  );
}