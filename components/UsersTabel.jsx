"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Trash2, Plus } from "lucide-react";
import UsersEditModal from "./UsersEditModal"

export default function UsersTable() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch("/api/users", { cache: "no-store" });
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data?.message || `Request failed (${res.status})`);
                }

                const data = await res.json();
                if (!alive) return;

                setUsers(Array.isArray(data.users) ? data.users : []);
            } catch (e) {
                if (!alive) return;
                setError(e.message || "Eroare");
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    const toggleExpand = (id) => setExpandedId((cur) => (cur === id ? null : id));

    const verifBadge = (label, value) => {
        if (typeof value === "string") {
            const v = value.trim();
            if (!v) return null;

            return (
                <span className="badge badge-success badge-sm">
                    {/*{label}*/}
                    {v}
                </span>
            );
        }

        if (typeof value === "boolean") {
            return (
                <span className={`badge select-none ${value ? "badge-success" : "badge-error"} badge-sm`}>
                    {/*{label}*/}
                    {value ? "Activ" : "Inactiv"}
                </span>
            );
        }
        return null;
    };

    const onEdit = (u) => console.log("edit user:", u._id);
    const onDelete = (u) => console.log("delete user:", u._id);

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center py-10">
                <span className="loading loading-spinner loading-md"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto p-4">
            <table className="table table-zebra">
                <thead>
                <tr>
                    <th className="w-12"></th>
                    <th>Nume</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Resetare Parola</th>
                    <th>Creat</th>
                    <th className="w-12"></th>
                </tr>
                </thead>

                <tbody>
                {users.map((u) => {
                    const isOpen = expandedId === u._id;
                    const v = u.verifications || {};
                    const access = Array.isArray(u.access) ? u.access : [];

                    return (
                        <React.Fragment key={u._id}>
                            <tr>
                                <td>
                                    <button
                                        className="btn btn-ghost btn-xs tooltip"
                                        data-tip="Permisiuni"
                                        onClick={() => toggleExpand(u._id)}
                                        aria-label="expand"
                                        type="button"
                                    >
                                        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </button>
                                </td>

                                <td>{u.name || "-"}</td>
                                <td>{u.username || "-"}</td>
                                <td>{u.email || "-"}</td>

                                <td>
                                    <div className="flex flex-wrap gap-2">
                                        {verifBadge("Reset", v.resetPassword)}
                                        {verifBadge("Code", v.createPassword)}
                                    </div>
                                </td>

                                <td>{u.createdAt ? new Date(u.createdAt).toLocaleString("ro-RO") : "-"}</td>

                                <td className="text-right">
                                    <div className="inline-flex gap-2">
                                        <button
                                            className="btn btn-ghost btn-sm tooltip"
                                            data-tip="Editeaza"
                                            type="button"
                                            onClick={()=>document.getElementById('UsersEditModal').showModal()}
                                            aria-label="edit"
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        <dialog id="UsersEditModal" className="modal">
                                            <div className="modal-box max-w-2xl">
                                                <UsersEditModal user={u} />
                                            </div>
                                        </dialog>

                                        <button
                                            className="btn btn-ghost btn-sm text-error tooltip"
                                            data-tip="Sterge"
                                            type="button"
                                            onClick={() => onDelete(u)}
                                            aria-label="delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            {isOpen && (
                                <tr>
                                    <td colSpan={7}>
                                        <div className="bg-base-200 rounded-lg p-4">
                                            <p className="font-semibold mb-3">Access</p>

                                            {access.length === 0 ? (
                                                <div className="text-sm text-base-content/70">
                                                    Nu exista access setat.
                                                </div>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="table table-sm">
                                                        <thead>
                                                        <tr>
                                                            <th>Page</th>
                                                            <th>Href</th>
                                                            <th>Permissions</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {access.map((a, idx) => {
                                                            const perms = Array.isArray(a.permissions) ? a.permissions : [];
                                                            const rowKey = a._id || `${u._id}-${a.page || "p"}-${a.href || "h"}-${idx}`;

                                                            return (
                                                                <tr key={rowKey}>
                                                                    <td>{a.page || "-"}</td>
                                                                    <td>{a.href || "-"}</td>
                                                                    <td>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {perms.map((p) => (
                                                                                <span
                                                                                    key={`${rowKey}-perm-${p}`}
                                                                                    className="badge badge-outline badge-sm"
                                                                                >
                                                                                    {p}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
