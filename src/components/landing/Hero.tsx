import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import SplitText from "@/components/ui/SplitText";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10">
            {/* Background elements */}
            <div className="absolute inset-0 bg-white z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 sm:gap-20">

                    {/* Left Content */}
                    <div className="flex-1 text-left">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 2.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-sm text-blue-600 mb-8 backdrop-blur-sm shadow-sm"
                        >
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span>The Future of Recruitment is Here</span>
                        </motion.div>

                        {/* Main Heading */}
                        <div className="mb-8 min-h-[160px] md:min-h-[250px] flex flex-col items-start justify-center">
                            <SplitText
                                text="Unleash the Future of"
                                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-neutral-900"
                                delay={30}
                                duration={0.5}
                                textAlign="left"
                            />
                            <SplitText
                                text="Elite Hiring"
                                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-neutral-900 mt-2"
                                delay={30}
                                duration={0.5}
                                textAlign="left"
                                to={{ opacity: 1, y: 0, delay: 1.2 }}
                            />
                        </div>

                        {/* Subheading */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 2.3 }}
                            className="text-lg md:text-xl text-neutral-600 max-w-2xl mb-10 leading-relaxed"
                        >
                            Saber eliminates bias and focuses on what truly matters:
                            <span className="text-black font-medium"> Skills</span>.
                            Build your dream team with our AI-powered blind hiring engine.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 2.4 }}
                            className="flex flex-col sm:flex-row items-center gap-4"
                        >
                            <Link
                                to="/login"
                                className="h-12 px-8 rounded-full bg-black text-white font-semibold flex items-center gap-2 hover:bg-neutral-800 hover:scale-105 transition-all w-full sm:w-auto justify-center shadow-lg shadow-black/20"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/company"
                                className="h-12 px-8 rounded-full bg-white border border-neutral-200 text-neutral-900 font-semibold flex items-center gap-2 hover:bg-neutral-50 hover:border-neutral-300 transition-all w-full sm:w-auto justify-center shadow-sm"
                            >
                                Learn More
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Content - QR Code */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            scale: 1
                        }}
                        transition={{
                            opacity: { duration: 1, delay: 2.5 },
                            scale: { duration: 1, delay: 2.5 }
                        }}
                        className="flex-shrink-0 relative group/qr hidden lg:block"
                    >
                        {/* Decorative Blob */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-3xl" />

                        <div className="relative bg-white p-3 rounded-[32px] shadow-2xl shadow-blue-900/15 border border-neutral-100">
                            {/* Inner Container */}
                            <div className="bg-gradient-to-b from-neutral-50 to-white rounded-[24px] p-8 border border-neutral-100 flex flex-col items-center gap-6">
                                {/* Header */}
                                <div className="text-center space-y-1">
                                    <p className="font-bold text-neutral-900 text-lg">Download Saber App Now</p>
                                    <div className="h-1 w-12 bg-blue-500 mx-auto rounded-full" />
                                </div>

                                {/* QR Wrapper */}
                                <div className="bg-white p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 relative group cursor-pointer overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/0 via-transparent to-purple-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10 transition-colors duration-500 z-10" />
                                    <img
                                        src="/qr-code-new.jpg"
                                        alt="Scan to download Saber App"
                                        className="w-56 h-56 object-cover rounded-xl"
                                    />
                                </div>

                                {/* Footer Text */}
                                <div className="flex items-center gap-2 text-neutral-500 text-xs font-semibold uppercase tracking-widest">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Scan QR Code
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
