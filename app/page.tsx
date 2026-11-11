import { redirect } from "next/navigation";

// La página de inicio no tiene contenido propio: lleva directo a Clientes
export default function Home() {
  redirect("/customers");
}