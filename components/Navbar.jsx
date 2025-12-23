"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

import { LayoutDashboard, Logs, MapPlus,
    UserStar, Book, CircleQuestionMark } from "lucide-react";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    const icons = {
        dashboard: LayoutDashboard,
        logs: Logs,
        users: UserStar,
        permissions: Book,
        locations: MapPlus,
    };

    const accessList = session.user.access || [];

    const dashboard = accessList.find((a) => a.page === "dashboard");
    const rest = accessList.filter((a) => a.page !== "dashboard");

    function NavItem({ access }) {
        const Icon = icons[access.page] || CircleQuestionMark;

        const clean = (v = "") =>
            `/${v}`.replace(/\/+/g, "/").replace(/\/$/, "") || "/";

        const cur = clean(pathname);
        const target = clean(access.href);

        const isActive =
            cur === target ||
            (target !== "/dashboard" && cur.startsWith(target + "/"));

        return (
            <Link
                href={access.href}
                title={access.tooltip}
                data-tip={access.tooltip}
                className={`p-4 transition-colors tooltip tooltip-right ${
                    isActive ? "bg-base-300" : "hover:bg-base-300"
                }`}
            >
                <Icon />
            </Link>
        );
    }

    return (
        <nav className="flex flex-col w-14 items-center justify-between">
            <div className="flex flex-col items-center p-6">
                {dashboard && <NavItem access={dashboard} />}

                {rest.map((access) => (
                    <NavItem key={access.page} access={access} />
                ))}
            </div>

            <div className="flex flex-col items-center">
                <LogoutButton />
            </div>
        </nav>
    );
}
