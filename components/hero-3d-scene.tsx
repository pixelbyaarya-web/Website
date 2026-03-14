"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Environment, ContactShadows, PresentationControls, MeshDistortMaterial, Stars } from "@react-three/drei"
import * as THREE from "three"

function useThemeColors() {
    const [theme, setTheme] = useState("batman");
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setTheme(document.documentElement.hasAttribute("data-theme") ? "joker" : "batman");
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        setTheme(document.documentElement.hasAttribute("data-theme") ? "joker" : "batman");
        return () => observer.disconnect();
    }, []);
    return theme;
}

function ComicElement({ position, color, textureUrl, scale = 1, speed = 1, rotationOffsets = [0, 0, 0], isDotted = false }: any) {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (!meshRef.current) return
        // Floating and gentle rotation
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2
        meshRef.current.rotation.z = rotationOffsets[2] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.1
        meshRef.current.rotation.x = rotationOffsets[0] + Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.1
        meshRef.current.rotation.y = rotationOffsets[1] + state.clock.elapsedTime * 0.2 * speed
    })

    return (
        <Float floatIntensity={1} rotationIntensity={0.5} speed={2}>
            {/* 2D Plane acting as a sprite/doodle */}
            <mesh ref={meshRef} position={position} scale={scale}>
                <planeGeometry args={[2, 2]} />
                <meshStandardMaterial
                    color={color}
                    transparent={true}
                    opacity={0.8}
                    side={THREE.DoubleSide}
                    roughness={1}
                    metalness={0}
                    wireframe={isDotted} // Mocking a dotted/comic look
                />
                {/* Adds a thick outline behind the "drawing" to make it pop like a comic sticker */}
                <mesh position={[0, 0, -0.05]} scale={1.05}>
                    <planeGeometry args={[2, 2]} />
                    <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
                </mesh>
            </mesh>
        </Float>
    )
}

function FloatingElements() {
    const theme = useThemeColors();

    // Theme colors in hex for Three.js
    const primaryColor = theme === "joker" ? "#ba68c8" : "#8a7e5f"; // Purple vs Muted Gold
    const accentColor = theme === "joker" ? "#4ade80" : "#d97706"; // Toxic green vs Orange-gold
    const bgOutline = theme === "joker" ? "#ffffff" : "#000000";

    return (
        <>
            <ambientLight intensity={1} />
            <directionalLight position={[5, 5, 5]} intensity={2} />

            <PresentationControls
                global={false}
                cursor={true}
                snap={true}
                speed={1}
                zoom={1}
                rotation={[0, 0, 0]}
                polar={[-0.1, 0.1]}
                azimuth={[-0.2, 0.2]}
            >
                <group position={[3, 0, -2]}>
                    {/* Main "POW" or Action Element Style */}
                    <ComicElement
                        position={[0, 1, 0]}
                        color={primaryColor}
                        scale={1.5}
                        speed={1.2}
                        rotationOffsets={[0.1, 0, 0.2]}
                        isDotted={false}
                    />
                    {/* Secondary Doodle Element */}
                    <ComicElement
                        position={[-2, -1.5, -1]}
                        color={accentColor}
                        scale={1.2}
                        speed={0.8}
                        rotationOffsets={[-0.2, Math.PI / 4, -0.1]}
                        isDotted={true}
                    />
                    {/* Background Highlight Element */}
                    <ComicElement
                        position={[2, -1, -3]}
                        color={theme === "joker" ? "#000000" : "#ffffff"}
                        scale={2}
                        speed={0.5}
                        rotationOffsets={[0, 0, 0]}
                        isDotted={false}
                    />
                </group>
            </PresentationControls>

            <ContactShadows position={[0, -4, 0]} opacity={0.6} scale={20} blur={2.5} far={4} color={primaryColor} />
            <Environment preset="city" />

            {/* Abstract ink/halftone dots flowing in background */}
            <Stars radius={40} depth={50} count={theme === "joker" ? 800 : 400} factor={theme === "joker" ? 8 : 4} saturation={1} fade speed={2} />
        </>
    )
}

export function Hero3DScene() {
    return (
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <FloatingElements />
            </Canvas>
        </div>
    )
}
