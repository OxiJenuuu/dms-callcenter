import LocationsTable from "@/components/LocationsTable";
import LocationsAddButton from "@/components/LocationsAddButton";

export default function LocationsPage(){
    return (
        <main className="flex flex-col h-full w-full p-4">

            <section className="flex-1 w-full overflow-y-auto">
                <LocationsTable />
            </section>

            <LocationsAddButton />
        </main>
    )
}