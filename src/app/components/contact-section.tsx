import React from "react";
import GlassPanel from "./glassism/glass-panel";
import Image from "next/image";

export interface ContactSectionProps {
    icon: string;
    title: string;
    content: string[];
}

const ContactSection: React.FC<ContactSectionProps> = ({ icon, title, content }) => (
    <GlassPanel
        height={200}
        blur={15}
        glassColor="rgba(68,136,255,0.05)"
        style={{ minWidth: '380px', minHeight: '300px' }}
    >
        <div
            style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
            }}
        >
            <div style={{ fontSize: '36px', marginBottom: '15px' }}>
                <Image
                    src={icon}
                    alt={title}
                    width={64}
                    height={64}
                    style={{
                        filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 1))'
                    }}
                />
            </div>
            <h3 style={{
                fontSize: '20px',
                marginBottom: '10px',
                color: 'white',
                textShadow: '0 4px 20px rgba(0, 0, 0, 1)',
            }}>
                {title}
            </h3>
            {content.map((line, i) => (
                <p key={i} style={{
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.8)',
                    margin: '5px 0',
                }}>
                    {line}
                </p>
            ))}
        </div>
    </GlassPanel>
);

export default ContactSection;