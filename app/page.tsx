import Image from "next/image";
import { LoginForm } from "./Component/loginform";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-3 ">
      <LoginForm />
    </main>
  );
}
