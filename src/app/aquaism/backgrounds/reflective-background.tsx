"use client";

import { useTexture } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { JSX, useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

export function ReflectiveBackgroundImage({
  imagePath,
  distance = 15,
  scale = [40, 24, 1],
  followCamera = true
}: {
  imagePath: string;
  distance?: number;
  scale?: [number, number, number];
  followCamera?: boolean;
}): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const texture = useTexture(imagePath);

  // Configure texture for better quality
  useMemo(() => {
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  useFrame(() => {
    if (!meshRef.current) return;

    if (followCamera) {
      // Get camera direction
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);

      // Position image behind camera
      meshRef.current.position.copy(camera.position);
      meshRef.current.position.addScaledVector(direction, -distance);

      // Make the image face the camera
      meshRef.current.lookAt(camera.position);
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={scale}
      position={followCamera ? undefined : [0, 0, -distance]}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        // Important for water interaction
        emissive={new THREE.Color(0x111111)}
        emissiveMap={texture}
        emissiveIntensity={0.2}
        roughness={0.1}
        metalness={0}
      />
    </mesh>
  );
}

// Environment sphere with image for reflections
export function EnvironmentSphereWithImage({
  imagePath,
  radius = 50
}: {
  imagePath: string;
  radius?: number;
}): JSX.Element {
  const texture = useTexture(imagePath);

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(radius, 64, 32);
    return geo;
  }, [radius]);

  // Configure texture
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        fog={false}
      />
    </mesh>
  );
}

// Hidden environment for reflections only (not visible to camera)
export function HiddenReflectionEnvironment({
  imagePath,
  backgroundVisible = false,
  intensity = 1
}: {
  imagePath: string;
  backgroundVisible?: boolean;
  intensity?: number;
}): JSX.Element | null {
  const { scene, gl } = useThree();
  const texture = useTexture(imagePath);

  useEffect(() => {
    // Create a cube render target for environment mapping
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      colorSpace: THREE.SRGBColorSpace
    });

    // Create cube camera
    const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);

    // Create a temporary scene with the image
    const tempScene = new THREE.Scene();
    const sphereGeo = new THREE.SphereGeometry(50, 64, 32);
    const sphereMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    tempScene.add(sphere);

    // Render to cube camera
    cubeCamera.position.set(0, 0, 0);
    cubeCamera.update(gl, tempScene);

    // IMPORTANT: Only set environment, NOT background
    // This makes reflections work without showing the environment
    scene.environment = cubeRenderTarget.texture;
    scene.environmentIntensity = intensity;

    // Only set background if explicitly requested
    if (backgroundVisible) {
      scene.background = cubeRenderTarget.texture;
      scene.backgroundBlurriness = 0.02;
    }

    return () => {
      scene.environment = null;
      scene.environmentIntensity = 1;
      if (backgroundVisible) {
        scene.background = null;
      }
      cubeRenderTarget.dispose();
    };
  }, [texture, scene, gl, backgroundVisible, intensity]);

  return null;
}

// Static background that doesn't affect reflections
export function StaticBackground({
  color,
  gradient
}: {
  color?: string;
  gradient?: { from: string; to: string };
}): JSX.Element | null {
  const { scene } = useThree();

  useEffect(() => {
    if (gradient) {
      // Create gradient texture
      const canvas = document.createElement('canvas');
      canvas.width = 2;
      canvas.height = 512;
      const context = canvas.getContext('2d')!;
      const gradientFill = context.createLinearGradient(0, 0, 0, 512);
      gradientFill.addColorStop(0, gradient.from);
      gradientFill.addColorStop(1, gradient.to);
      context.fillStyle = gradientFill;
      context.fillRect(0, 0, 2, 512);

      const gradientTexture = new THREE.CanvasTexture(canvas);
      gradientTexture.needsUpdate = true;
      scene.background = gradientTexture;

      return () => {
        gradientTexture.dispose();
        scene.background = null;
      };
    } else if (color) {
      scene.background = new THREE.Color(color);
      return () => {
        scene.background = null;
      };
    }
  }, [scene, color, gradient]);

  return null;
}

// Combine hidden reflections with fog for depth
export function AdvancedFakeReflectionSetup({
  reflectionImage,
  backgroundColor,
  fogColor = "#001122",
  isFogEnabled = true,
  fogNear = 10,
  fogFar = 50
}: {
  reflectionImage: string;
  backgroundColor: string | { from: string; to: string };
  isFogEnabled?: boolean;
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
}): JSX.Element {
  const { scene } = useThree();
  // Setup fog for depth effect
  useEffect(() => {
    if(isFogEnabled) {
    scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
    return () => {
      scene.fog = null;
    };
  }
  }, [scene, isFogEnabled, fogColor, fogNear, fogFar]);

  return (
    <>
      {/* Hidden environment for water reflections */}
      <HiddenReflectionEnvironment
        imagePath={reflectionImage}
        backgroundVisible={false}
        intensity={2}  // Boost for stronger reflections
      />

      {/* Visible background */}
      {typeof backgroundColor === 'string' ? (
        <StaticBackground color={backgroundColor} />
      ) : (
        <StaticBackground gradient={backgroundColor} />
      )}
    </>
  );
}
