"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

// Cada integrante agrega acá el link de su tabla
const LINKS = [
  { href: "/customers", label: "Clientes" },
  // { href: "/products", label: "Productos" },
  // { href: "/suppliers", label: "Proveedores" },
];

export default function Navbar() {
  const pathname = usePathname(); // ruta actual, para marcar el link activo

    return (
    <header className="border-b border-border bg-card">
      {/* Franja con el degradé de la marca */}
      <div className="h-1 bg-linear-to-r from-brand-cyan to-brand-indigo" />
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <span className="font-semibold tracking-widest text-primary">NORTHWIND</span>
        <div className="flex items-center gap-2">
          <ul className="flex gap-1">
            {LINKS.map((link) => {
              const activo = pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      activo
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}