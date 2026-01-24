import { Link, useLocation } from "react-router-dom";
import { Briefcase, Users, Building2, LayoutDashboard } from "lucide-react";
import clsx from "clsx";

const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Jobs",
        href: "/jobs",
        icon: Briefcase,
    },
    {
        label: "Applications",
        href: "/applications",
        icon: Users,
    },
    {
        label: "Company",
        href: "/company",
        icon: Building2,
    },
];

export function NavigationDock() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
            <nav className="flex flex-col items-center gap-3 px-3 py-4 bg-white border border-gray-100 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl">
                {navItems.map((item) => {
                    const isActive = currentPath === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={clsx(
                                "relative group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300",
                                isActive
                                    ? "bg-gray-50 text-black shadow-inner"
                                    : "text-gray-400 hover:text-black hover:bg-gray-50/50"
                            )}
                        >
                            <Icon
                                size={20}
                                strokeWidth={isActive ? 2.5 : 2}
                                className="transition-transform group-active:scale-95"
                            />

                            {/* Tooltip - Now on the Right */}
                            <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black text-white text-[10px] font-extrabold rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none uppercase tracking-[0.15em] whitespace-nowrap shadow-xl translate-x-1 group-hover:translate-x-0">
                                {item.label}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45 rounded-sm" />
                            </div>

                            {/* Active Indicator - Now on the left side */}
                            {isActive && (
                                <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-1 h-5 bg-black rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
