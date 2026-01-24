import { Globe, Users, BarChart3 } from "lucide-react";

export default function ProductShowcase() {
    return (
        <div className="mt-20 max-w-6xl mx-auto px-6 relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20 h-40 bottom-0 top-[auto]" />
            <div className="bg-[#0A0A0A] rounded-3xl border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="h-12 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                <div className="p-2 md:p-8 bg-black/40">
                    <img src="/dashboard-preview.png" alt="Dashboard Preview" className="w-full h-auto rounded-xl shadow-2xl border border-white/10 opacity-90" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {[
                            { icon: Users, label: "Candidate Pipeline", value: "1,240", trend: "+12%" },
                            { icon: BarChart3, label: "Active Jobs", value: "24", trend: "+4" },
                            { icon: Globe, label: "Global Reach", value: "18 Countries", trend: "Exp." }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg flex items-center gap-4 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400">{stat.label}</p>
                                    <p className="text-xl font-bold text-white">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
