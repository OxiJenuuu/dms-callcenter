'use client';

import React, {useEffect, useState} from "react";
import { Pencil, Trash2 } from "lucide-react";
import UsersEditModal from "@/components/UsersEditModal";

export default function UsersTable(){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    function openModal(user){
        setSelectedUser(user);
        document.getElementById(`UsersEditModal`).showModal();
    }

    async function deleteUser(userID){
        setError("");

        try {
            const res = await fetch(`/api/users`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: userID }),
            });
            const data = await res.json().catch(() => ({}));

            if(!res.ok){
                setError(data?.message || `Eroare (${res.status})`);
                return;
            }
            // else{
            //     setUsers(data.users);
            // }
        } catch (error) {
            setError(error?.message || `Eroare la stergerea datelor`);
        }
    }

    useEffect(()=>{
        (async () => {
            setError("");
            try {
                const res = await fetch("/api/users");
                const data = await res.json().catch(() => ({}));

                if(!res.ok){
                    setError(data?.message || `Eroare (${res.status})`);
                    return;
                }else{
                    setUsers(data?.users);
                }
            } catch (error){
                setError(error?.message || `Eroare la preluarea datelor`);
            } finally {
                setLoading(false);
            }
        })()
    }, [])

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredUsers = users.filter((user) => {
        if (!normalizedSearch) return true;
        const haystack = [user._id, user.name, user.username, user.email]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
        return haystack.includes(normalizedSearch);
    });

    if(loading){
        return (
            <div className="w-full h-full skeleton flex items-center justify-center mb-4">
                <span className="loading loading-spinner loading-xl text-primary"></span>
            </div>
        )
    }

    return(
        <section className="overflow-x-auto p-4">

            {error && (
                <div className="w-full h-8 flex items-center justify-center bg-error rounded-md">
                    <p className="font-bold">{error}</p>
                </div>
            )}

            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <input
                    type="search"
                    className="input bg-base-300 focus:outline-none focus:ring-0"
                    placeholder="Cauta dupa nume, username, email, ID"
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
                        <th>Nume Prenume</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Telefon</th>
                        <th>Creat</th>
                        <th>Resetare Parola</th>
                        <th>Login</th>
                        <th>IP Addr</th>
                        <th className="select-none">Actiuni</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map((user, index) => (
                            <tr key={user._id} className="hover:opacity-90">
                                <th>{index + 1}</th>
                                <th>{user._id}</th>
                                <th>{user.name}</th>
                                <th>{user.username}</th>
                                <th><a href={`mailto:${user.email}`} className="hover:cursor-pointer tooltip" data-tip='Trimite mail'>{user.email}</a></th>
                                <th>soon</th>
                                <th>{new Date(user.createdAt).toLocaleDateString('ro-RO')}</th>
                                <th>
                                    <button className={user.verifications.createPassword === "" ? "" : "hover:cursor-pointer hover:text-success tooltip"}
                                            data-tip="Copieaza link">
                                        {user.verifications.createPassword}
                                    </button>
                                </th>
                                <th>soon</th>
                                <th>soon</th>
                                <th className="flex items-center gap-2 select-none">
                                    <button
                                        onClick={() => openModal(user)}
                                        className="tooltip hover:text-info hover:cursor-pointer" data-tip="Editeaza">
                                        <Pencil size={16}/>
                                    </button>

                                    <button
                                        onClick={() => deleteUser(user._id)}
                                        className="tooltip hover:text-error hover:cursor-pointer" data-tip="Sterge">
                                        <Trash2 size={16}/>
                                    </button>
                                </th>
                            </tr>
                    )) }
                    </tbody>
                </table>

                <dialog id={`UsersEditModal`} className="modal">
                    <div className="modal-box max-w-2xl">
                        {selectedUser && <UsersEditModal user={selectedUser}/>}
                    </div>
                </dialog>
            </div>

        </section>
    )
}
