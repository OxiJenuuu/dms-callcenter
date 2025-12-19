"use client";

import { useMemo, useState } from "react";
import {
    Search,
    Info,
    Copy,
    Check,
    X,
    Plus,
    RotateCcw,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

export default function PermissionList() {
    const permissions = [
        // PAGE
        { name: "page.view", type: "page", description: "Poate vizualiza pagina respectiva", recommendation: "/*" },

        // USER
        { name: "user.view", type: "user", description: "Poate vizualiza lista cu utilizatori", recommendation: "/dashboard/users" },
        { name: "user.modify", type: "user", description: "Poate modifica datele unui utilizator si permisiunile acestuia", recommendation: "/dashboard/users" },
        { name: "user.delete", type: "user", description: "Poate sterge utilizatorul", recommendation: "/dashboard/users" },
        { name: "user.add", type: "user", description: "Poate adauga utilizatori noi", recommendation: "/dashboard/users" },

        // APP
        { name: "app.restart", type: "app", description: "Poate da restart la platforma", recommendation: "/dashboard/app" },
        { name: "app.stop", type: "app", description: "Poate opri platforma", recommendation: "/dashboard/app" },
        { name: "app.clean", type: "app", description: "Backup la database si golire datele ( utilizatorii si permisiunile sunt excluse )", recommendation: "/dashboard/app" },
        { name: "app.logs", type: "app", description: "Poate verifica istoricu aplicatiei", recommendation: "/dashboard/app" },
    ];

    const [query, setQuery] = useState("");
    const [copied, setCopied] = useState("");
    const [showTip, setShowTip] = useState(true);

    const [selected, setSelected] = useState([]);
    const [builderCopied, setBuilderCopied] = useState(false);
    const [showBuilder, setShowBuilder] = useState(true);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return permissions;

        return permissions.filter((p) => {
            const hay = `${p.name} ${p.type} ${p.description}`.toLowerCase();
            return hay.includes(q);
        });
    }, [query]);

    const grouped = useMemo(() => {
        return filtered.reduce((acc, p) => {
            acc[p.type] = acc[p.type] || [];
            acc[p.type].push(p);
            return acc;
        }, {});
    }, [filtered]);

    const countTotal = permissions.length;
    const countShown = filtered.length;

    const builderString = useMemo(() => selected.join(", "), [selected]);

    function copy(text) {
        navigator.clipboard?.writeText(text).catch(() => {});
        setCopied(text);
        setTimeout(() => setCopied(""), 1200);
    }

    function removeFromBuilder(name) {
        setSelected((prev) => prev.filter((x) => x !== name));
    }

    function toggleBuilder(name) {
        setSelected((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
    }

    function resetBuilder() {
        setSelected([]);
        setBuilderCopied(false);
    }

    function copyBuilder() {
        if (!builderString) return;
        navigator.clipboard?.writeText(builderString).catch(() => {});
        setBuilderCopied(true);
        setTimeout(() => setBuilderCopied(false), 1200);
    }

    return (
        <main className="flex flex-col h-full w-full p-4 overflow-y-auto gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">Permission Docs</h2>
                        <div className="badge badge-neutral">{countShown}/{countTotal}</div>
                    </div>
                    <p className="text-sm opacity-70">
                        Lista completa a permisiunilor disponibile in sistem si ce controleaza fiecare.
                    </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="flex items-center gap-2 w-full sm:w-80 px-3 py-2 rounded-xl bg-base-200/70 focus-within:bg-base-200 transition">
                        <Search className="h-4 w-4 opacity-70" />
                        <input
                            className="w-full bg-transparent text-sm outline-none border-0 focus:outline-none focus:ring-0 focus:border-0"
                            placeholder="Cauta permisiune (ex: user.modify)"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query ? (
                            <button type="button" className="btn btn-ghost btn-xs" onClick={() => setQuery("")}>
                                <X className="h-4 w-4" />
                            </button>
                        ) : null}
                    </label>
                </div>
            </div>

            {/* TIP */}
            {showTip ? (
                <div className="alert bg-info/60 shadow-sm">
                    <Info className="h-5 w-5 opacity-80" />
                    <div>
                        <div className="font-semibold">Tip</div>
                        <div className="text-sm opacity-80">
                            In lista: copy iti copiaza permisiunea. Adauga iti pune permisiunea in Creare de permisiuni.
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setShowTip(false)}
                        title="Ascunde tip"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div className="flex justify-end">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowTip(true)}>
                        <Info className="h-4 w-4" />
                        Arata tip
                    </button>
                </div>
            )}

            {/* BUILDER TOGGLE + CARD */}
            <div className="card bg-base-100 shadow-sm">
                <div className="card-body gap-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                            <h3 className="card-title">Creare de permisiuni</h3>
                            <p className="text-sm opacity-70">
                                Selectezi permisiuni din lista si iti construiesti rapid string-ul.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="badge badge-ghost">{selected.length} selectate</div>

                            <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                onClick={() => setShowBuilder((v) => !v)}
                                title={showBuilder ? "Ascunde" : "Afiseaza"}
                            >
                                {showBuilder ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {showBuilder ? (
                        <>
                            <div className="flex items-center justify-between gap-2">
                                <div className="text-sm opacity-70">
                                    Click pe un badge ca sa il scoti.
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-ghost btn-sm"
                                    onClick={resetBuilder}
                                    disabled={!selected.length}
                                    title="Reset"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Reset
                                </button>
                            </div>

                            <div className="rounded-2xl bg-base-200/60 p-3">
                                {selected.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {selected.map((name) => (
                                            <button
                                                key={name}
                                                type="button"
                                                onClick={() => removeFromBuilder(name)}
                                                className="badge badge-neutral gap-1 py-3 cursor-pointer"
                                                title="Scoate"
                                            >
                                                {name}
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm opacity-70">Nimic selectat inca.</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-sm opacity-70 break-words">
                                    <span className="font-semibold opacity-80">String:</span>{" "}
                                    <span className="font-mono">{builderString || "-"}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        className={`btn btn-sm ${builderCopied ? "btn-success" : "btn-neutral"}`}
                                        onClick={copyBuilder}
                                        disabled={!builderString}
                                    >
                                        {builderCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        {builderCopied ? "Copiat" : "Copy string"}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>

            {/* LISTA */}
            {Object.keys(grouped).length === 0 ? (
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <h3 className="card-title">Nimic gasit</h3>
                        <p className="opacity-70">Incearca alt cuvant cheie.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {Object.entries(grouped).map(([type, perms]) => (
                        <div key={type} className="card bg-base-100 shadow-sm">
                            <div className="card-body gap-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1">
                                        <h3 className="card-title capitalize">({perms.length}) {type}</h3>
                                    </div>
                                    <div className="badge badge-ghost">{type}</div>
                                </div>

                                <div className="space-y-2">
                                    {perms.map((perm) => {
                                        const isCopied = copied === perm.name;
                                        const isSelected = selected.includes(perm.name);

                                        return (
                                            <div key={perm.name} className="rounded-2xl bg-base-200/60 hover:bg-base-200 transition p-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <code className="font-mono text-sm font-semibold">
                                                                {perm.name}
                                                            </code>

                                                            {isCopied ? (
                                                                <span className="inline-flex items-center gap-1 badge badge-success badge-sm">
                                                                    <Check className="h-3.5 w-3.5" />
                                                                    copiat
                                                                </span>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => copy(perm.name)}
                                                                    className="inline-flex items-center gap-1 badge badge-ghost badge-sm opacity-70 hover:opacity-100"
                                                                    title="Copy permisiune"
                                                                >
                                                                    <Copy className="h-3.5 w-3.5" />
                                                                    copy
                                                                </button>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() => toggleBuilder(perm.name)}
                                                                className={`inline-flex items-center gap-1 badge badge-sm ${isSelected ? "badge-success" : "badge-neutral"} cursor-pointer`}
                                                                title={isSelected ? "Scoate din creare" : "Adauga in creare"}
                                                            >
                                                                <Plus className="h-3.5 w-3.5" />
                                                                {isSelected ? "adaugat" : "adauga"}
                                                            </button>

                                                            {perm.recommendation ? (
                                                                <span className="badge badge-outline badge-sm opacity-80">
                                                                    {perm.recommendation}
                                                                </span>
                                                            ) : null}
                                                        </div>

                                                        <p className="text-sm opacity-70">
                                                            {perm.description}
                                                        </p>
                                                    </div>

                                                    <span className="badge badge-neutral badge-sm">
                                                        {perm.type}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}