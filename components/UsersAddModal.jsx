'use client';

import {useState} from "react";

export default function UsersAddModal() {
    const [user, setUser] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e){
        e.preventDefault();

        setSaving(true);
        setError("");

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
                body: JSON.stringify(user),
            });

            const data = await res.json().catch(() => ({}));

            if(!res.ok){
                setError(data?.message || `Eroare (${res.status})`);
                return;
            } else {
                document.getElementById('CloseUserAddModal')?.click()
            }
        } catch (error) {
            setError(error?.message || "Eroare la salvare");
        } finally {
            setSaving(false);
            setUser({
                username: "",
                name: "",
                email: "",
                password: "",
            })
        }
    }

    return (
        <div className="flex flex-col items-center text-start w-full max-h-92 h-full">
            <form method="dialog">
                <button id="CloseUserAddModal" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-start text-start">
                    <p className='text-xs'>Adauga utilizator</p>

                    {error ? (
                        <p className="text-xs text-error mt-2">{error}</p>
                    ) : null}
                </div>

                <div className='divider'></div>

                <div className="items-center text-start grid grid-cols-2 gap-2">
                    <input
                        className="input bg-base-300 focus:outline-none focus:ring-0"
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={user.username}
                        onChange={(e) => { setUser((prev) => ({...prev, [e.target.name] : e.target.value})) }}
                    />

                    <input
                        className="input bg-base-300 focus:outline-none focus:ring-0"
                        type="text"
                        placeholder="Nume si Prenume"
                        name="name"
                        value={user.name}
                        onChange={(e) => { setUser((prev) => ({...prev, [e.target.name] : e.target.value})) }}
                    />

                    <input
                        className="input bg-base-300 focus:outline-none focus:ring-0"
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={user.email}
                        onChange={(e) => { setUser((prev) => ({...prev, [e.target.name] : e.target.value})) }}
                    />

                    <input
                        className="input bg-base-300 focus:outline-none focus:ring-0"
                        type="password"
                        placeholder="Parola"
                        name="password"
                        value={user.password}
                        onChange={(e) => { setUser((prev) => ({...prev, [e.target.name] : e.target.value})) }}
                    />
                </div>

                <div className="flex flex-col items-center justify-center w-full p-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className={`btn btn-md ${saving ? "skeleton" : "btn-success"} w-full`}
                    >
                        {saving ? "Se salveaza..." : "Salveaza"}
                    </button>
                </div>
            </form>
        </div>
    )
}