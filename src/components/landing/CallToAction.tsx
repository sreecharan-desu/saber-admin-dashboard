import { MaskContainer } from "@/components/ui/svg-mask-effect";
import { Link } from "react-router-dom";

export default function CallToAction() {
    return (
        <section className="relative w-full bg-slate-50">
            <MaskContainer
                revealText={
                    <div className="flex flex-col items-center justify-center text-center p-6 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-600 to-slate-400">
                            Ready to <span className="text-slate-900">scale?</span>
                        </h2>
                        <p className="text-lg md:text-xl text-slate-500 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
                            Your hiring deserves a system that works as hard as you do.
                            <br />
                            <span className="text-sm font-semibold uppercase tracking-widest mt-6 flex items-center justify-center gap-2 text-slate-400">
                                <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                                Hover to reveal
                            </span>
                        </p>
                        <div className="px-6 py-3 rounded-full border border-dashed border-slate-300 text-slate-400 text-sm font-medium tracking-wide">
                            saber.co/start
                        </div>
                    </div>
                }
                className="h-[25rem] rounded-none bg-slate-50"
                revealSize={600}
            >
                <div className="flex flex-col items-center justify-center text-center p-6 h-full w-full">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tighter drop-shadow-2xl">
                        Start <span className="text-blue-300">Hiring.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
                        Join 5,000+ companies modernizing their hiring stack today.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-full font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:bg-black hover:text-white hover:scale-105 transition-all"
                    >
                        Get Started Free
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </Link>
                </div>
            </MaskContainer>
        </section>
    );
}
