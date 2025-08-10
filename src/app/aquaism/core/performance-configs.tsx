"use client";

export interface PerformanceConfig {
  numBodies: number;
  metaballResolution: number;
  updateFrequency: number;
  useTransmission: boolean; // Kept for flexibility if needed
};

// Default performance configuration
export const getPerformanceConfig = (preset: string = 'quality', customConfig?: Partial<PerformanceConfig>) => {
  const presets: Record<string, PerformanceConfig> = {
    low: { numBodies: 20, metaballResolution: 32, updateFrequency: 1, useTransmission: true },
    performance: { numBodies: 30, metaballResolution: 48, updateFrequency: 1, useTransmission: true },
    balanced: { numBodies: 30, metaballResolution: 64, updateFrequency: 1, useTransmission: true },
    quality: { numBodies: 30, metaballResolution: 72, updateFrequency: 1, useTransmission: true },
    ultra: { numBodies: 40, metaballResolution: 90, updateFrequency: 1, useTransmission: true },
  };
  
  const baseConfig = presets[preset] || presets.quality;
  return { ...baseConfig, ...customConfig };
};
