import Image from "next/image";
import { GlassButton } from "./glassism/glass-button";
import "@/app/page.css";

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
}

export default function HeroSection({ scrollToSection }: HeroSectionProps) {
  return (
    <section id="hero" className="hero">
      <div className="hero-content animate-in">
        <Image
          src="/sfbs-logo.png"
          alt="SFB"
          height={300}
          width={300}
          className="hero-logo"
        />
        <h1 className="hero-title">STRIVE FOR BETTER</h1>
        <p className="hero-subtitle">Infrastructure. Development. Security.</p>
        <div className="hero-buttons">
          <GlassButton
            variant="primary"
            blur={30}
            width={180}
            onClick={() => scrollToSection("services")}
            className="hero-button-primary"
          >
            Our Services
          </GlassButton>
          <GlassButton
            variant="ghost"
            blur={30}
            width={180}
            onClick={() => scrollToSection("contact")}
          >
            Get in Touch
          </GlassButton>
        </div>
      </div>
    </section>
  );
}
