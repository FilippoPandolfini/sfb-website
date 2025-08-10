"use client";

import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { getPerformanceConfig, PerformanceConfig } from './core/performance-configs';
import { AnimatedBackground, GradientBackground, BackgroundSphere, HDRBackground } from './backgrounds/background-loader';
import MetaballSimulation from './core/metaball-simulation';

interface AppProps {
  background?: React.ReactNode;
  preset?: string;
  customConfig?: Partial<PerformanceConfig>;
  showDebugInfo?: boolean;
}

export default function ExampleApp({ 
  background, 
  preset = 'quality',
  customConfig,
  showDebugInfo = true 
}: AppProps) {
  const config = getPerformanceConfig(preset, customConfig);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#debug') {
      import('stats.js').then((Stats) => {
        const stats = new Stats.default();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);
        
        const animate = () => {
          stats.begin();
          stats.end();
          requestAnimationFrame(animate);
        };
        animate();
      });
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
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
        {/* Render background if provided */}
        {background}
        
        {/* Metaball simulation */}
        <MetaballSimulation 
          config={customConfig}
          enableEnvironment={!background} // Only use environment if no custom background
        />
      </Canvas>
      
      {/* Debug info overlay */}
      {showDebugInfo && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          color: 'white',
          fontSize: '12px',
          fontFamily: 'monospace',
          pointerEvents: 'none',
          opacity: 0.7
        }}>
          Water simulation: {config.numBodies} bodies, {config.metaballResolution}³ resolution
        </div>
      )}
    </div>
  );
}

// Example usage showing how to use with different backgrounds:
export function AppWithAnimatedBackground() {
  return <ExampleApp background={<AnimatedBackground />} preset="quality" />;
}

export function AppWithGradientBackground() {
  return <ExampleApp background={<GradientBackground />} preset="quality" />;
}

export function AppWithBackgroundSphere() {
  return <ExampleApp background={<BackgroundSphere hue={0.565} />} preset="quality" />;
}

export function AppWithHDRImage() {
  // Matching original: loads an HDR/JPG image as background and environment
  return (
    <ExampleApp 
      background={<HDRBackground path="/envs/studio_garden_4k.jpg" format="jpg" blur={0.05} />} 
      preset="quality" 
    />
  );
}

export function AppWithCustomHDR() {
  // Use your own HDR file
  return (
    <ExampleApp 
      background={<HDRBackground path="/path/to/your/environment.hdr" format="hdr" />} 
      preset="quality" 
    />
  );
}

export function AppWithEnvironment() {
  // Using drei's Environment component
  return <ExampleApp background={<Environment files="/envs/studio_garden_4k.hdr" background blur={0.05} />} preset="quality" />;
}

export function AppStandalone() {
  return <ExampleApp preset="quality" />;
}