import UsersTable from "@/components/UsersTable";
import UsersAddButton from "@/components/UsersAddButton";

export default async function DashboardUsers() {
    return (
        <main className="flex flex-col h-full w-full p-4">

            <section className="flex-1 w-full overflow-y-auto">
                <UsersTable />
            </section>

            <UsersAddButton />
        </main>
    );
}
