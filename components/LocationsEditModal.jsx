'use client';

import { useEffect, useState } from "react";

const emptyForm = {
    zone: "",
    location: "",
    phone: "",
};

function formatPhone(value) {
    return Array.isArray(value) ? value.join(", ") : "";
}

function buildPhoneList(value) {
    return String(value || "")
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean);
}

export default function LocationsEditModal({ location }) {
    const [form, setForm] = useState({
        zone: location?.zone || "",
        location: location?.location || "",
        phone: formatPhone(location?.phone),
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setForm({
            zone: location?.zone || "",
            location: location?.location || "",
            phone: formatPhone(location?.phone),
        });
        setError("");
    }, [location]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (saving) return;

        setSaving(true);
        setError("");

        const payload = {
            id: location?._id,
            zone: form.zone.trim(),
            location: form.location.trim(),
            phone: buildPhoneList(form.phone),
        };

        try {
            const res = await fetch("/api/locations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(data?.message || `Eroare (${res.status})`);
                return;
            }

            document.getElementById("CloseLocationEditModal")?.click();
            setForm(emptyForm);
        } catch (err) {
            setError(err?.message || "Eroare la salvare");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex flex-col items-center text-start w-full max-h-92 h-full">
            <form method="dialog">
                <button
                    id="CloseLocationEditModal"
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                    x
                </button>
            </form>

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-start text-start">
                    <p className="text-xs">{location?._id}</p>

                    {error ? <p className="text-xs text-error mt-2">{error}</p> : null}
                </div>

                <div className="divider"></div>

                <div className="items-center text-start grid grid-cols-2 gap-2">
                    <input
                        className="input bg-base-300 focus:outline-none focus:ring-0"
                        type="text"
                        placeholder="Zona"
                        name="zone"
                        value={form.zone}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                        }
                        disabled={saving}
                    />

                    <input
                        className="input bg-base-300 focus:outline-none focus:ring-0"
                        type="text"
                        placeholder="Locatie"
                        name="location"
                        value={form.location}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                        }
                        disabled={saving}
                    />

                    <input
                        className="input bg-base-300 focus:outline-none focus:ring-0"
                        placeholder="Telefon (separa numerele cu virgula sau linie noua)"
                        name="phone"
                        value={form.phone}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                        }
                        disabled={saving}
                    />
                </div>

                <div className="flex flex-col items-center justify-center w-full p-4">
                    <button
                        type="submit"
                        className={`btn btn-md ${saving ? "skeleton" : "btn-success"} w-full`}
                        disabled={saving}
                    >
                        {saving ? "Se salveaza..." : "Salveaza"}
                    </button>
                </div>
            </form>
        </div>
    );
}
