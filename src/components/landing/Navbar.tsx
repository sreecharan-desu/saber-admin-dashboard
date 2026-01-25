import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function Navbar() {
    const [isVisible, setIsVisible] = useState(true);
    const { scrollY } = useScroll();
    const lastScrollY = useRef(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = lastScrollY.current;
        if (latest > previous && latest > 50) {
            // Scrolling Down -> Hide
            setIsVisible(false);
        } else if (latest < previous) {
            // Scrolling Up -> Show
            setIsVisible(true);
        }
        lastScrollY.current = latest;
    });

    return (
        <motion.nav
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: -100, opacity: 0 },
            }}
            animate={isVisible ? "visible" : "hidden"}
            transition={{ duration: 0.3 }}
            className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
        >
            <div className="w-full max-w-5xl bg-white/70 backdrop-blur-xl border border-neutral-200 rounded-full px-6 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-18 h-8 flex items-center justify-center">
                        <img src="/logo.png" className="w-20" alt="logo" />
                    </div>
                    <span className="text-xl font-bold tracking-tight -ml-3 font-outfit text-black">SABER</span>
                </div>

                <div className="flex items-center">
                    <Link
                        to="/login"
                        className="px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-all active:scale-95 flex items-center gap-2"
                    >
                        Get Started <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
