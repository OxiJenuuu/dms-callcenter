import LoginForm from "@/components/LoginForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen w-full flex">
        <section className="flex items-center justify-center w-full md:w-92">
            <LoginForm />
        </section>

        <section className="hidden md:flex md:flex-1 bg-base-300 items-center justify-center px-8">

            {/* EMPTY */}

        </section>

    </main>
  );
}
