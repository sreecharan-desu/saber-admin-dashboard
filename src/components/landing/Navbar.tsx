import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg shadow-white/5">
                        <img src="/saber-logo.png" className="w-full h-full object-contain" alt="Saber" />
                    </div>
                    <span className="text-xl font-bold Tracking-tight font-outfit text-white">SABER</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        to="/login"
                        className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/10 flex items-center gap-2"
                    >
                        Get Started <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
