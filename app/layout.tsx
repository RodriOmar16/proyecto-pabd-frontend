import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Northwind APP",
  description: "ABM de las tablas de Northwind – PABD UNSa",
};

// Se ejecuta antes de pintar la página: aplica el tema guardado (o el del sistema)
// para que no se vea un "parpadeo" de tema claro al cargar en modo oscuro.
const scriptTema = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <TooltipProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
        </TooltipProvider>
      </body>
    </html>
  );
}