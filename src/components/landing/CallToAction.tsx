import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                <div className="bg-[#111] rounded-[40px] p-12 md:p-20 text-white border border-white/10 shadow-2xl shadow-black/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[120px] opacity-[0.03] -translate-y-1/2 translate-x-1/2 group-hover:opacity-[0.05] transition-opacity" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-[120px] opacity-[0.03] translate-y-1/2 -translate-x-1/2 group-hover:opacity-[0.05] transition-opacity" />

                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight relative z-10">Start building your dream team.</h2>
                    <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto relative z-10">Join thousands of forward-thinking companies using Saber to redefine their recruitment strategy today.</p>

                    <Link
                        to="/login"
                        className="inline-flex h-14 px-8 items-center justify-center gap-2 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all active:scale-95 relative z-10"
                    >
                        Get Started Now <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
