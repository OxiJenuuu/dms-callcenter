import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await auth();

  console.log(session)

  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Bine ai venit, {session.user.email}.
          </p>
        </div>
        <LogoutButton />
      </div>
    </main>
  );
}
