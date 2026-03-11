"use client";
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Html } from '@react-three/drei';

function Locomotive() {
    const { scene } = useGLTF('/assets/wap_7_indian_locomotive_low_poly_model/scene.gltf');
    return <primitive object={scene} />;
}

// Preload to ensure fast rendering when scrolling down
useGLTF.preload('/assets/wap_7_indian_locomotive_low_poly_model/scene.gltf');

function Loader() {
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-white font-bold tracking-widest text-xs uppercase whitespace-nowrap drop-shadow-md">Loading Engine...</div>
            </div>
        </Html>
    );
}

export default function Engine3D() {
    return (
        <div className="w-full h-full min-h-[600px] relative cursor-grab active:cursor-grabbing">
            <Canvas shadows camera={{ position: [5, 2, 8], fov: 45 }}>
                <Suspense fallback={<Loader />}>
                    <Stage environment="city" intensity={0.5} adjustCamera>
                        <Locomotive />
                    </Stage>
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>

            {/* Overlay UI to tell users they can interact */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-white/80 text-xs tracking-widest uppercase font-bold flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
                    Drag to Rotate Engine
                </div>
            </div>
        </div>
    );
}
