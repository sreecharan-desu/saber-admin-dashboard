import { Shield, Zap, Lock } from "lucide-react";

export default function Features() {
    return (
        <section className="py-24 bg-black relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Top Recruiters Choose Saber</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Elevate your hiring process with tools designed for speed, accuracy, and scale.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Zap,
                            title: "Instant Sourcing",
                            desc: "AI-driven algorithms match you with the perfect candidates in milliseconds."
                        },
                        {
                            icon: Shield,
                            title: "Verified Signals",
                            desc: "Every candidate profile matches against calibrated technical benchmarks."
                        },
                        {
                            icon: Lock,
                            title: "Enterprise Security",
                            desc: "Bank-grade encryption and compliance for your sensitive hiring data."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="bg-[#0f0f0f] p-8 rounded-3xl border border-white/5 shadow-none hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-black mb-6 shadow-lg shadow-white/10 group-hover:scale-110 transition-transform">
                                <feature.icon size={28} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
