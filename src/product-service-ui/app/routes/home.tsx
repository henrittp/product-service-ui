import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Conduit" },
    { name: "description", content: "Welcome to Conduit!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
