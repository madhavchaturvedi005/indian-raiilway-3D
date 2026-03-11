"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollSequenceCanvasProps {
    imageUrls: string[];
    containerId: string; // The ID of the container pin the scroll to
    onProgress?: (progress: number, currentFrame: number) => void;
    priority?: boolean;
    onReady?: () => void;
}

export const ScrollSequenceCanvas: React.FC<ScrollSequenceCanvasProps> = ({
    imageUrls,
    containerId,
    onProgress,
    onReady,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const playheadRef = useRef({ frame: 0 });
    const [imagesLoaded, setImagesLoaded] = useState<HTMLImageElement[]>([]);
    const [isReady, setIsReady] = useState(false);

    // 1. Preload Images
    useEffect(() => {
        let isMounted = true;
        const preload = async () => {
            try {
                console.log(`Starting to preload ${imageUrls.length} images...`);
                const loadedImgs = await Promise.all(
                    imageUrls.map(
                        (url) =>
                            new Promise<HTMLImageElement>((resolve, reject) => {
                                const img = new Image();
                                img.src = url;
                                img.onload = () => resolve(img);
                                img.onerror = () => {
                                    console.error(`Failed to load ${url}`);
                                    resolve(new Image()); // Resolve with empty image so promise.all doesn't fail immediately
                                };
                            })
                    )
                );

                if (isMounted) {
                    console.log(`Successfully loaded ${loadedImgs.length} images.`);
                    setImagesLoaded(loadedImgs);
                    setIsReady(true);
                    if (onReady) onReady();
                }
            } catch (err) {
                console.error("Error preloading sequence:", err);
            }
        };

        preload();

        return () => {
            isMounted = false;
        };
    }, [imageUrls]);

    // 2. Setup Canvas & GSAP
    useEffect(() => {
        if (!isReady || imagesLoaded.length === 0 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Responsive Canvas Resizing
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame(playheadRef.current.frame);
        };

        const renderFrame = (index: number) => {
            const img = imagesLoaded[index];
            if (!img || !ctx) return;

            // Draw image covering the canvas (object-fit: cover equivalent)
            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;

            let drawWidth = canvas.width;
            let drawHeight = canvas.height;
            let offsetX = 0;
            let offsetY = 0;

            if (canvasRatio > imgRatio) {
                drawHeight = canvas.width / imgRatio;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawWidth = canvas.height * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas(); // Initial draw (frame 0)

        // Setup GSAP ScrollTrigger
        const trigger = ScrollTrigger.create({
            trigger: `#${containerId}`,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5, // Slight smoothing
            onUpdate: (self) => {
                // Calculate which frame we should be on
                const progress = self.progress;
                let frameIndex = Math.floor(progress * (imagesLoaded.length - 1));

                // Ensure bounds
                if (frameIndex < 0) frameIndex = 0;
                if (frameIndex >= imagesLoaded.length) frameIndex = imagesLoaded.length - 1;

                // If the frame changed, re-render
                if (frameIndex !== playheadRef.current.frame) {
                    playheadRef.current.frame = frameIndex;
                    renderFrame(frameIndex);
                    if (onProgress) onProgress(progress, frameIndex);
                }
            },
        });

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            trigger.kill();
        };
    }, [isReady, imagesLoaded, containerId, onProgress]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed top-0 left-0 w-full h-[100dvh] object-cover z-0 pointer-events-none transition-opacity duration-700 ${isReady ? "opacity-100" : "opacity-0"
                }`}
        />
    );
};
