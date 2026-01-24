import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_50%)] pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-gray-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    Recruitment Intelligence Platform v2.0
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 font-outfit animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 max-w-4xl mx-auto leading-[1.1]">
                    Unleash the Future of <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-white">Elite Hiring</span>.
                </h1>

                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    Automate specific workflows, discover top-tier talent with AI signals, and manage your pipeline with military-grade precision.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <Link
                        to="/login"
                        className="h-14 px-8 rounded-full bg-white text-black font-bold text-lg flex items-center gap-3 transition-all hover:bg-gray-200 hover:shadow-xl hover:shadow-white/10 hover:-translate-y-1 active:scale-95"
                    >
                        Start Hiring Now
                    </Link>
                    <button className="h-14 px-8 rounded-full bg-transparent text-white border border-white/20 font-bold text-lg hover:border-white/40 hover:bg-white/5 transition-all">
                        View Demo
                    </button>
                </div>
            </div>
        </section>
    );
}
