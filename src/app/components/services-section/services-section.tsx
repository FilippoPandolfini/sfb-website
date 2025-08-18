import React from "react";
import Image from "next/image";
import GlassPanel from "../glassism/glass-panel";
import { GlassCard } from "../glassism/glass-card";
import { GlassButton } from "../glassism/glass-button";

export interface ServiceSectionProps {
  title: string;
  description: string[];
  icon: string;
}

const ServiceSection: React.FC<ServiceSectionProps> = ({ icon, title, description }) => (
  <GlassCard
    height={380}
    blur={20}
    style={{
      maxWidth: "380px",
      minWidth: "300px",
      borderRadius: "24px",
      transition: "transform 0.3s ease, border-color 0.3s ease",
    }}
  >
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className="services-icon" style={{ fontSize: "64px", marginBottom: "20px", position: "relative" }}>
        <GlassPanel
          style={{ padding: "0", position: "absolute", width: "100%", height: "100%" }}
          blur={0.4}
          glassColor="rgba(0, 6, 92, 0.25)"
        />
        <Image
          src={icon}
          alt={title}
          width={300}
          height={300}
          style={{
            opacity: "0.7",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.1)",
            transition: "border-color 0.3s ease",
          }}
        />
      </div>

      <h3
      className="services-title"
        style={{
          fontSize: "28px",
          marginBottom: "20px",
          color: "white",
          textShadow: "0 4px 20px rgba(0, 0, 0, 1)",
        }}
      >
        {title}
      </h3>

      {description.map((line, i) => (
        <p
          key={i}
          className="services-description"
          style={{
            fontSize: "16px",
            lineHeight: 1.7,
            marginBottom: "30px",
            color: "rgba(255,255,255,1)",
            textShadow: "0 4px 20px rgba(0, 0, 0, 1)",
          }}
        >
          {line}
        </p>
      ))}

      <GlassButton
        variant="primary"
        blur={100}
        width={140}
        glassColor="rgba(0, 16, 156, 0.1)"
      >
        Learn More
      </GlassButton>
    </div>
  </GlassCard>
);

export default ServiceSection;
