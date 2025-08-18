import React from "react";
import ServiceSection, { ServiceSectionProps } from "./services-section";

interface ServiceSectionListProps {
  services: ServiceSectionProps[];
}

const ServiceSectionList: React.FC<ServiceSectionListProps> = ({ services }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {services.map((service, i) => (
        <ServiceSection
          key={i}
          title={service.title}
          description={service.description}
          icon={service.icon}
        />
      ))}
    </div>
  );
};

export default ServiceSectionList;
