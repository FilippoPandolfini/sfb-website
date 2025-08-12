import React from 'react';
import GlassPanel from './glassism/glass-panel';
import { GlassCard } from './glassism/glass-card';
import "@/app/page.css";

export default function AboutSection() {
  const stats = [
    { number: '50+', label: 'Certifications' },
    { number: '42', label: 'Projects' },
    { number: '16', label: 'Partnerships' },
    { number: '100%', label: 'Client Satisfaction' },
  ];

  return (
    <GlassPanel blur={10} glassColor="rgba(0, 0, 0, 0)" borderRadius={0} className="about-glasspanel">
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-header">
            <h2>About Us</h2>
            <p>Empowering Businesses Through Innovative IT Solutions</p>
          </div>

          <div className="about-panels">
            <GlassPanel height={400} blur={20} className="about-panel">
              <div className="about-panel-content">
                <h3>Our Mission</h3>
                <p>
                  At SFB, we are dedicated to helping organizations transform and thrive in today's
                  fast-paced digital landscape. We've brought together a team of seasoned technology
                  professionals who share a passion for open-source collaboration and a commitment to
                  driving meaningful results.
                </p>
              </div>
            </GlassPanel>

            <GlassCard height={400} blur={20} className="about-panel">
              <div className="about-panel-content">
                <h3>Our Approach</h3>
                <ul>
                  <li>✓ Leverage open-source technologies for robust solutions</li>
                  <li>✓ Partner closely with clients for custom strategies</li>
                  <li>✓ Foster continuous learning and community sharing</li>
                  <li>✓ Drive measurable growth through innovation</li>
                </ul>
              </div>
            </GlassCard>
          </div>

          <div className="about-stats">
            {stats.map((stat, index) => (
              <GlassCard
                key={index}
                height={150}
                blur={15}
                glassColor="rgba(68,136,255,0.05)"
                className="about-stat-card"
              >
                <div className="about-stat-content">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </GlassPanel>
  );
}
