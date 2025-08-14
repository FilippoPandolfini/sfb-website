"use client";

import { Canvas } from "@react-three/fiber";
import { useRef, useEffect, useState, JSX } from "react";
import * as THREE from "three";
import { HDRBackground } from "./aquaism/backgrounds/background-loader";
import MetaballSimulation from "./aquaism/core/metaball-simulation";
import { getPerformanceConfig } from "./aquaism/core/performance-configs";
import { GlassButton } from "./components/glassism/glass-button";
import { GlassCard } from "./components/glassism/glass-card";
import GlassPanel from "./components/glassism/glass-panel";
import { AdvancedFakeReflectionSetup } from "./aquaism/backgrounds/reflective-background";
import Image from "next/image";
import { forwardEventToCanvas } from "./components/forward-event-to-canvas";
import SocialButton from "@/app/components/social-button";
import SocialButtonList from "./components/social-button-list";
import "@/app/page.css"
import ContactSectionList from "./components/contact-section-list";

export default function Home(): JSX.Element {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const overlay: HTMLDivElement | null = overlayRef.current;
    const canvasContainer: HTMLDivElement | null = canvasContainerRef.current;
    if (!overlay || !canvasContainer) return;

    // Function to forward events to canvas    

    const eventsToForward: readonly string[] = [
      'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave',
      'pointerdown', 'pointerup', 'pointermove', 'pointerenter', 'pointerleave',
      'click', 'dblclick', 'wheel', 'contextmenu'
    ] as const;

    const handlers: Record<string, (e: Event) => void> = {};
    eventsToForward.forEach((eventType: string) => {
      handlers[eventType] = (e: Event): void => {
        const canvas = canvasContainer.querySelector('canvas');
        forwardEventToCanvas(e as MouseEvent | WheelEvent | PointerEvent, canvas);
      };
      overlay.addEventListener(eventType, handlers[eventType], { capture: true });
    });

    return (): void => {
      eventsToForward.forEach((eventType: string) => {
        overlay.removeEventListener(eventType, handlers[eventType], { capture: true });
      });
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleScroll = () => {
      const sections = ['hero', 'about', 'services', 'partners', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 2; // Use viewport center instead of fixed offset
      // Find the section that contains the center of the viewport
      let currentSection = 'hero'; // Default to hero
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const absoluteTop = window.scrollY + rect.top;
          const absoluteBottom = absoluteTop + rect.height;
          // Check if the viewport center is within this section
          if (scrollPosition >= absoluteTop && scrollPosition < absoluteBottom) {
            currentSection = section;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    // Call handleScroll immediately to set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden">
      {/* Global Styles */}
      <style jsx global>{`
        body {
          overflow-x: hidden;
        }
        text {
          textShadow: '0 4px 20px rgba(0, 0, 0, 1)'
        }
        p {
          textShadow: '0 4px 20px rgba(0, 0, 0, 1)'
        }
        section {
          width: 100%;
        }
      `}</style>

      {/* Canvas Background - Fixed Position */}
      <div ref={canvasContainerRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
            powerPreference: "high-performance",
          }}
          dpr={[1, 1.5]}
          performance={{ min: 0.5, max: 1 }}
        >
          <AdvancedFakeReflectionSetup
            reflectionImage="/hero-bg-ultra-low.jpg"
            backgroundColor={"#000000"}
            fogColor="#008cff"
            fogNear={5}
            fogFar={20}
            isFogEnabled={true}
          />
          <HDRBackground path="/hero-bg-ultra-low.jpg" format="jpg" blur={0.02} visible={false} exposure={10} intensity={10} />
          <MetaballSimulation config={getPerformanceConfig("quality")} />
        </Canvas>
      </div>
      {/* Content Overlay */}
      <div ref={overlayRef} className="relative" style={{ zIndex: 1 }}>
        {/* Header/Navigation */}
        <header style={{
          position: 'fixed',
          top: -15,
          left: -5,
          right: -5,
          zIndex: 1000,
        }}>
          <GlassPanel
            width={'100%'}
            height={'100%'}
            blur={25}
            glassColor="rgba(255, 255, 255, 0.03)"
            style={{
              paddingLeft: '2.5em',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>

            {/* Logo - Left aligned */}
            <div
              onClick={() => scrollToSection('hero')}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                marginTop: '10px',
              }}
            >
              <Image
                src="/sfbs-logo.png"
                alt="SFB Logo"
                width={100}
                height={40}
              />
            </div>

            {/* Navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '2.5em',
              gap: '30px',
              height: '100%',
              marginTop: '10px',
            }}>
              {/* Desktop Navigation */}
              <nav style={{
                display: isMobile ? 'none' : 'flex',
                gap: '30px',
                alignItems: 'center',
                height: '100%',
              }}>
                {['Home', 'About', 'Services', 'Partners', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase())}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: activeSection === (item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase()) ? '#4488ff' : 'white',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'color 0.3s ease',
                      fontWeight: activeSection === (item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase()) ? '600' : '400',
                      padding: '10px 0',
                    }}
                  >
                    {item}
                  </button>
                ))}
              </nav>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  display: isMobile ? 'block' : 'none',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '10px',
                  marginTop: '10px',
                  color: mobileMenuOpen ? '#4488ff' : 'white',
                  transition: 'color 0.3s ease',
                }}
              >
                ☰
              </button>
            </div>
            {!mobileMenuOpen && !isMobile && (
              <div style={{
                paddingRight: '20px',
                marginRight: '20px',
                marginTop: '10px',
              }}>
                <GlassButton
                  variant="secondary"
                  width={200}
                  onClick={() => window.location.href = 'mailto:amministrazione@sfbs.it'}
                >
                  Work with us
                </GlassButton>
              </div>
            )}
          </GlassPanel>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && isMobile && (
            <div style={{
              display: 'flex',
              justifyContent: 'right',
              marginRight: '10px',
            }}>
              <GlassPanel style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {['Home', 'About', 'Services', 'Partners', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase())}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      fontSize: '18px',
                      cursor: 'pointer',
                      padding: '10px',
                      textAlign: 'center',
                    }}

                  >
                    {item}
                  </button>
                ))}
                <GlassButton
                  variant="secondary"
                  width={200}
                  onClick={() => window.location.href = 'mailto:amministrazione@sfbs.it'}
                >
                  Work with us
                </GlassButton>
              </GlassPanel>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section id="hero" style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '120px 20px 80px',
        }}>
          <div className="animate-in" style={{
            textAlign: 'center',
            maxWidth: '900px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}>
            <Image
              src="/sfbs-logo.png"
              alt="SFB"
              height={300}
              width={300}
              style={{
                height: '180px',
                width: 'auto',
                filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 1))',
                paddingBottom: '40px',
                paddingTop: '20px',
              }}
            />
            <h1 style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: 'white',
              textShadow: '0 4px 20px rgba(0, 0, 0, 1)',
              lineHeight: 1.1,
            }}>
              STRIVE FOR BETTER
            </h1>
            <p style={{
              fontSize: 'clamp(18px, 2.5vw, 28px)',
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '40px',
              textShadow: '0 4px 20px rgba(0, 0, 0, 1)',
            }}>
              Infrastructure. Development. Security.
            </p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              paddingBottom: '20px',
            }}>
              <GlassButton
                variant="primary"
                blur={30}
                width={180}
                onClick={() => scrollToSection('services')}
                style={{
                  textShadow: '0 4px 20px rgba(0, 0, 0, 1)'
                }}
              >
                Our Services
              </GlassButton>
              <GlassButton
                variant="ghost"
                blur={30}
                width={180}
                onClick={() => scrollToSection('contact')}
              >
                Get in Touch
              </GlassButton>

            </div>

          </div>
        </section>

        {/* About Section */}
        <GlassPanel blur={10}
          glassColor="rgba(0, 0, 0, 0)"
          borderRadius={0}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'fit-content',
            flexDirection: 'column',
            marginLeft: '-10px',
            marginRight: '-10px',
          }}
        >

          <section id="about" style={{
            padding: '100px 20px',
            position: 'relative',
          }}>
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
            }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '60px',
              }}>
                <h2 style={{
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '20px',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 1)'
                }}>
                  About Us
                </h2>
                <p style={{
                  fontSize: '20px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  maxWidth: '800px',
                  margin: '0 auto',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 1)'
                }}>
                  Empowering Businesses Through Innovative IT Solutions
                </p>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: '60px',
                gap: '20px',
              }}>
                <GlassPanel
                  height={400}
                  blur={20}
                  style={{ width: '100%', maxWidth: '580px', minHeight: '380px' }}
                >
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <h3 style={{ fontSize: '24px', marginBottom: '20px', textShadow: '0 4px 20px rgba(0, 0, 0, 1)', color: 'white' }}>Our Mission</h3>
                    <p style={{ fontSize: '16px', lineHeight: 1.8, textShadow: '0 4px 20px rgba(0, 0, 0, 1)', color: 'rgba(255, 255, 255, 1)', textAlign: 'left' }}>
                      At SFB, we are dedicated to helping organizations transform and thrive in today&apos;s
                      fast-paced digital landscape. We&apos;ve brought together a team of seasoned technology
                      professionals who share a passion for open-source collaboration and a commitment to
                      driving meaningful results.
                    </p>
                  </div>
                </GlassPanel>

                <GlassCard
                  height={400}
                  blur={20}
                  style={{ width: '100%', maxWidth: '580px', minHeight: '380px' }}
                >
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <h3 style={{ fontSize: '24px', marginBottom: '20px', textShadow: '0 4px 20px rgba(0, 0, 0, 1)', color: 'white' }}>Our Approach</h3>
                    <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                      <li style={{ marginBottom: '15px', fontSize: '16px', lineHeight: 1.6, textShadow: '0 4px 20px rgba(0, 0, 0, 1)', color: 'rgba(255,255,255,1)' }}>
                        ✓ Leverage open-source technologies for robust solutions
                      </li>
                      <li style={{ marginBottom: '15px', fontSize: '16px', lineHeight: 1.6, textShadow: '0 4px 20px rgba(0, 0, 0, 1)', color: 'rgba(255,255,255,1)' }}>
                        ✓ Partner closely with clients for custom strategies
                      </li>
                      <li style={{ marginBottom: '15px', fontSize: '16px', lineHeight: 1.6, textShadow: '0 4px 20px rgba(0, 0, 0, 1)', color: 'rgba(255,255,255,1)' }}>
                        ✓ Foster continuous learning and community sharing
                      </li>
                      <li style={{ fontSize: '16px', lineHeight: 1.6, textShadow: '0 4px 20px rgba(0, 0, 0, 1)', color: 'rgba(255,255,255,1)' }}>
                        ✓ Drive measurable growth through innovation
                      </li>
                    </ul>
                  </div>
                </GlassCard>
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
              }}>
                {[
                  { number: '50+', label: 'Certifications' },
                  { number: '42', label: 'Projects' },
                  { number: '16', label: 'Partnerships' },
                  { number: '100%', label: 'Client Satisfaction' },
                ].map((stat, index) => (
                  <GlassCard
                    key={index}
                    height={150}
                    blur={15}
                    glassColor="rgba(68,136,255,0.05)"
                    style={{
                      minWidth: '280px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '42px',
                        fontWeight: 'bold',
                        color: '#4488ff',
                        marginBottom: '10px',
                        textShadow: '0 2px 10px rgba(0, 0, 0, 1)',
                      }}>
                        {stat.number}
                      </div>
                      <div style={{
                        fontSize: '16px',
                        color: 'rgba(255,255,255,0.8)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        textShadow: '0 4px 20px rgba(0, 0, 0, 1)'
                      }}>
                        {stat.label}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section id="services" style={{
            padding: '100px 20px',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <div style={{
              margin: '0 auto',
            }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '60px',
              }}>
                <h2 style={{
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '20px',
                  textShadow: '0 3px 15px rgba(0, 0, 0, 1)',
                }}>
                  Our Services
                </h2>
                <p style={{
                  fontSize: '20px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 1)'
                }}>
                  Comprehensive IT solutions tailored to your needs
                </p>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
              }}>
                {[
                  {
                    title: 'Infrastructure',
                    description: 'Solid expertise in managing and orchestrating your infrastructures with cloud-native solutions.',
                    icon: 'services-1.jpg',
                  },
                  {
                    title: 'Development',
                    description: 'Performant, distributed, robust and maintainable applications built with modern technologies.',
                    icon: 'services-2.jpg',
                  },
                  {
                    title: 'Security',
                    description: 'Full degree security consultancy, from system architecture to application security.',
                    icon: 'services-3.jpg',
                  },
                ].map((service, index) => (
                  <div key={index} style={{
                    maxWidth: '380px', // Set a fixed width for each item
                    minWidth: '320px', // Ensure items don't shrink too small
                  }}>
                    <GlassCard
                      height={380}
                      blur={20}
                    >
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '64px', marginBottom: '10px' }}>
                          <GlassPanel style={{ padding: '0' }}>
                            <GlassPanel
                              style={{ padding: '0', position: 'absolute', width: '100%', height: '100%' }}
                              blur={0.4}
                              glassColor="rgba(0, 6, 92, 0.25)"
                            />
                            <Image
                              src={service.icon}
                              alt={service.title}
                              width={300}
                              height={300}
                              style={{
                                opacity: '0.7', borderRadius: '24px', inset: '0px',
                                border: `1px solid rgba(255,255,255,0.1)`,
                                transition: 'border-color 0.3s ease',
                              }} />
                          </GlassPanel>
                        </div>
                        <h3 style={{ fontSize: '28px', marginBottom: '20px', color: 'white', zIndex: '10' }}>
                          {service.title}
                        </h3>
                        <p style={{ fontSize: '16px', lineHeight: 1.7, marginBottom: '30px', textShadow: '0 4px 20px rgba(0, 0, 0, 1)', color: 'rgba(255,255,255,1)' }}>
                          {service.description}
                        </p>
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
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Partners Section */}
          <section id="partners" style={{
            padding: '100px 20px',
          }}>
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
            }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '60px',
              }}>
                <h2 style={{
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '20px',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 1)',
                }}>
                  Our Partners
                </h2>
                <p style={{
                  fontSize: '20px',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 1)',
                  color: 'rgba(255,255,255,0.8)',
                }}>
                  Trusted by industry leaders
                </p>
              </div>

              <GlassPanel
                width="100%"
                height={200}
                blur={40}
                glassColor='rgba(255, 174, 0, 0.1)'
                style={{
                  background: 'rgba(255, 174, 0, 0.06)',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '40px',
                  width: '100%',
                }}>
                  {[{ name: 'RedHat', icon: "partners/redhat.png" }, { name: 'VMware', icon: "partners/vmware.png" }, { name: 'Engineering', icon: "partners/engineering.png" }].map((partner, index) => (
                    <div key={index} style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: 'rgba(255,255,255,0.8)',
                      textShadow: '0 2px 10px rgba(0, 0, 0, 1)',
                      display: 'flex',
                      alignContent: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      textAlign: 'center',
                    }}>
                      <Image
                        src={partner.icon}
                        alt={partner.name}
                        width={150}
                        height={150}
                        style={{
                          margin: '30px',
                          filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 1))',
                        }} />
                      <p style={{ width: '100%' }}>{partner.name}</p>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="contact-section">
            <div className="contact-container">
              <div className="contact-header">
                <h2>Get in Touch</h2>
                <p>Let&apo;s discuss how we can help transform your business</p>
              </div>

              <ContactSectionList
                contacts={[
                  {
                    icon: 'icons/location.png',
                    title: 'Address',
                    content: ['Via Paolo Buzzi, 61', '00143 ROMA (RM), ITALIA'],
                  },
                  {
                    icon: 'icons/mail.png',
                    title: 'Email',
                    content: ['amministrazione@sfbs.it'],
                  },
                  {
                    icon: 'icons/residential.png',
                    title: 'Business Info',
                    content: ['P.IVA: 17782391001'],
                  },
                ]}
              />

              <div className="contact-button">
                <GlassButton
                className="contact-glass-button"
                  variant="secondary"
                  onClick={() => window.location.href = 'mailto:amministrazione@sfbs.it'}
                >
                  Contact Us Now
                </GlassButton>
              </div>
            </div>
          </section>
        </GlassPanel>

        {/* Footer */}
        <footer className="footer">
          <GlassPanel className="glass-panel-footer"
            width={'100%'}
            height={80}
            blur={25}
            glassColor="rgba(255, 255, 255, 0.03)"
          >
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
            }}>
              <div style={{
                display: 'flex',
                gap: '20px',
              }}>
                <SocialButtonList
                  links={[
                    { name: 'LinkedIn', link: 'https://it.linkedin.com/company/sfb-srl' },
                    { name: 'GitHub', link: 'https://github.com/Serp1co' }
                  ]}
                />
              </div>
            </div>
          </GlassPanel>
        </footer>
      </div>
    </div>
  );
}