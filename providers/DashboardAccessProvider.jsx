"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const clean = (v = "") => {
    const s = String(v || "").trim();
    const withSlash = s.startsWith("/") ? s : `/${s}`;
    const collapsed = withSlash.replace(/\/+/g, "/");
    return collapsed.length > 1 ? collapsed.replace(/\/$/, "") : "/";
};

const getPerms = (p) => {
    if (Array.isArray(p)) return p;
    if (typeof p === "string") return [p];
    return [];
};

export default function DashboardAccessProvider({ children }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    const [allowed, setAllowed] = useState(false);
    const [ready, setReady] = useState(false);

    const cur = useMemo(() => clean(pathname), [pathname]);
    const accessList = useMemo(() => session?.user?.access || [], [session]);

    const decision = useMemo(() => {
        if (!cur.startsWith("/dashboard")) return { ok: true, reason: "outside" };

        if (!session?.user) return { ok: false, reason: "no-session" };

        const matches = accessList
            .map((a) => ({
                href: clean(a?.href || ""),
                perms: getPerms(a?.permissions),
            }))
            .filter((a) => cur === a.href || cur.startsWith(a.href + "/"))
            .sort((a, b) => b.href.length - a.href.length);

        if (matches.length === 0) return { ok: false, reason: "no-rule" };

        const best = matches[0];
        const ok = best.perms.includes("page.view");
        return { ok, reason: ok ? "allowed" : "missing-page.view" };
    }, [cur, session, accessList]);

    useEffect(() => {
        if (status === "loading") return;

        setAllowed(decision.ok);
        setReady(true);

        if (!decision.ok && cur.startsWith("/dashboard")) {
            router.replace("/403");
        }
    }, [status, decision, cur, router]);

    if (!ready) return null;
    if (!allowed) return null;

    return children;
}
