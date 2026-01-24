import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import ProductShowcase from "../components/landing/ProductShowcase";
import Features from "../components/landing/Features";
import CallToAction from "../components/landing/CallToAction";
import Footer from "../components/landing/Footer";

export default function Landing() {
    return (
        <div className="min-h-screen bg-black selection:bg-white/20 selection:text-white">
            <Navbar />
            <Hero />
            <ProductShowcase />
            <Features />
            <CallToAction />
            <Footer />
        </div>
    );
}
