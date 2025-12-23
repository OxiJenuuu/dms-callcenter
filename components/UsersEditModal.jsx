"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const makeId = () =>
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const normalizeAccess = (user) =>
    (Array.isArray(user?.access) ? user.access : []).map((a) => ({
        ...a,
        _localId: makeId(),
        permissions: Array.isArray(a?.permissions) ? a.permissions : [],
        permissionsText: Array.isArray(a?.permissions) ? a.permissions.join(", ") : "",
    }));

export default function UsersEditModal({ user }) {
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [name, setName] = useState(user?.name || "");

    const [access, setAccess] = useState(() => normalizeAccess(user));

    const [verifications, setVerifications] = useState(
        user?.verifications || { resetPassword: false }
    );

    useEffect(() => {
        setUsername(user?.username || "");
        setEmail(user?.email || "");
        setName(user?.name || "");
        setAccess(normalizeAccess(user));
        setVerifications(user?.verifications || { resetPassword: false });
    }, [user]);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function handleAddPage(e) {
        e.preventDefault();

        const newPage = {
            _localId: makeId(),
            page: "newpage",
            href: "/dashboard/newpage",
            tooltip: "New page",
            permissions: ["page.view"],
            permissionsText: "page.view",
        };

        setAccess((prev) => [...prev, newPage]);
    }

    function parsePermissions(raw) {
        return String(raw || "")
            .split(",")
            .map((p) => p.trim().toLowerCase())
            .filter(Boolean);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (saving) return;

        setSaving(true);
        setError("");

        const accessClean = access.map(({ _localId, permissionsText, ...rest }) => ({
            ...rest,
            permissions: parsePermissions(permissionsText),
        }));

        const newUser = {
            id: user._id,
            name,
            username,
            email,
            access: accessClean,
            verifications,
        };

        try {
            const res = await fetch("/api/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
                body: JSON.stringify(newUser),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(data?.message || `Eroare (${res.status})`);
                return;
            } else {
                document.getElementById("CloseUserEditModal")?.click();
            }
        } catch (err) {
            setError(err?.message || "Eroare la salvare");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex flex-col items-center text-start w-full max-h-92 h-full">
            <form method="dialog">
                <button id="CloseUserEditModal" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-start text-start">
                    <p className="text-xs">{user._id}</p>

                    {error ? (
                        <p className="text-xs text-error mt-2">{error}</p>
                    ) : null}
                </div>

                <div className="divider"></div>

                <div>
                    <div className="items-center text-start grid grid-cols-2 gap-2">
                        <input
                            className="input bg-base-300 focus:outline-none focus:ring-0"
                            type="text"
                            placeholder={name}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={saving}
                        />

                        <input
                            className="input bg-base-300 focus:outline-none focus:ring-0"
                            type="text"
                            placeholder={username}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={saving}
                        />

                        <input
                            className="input bg-base-300 focus:outline-none focus:ring-0"
                            type="email"
                            placeholder={email}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={saving}
                        />

                        <div className="flex flex-row items-start text-start justify-between w-full px-2 py-2 gap-4">
                            <p>Resetarea de parola</p>
                            <input
                                type="checkbox"
                                checked={!!verifications.resetPassword}
                                onChange={(e) =>
                                    setVerifications((prev) => ({
                                        ...prev,
                                        resetPassword: e.target.checked,
                                    }))
                                }
                                className="toggle bg-neutral checked:bg-success"
                                disabled={saving}
                            />
                        </div>
                    </div>
                </div>

                <div className="divider"></div>

                <div className="flex flex-col items-start text-start gap-4">
                    <div className="flex w-full flex-row justify-between">
                        <p className="text-md font-semibold">Pagini & Permisiuni</p>

                        <button
                            type="button"
                            onClick={handleAddPage}
                            className="hover:cursor-pointer hover:opacity-90 tooltip"
                            data-tip="Adauga pagina noua"
                            disabled={saving}
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        {access.map((a, idx) => (
                            <div key={a._localId} className="flex flex-col p-3 bg-base-300 rounded-md gap-4">
                                <div className="flex flex-row justify-between">
                                    <p className="text-lg font-bold capitalize">{a.page}</p>

                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-xs text-error"
                                        onClick={() =>
                                            setAccess((prev) => prev.filter((_, i) => i !== idx))
                                        }
                                        title="Sterge pagina"
                                        disabled={saving}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="items-center text-start grid grid-cols-2 gap-2">
                                    <input
                                        className="input bg-base-300 focus:outline-none focus:ring-0"
                                        type="text"
                                        value={a.page || ""}
                                        onChange={(e) =>
                                            setAccess((prev) =>
                                                prev.map((item, i) =>
                                                    i === idx ? { ...item, page: e.target.value } : item
                                                )
                                            )
                                        }
                                        disabled={saving}
                                    />

                                    <input
                                        className="input bg-base-300 focus:outline-none focus:ring-0"
                                        type="text"
                                        value={a.href || ""}
                                        onChange={(e) =>
                                            setAccess((prev) =>
                                                prev.map((item, i) =>
                                                    i === idx ? { ...item, href: e.target.value } : item
                                                )
                                            )
                                        }
                                        disabled={saving}
                                    />

                                    <input
                                        className="input bg-base-300 focus:outline-none focus:ring-0"
                                        type="text"
                                        value={a.tooltip || ""}
                                        onChange={(e) =>
                                            setAccess((prev) =>
                                                prev.map((item, i) =>
                                                    i === idx ? { ...item, tooltip: e.target.value } : item
                                                )
                                            )
                                        }
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        className="input bg-base-300 focus:outline-none focus:ring-0 w-full"
                                        value={a.permissionsText ?? ""}
                                        placeholder={a.permissionsText ?? ""}
                                        onChange={(e) => {
                                            const raw = e.target.value;
                                            setAccess((prev) =>
                                                prev.map((item, i) =>
                                                    i === idx
                                                        ? { ...item, permissionsText: raw }
                                                        : item
                                                )
                                            );
                                        }}
                                        onBlur={() => {
                                            setAccess((prev) =>
                                                prev.map((item, i) => {
                                                    if (i !== idx) return item;
                                                    const perms = parsePermissions(item.permissionsText);
                                                    return {
                                                        ...item,
                                                        permissions: perms,
                                                        permissionsText: perms.join(", "),
                                                    };
                                                })
                                            );
                                        }}
                                        disabled={saving}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="flex flex-col items-center justify-center w-full p-4">
                            <button
                                type="submit"
                                className="btn btn-md btn-success w-full"
                                disabled={saving}
                            >
                                {saving ? "Se salveaza..." : "Salveaza"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
