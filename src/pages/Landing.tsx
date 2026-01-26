import { useRef } from "react";
import Navbar from "../components/landing/Navbar";
import VideoPlayer from "@/components/ui/video-player";

import CallToAction from "../components/landing/CallToAction";
import Footer from "../components/landing/Footer";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";
import CircularTestimonials from "@/components/ui/circular-testimonials";
import Hero from "@/components/landing/Hero";

gsap.registerPlugin(ScrollTrigger);

const developers = [
  {
    quote:
      "Architecture isn't just about code; it's about building scalable, resilient systems that can handle the future of recruitment data.",
    name: "Sree Charan Desu",
    designation: "Backend & Architecture",
    src: "/sreecharan.jpg",
    linkedin: "https://www.linkedin.com/in/sreecharan-desu/",
  },
  {
    quote:
      "We're crafting an interface that feels invisible, letting the user focus purely on the talent without distraction.",
    name: "Bhanu Prakash Alahari",
    designation: "Frontend Engineering",
    src: "/bhanu.png",
    linkedin: "https://www.linkedin.com/in/alahari-bhanu-prakash-43aa4b2b9/",
  },
  {
    quote:
      "Our recommendation engine sees potential where others see keywords, matching candidates to roles they were born for.",
    name: "Anand Velpuri",
    designation: "Recommendation Engine & App Dev",
    src: "/anand.png",
    linkedin: "https://www.linkedin.com/in/anand-velpuri/",
  },
  {
    quote:
      "Security is paramount. We ensure every piece of candidate data is encrypted and protected with industry-leading standards.",
    name: "Seeta Ram Damarla",
    designation: "Database Encryption",
    src: "/seetaram.jpg",
    linkedin: "https://www.linkedin.com/in/seetharamdamarla/",
  },
];

const VideoSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        videoRef.current,
        {
          scale: 0.9,
          opacity: 0,
          y: 50,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "center center",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="w-full px-4 py-24 flex justify-center">
      <div
        ref={videoRef}
        className="w-full max-w-[1400px] will-change-transform"
      >
        <VideoPlayer
          src="https://res.cloudinary.com/dy2fjgt46/video/upload/v1769352347/videoplayback_m5ujxf.mp4"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default function Landing() {
  const developersSectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        developersSectionRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: {
            trigger: developersSectionRef.current,
            start: "top 70%",
            end: "center center",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: developersSectionRef },
  );

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <Hero />
      <VideoSection />
      <div className="w-full px-4">
        <FeaturesSectionWithHoverEffects />
      </div>

      {/* Developers Section */}
      <section
        ref={developersSectionRef}
        className="py-24 bg-white relative will-change-transform"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-neutral-900 to-neutral-500 mb-4">
              Meet the Developers
            </h2>
            <p className="text-neutral-600 text-lg">
              The minds behind the future of hiring.
            </p>
          </div>

          <div className="flex justify-center">
            <CircularTestimonials
              testimonials={developers}
              autoplay={true}
              colors={{
                name: "#171717",
                designation: "#525252",
                testimony: "#404040",
                arrowBackground: "#e5e5e5",
                arrowForeground: "#171717",
                arrowHoverBackground: "#3b82f6",
              }}
              fontSizes={{
                name: "28px",
                designation: "20px",
                quote: "20px",
              }}
            />
          </div>
        </div>
      </section>

      <CallToAction />
      <Footer />
    </div>
  );
}
