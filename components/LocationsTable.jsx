'use client';

import React, {useEffect} from "react";
import {Pencil, Trash2} from "lucide-react";
import {useState} from "react";
import LocationsEditModal from "@/components/LocationsEditModal";

export default function LocationsTable(){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    function openModal(location){
        setSelectedLocation(location);
        document.getElementById(`LocationsEditModal`).showModal();
    }

    async function deleteLocation(locationID){
        setError("");

        try {
            const res = await fetch(`/api/locations`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: locationID })
            })

            if(!res.ok){
                setError(data?.message || `Eroare (${res.status})`);
                return;
            }
        } catch (error) {
            setError(error?.message || `Eroare la stergerea datelor`);
        }
    }

    useEffect(() => {
        (async () => {
            setError("");
            try {
                const res = await fetch('/api/locations');
                const data = await res.json().catch(() => ({}))

                if(!res.ok){
                    setError(data?.message || `Eroare (${res.status})`)
                }else{
                    setLocations(data?.locations)
                }

            } catch (error) {
                setError(error?.message || `Eroare la preluarea datelor`);
            } finally {
                setLoading(false);
            }
        })()
    }, [])

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredUsers = locations
        .filter((location) => {
            if (!normalizedSearch) return true;
            const haystack = [
                location.zone,
                location._id,
                location.location,
                location.phone
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return haystack.includes(normalizedSearch);
        })
        .sort((a, b) => {
            return (a.zone || "").localeCompare(b.zone || "", "ro", {
                sensitivity: "base"
            });
        });

    if(loading){
        return (
            <div className="w-full h-full skeleton flex items-center justify-center">
                <span className="loading loading-spinner loading-xl text-primary"></span>
            </div>
        )
    }

    return (
        <section className="overflow-x-auto p-4">

            {error && (
                <div className="w-full h-8 flex items-center justify-center bg-error rounded-md mb-4">
                    <p className="font-bold">{error}</p>
                </div>
            )}

            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <input
                    type="search"
                    className="input bg-base-300 focus:outline-none focus:ring-0"
                    placeholder="Cauta dupa zona, locatie, telefon, ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="table">
                    <thead>

                    <tr>
                        <th>crt.</th>
                        <th>DATABASE ID</th>
                        <th>Zona</th>
                        <th>Locatie</th>
                        <th>Contact</th>
                        <th className="select-none">Actiuni</th>
                    </tr>

                    </thead>
                    <tbody>
                    {filteredUsers.map((location, index) => (
                        <tr key={location._id}>
                            <th>{index + 1}</th>
                            <td>{location._id}</td>
                            <td>{location.zone}</td>
                            <td>{location.location}</td>
                            <td>
                                {location.phone.map((number) => (
                                    <a
                                        className='tooltip mr-2'
                                        href={`tel:+4${number}`}
                                        data-tip={`Apeleaza ${number}`}
                                        key={number}>
                                        {number}
                                    </a>
                                ))}
                            </td>
                            <th className="flex items-center gap-2 select-none">
                                <button
                                    onClick={() => openModal(location)}
                                    className="tooltip hover:text-info hover:cursor-pointer" data-tip="Editeaza">
                                    <Pencil size={16}/>
                                </button>
                                <button
                                    onClick={() => deleteLocation(location._id)}
                                    className="tooltip hover:text-error hover:cursor-pointer" data-tip="Sterge">
                                    <Trash2 size={16}/>
                                </button>
                            </th>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <dialog id={`LocationsEditModal`} className="modal">
                <div className="modal-box max-w-2xl">
                    {selectedLocation && <LocationsEditModal location={selectedLocation}/>}
                </div>
            </dialog>
        </section>
    )
}
