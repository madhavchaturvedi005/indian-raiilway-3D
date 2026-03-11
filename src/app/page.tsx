"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ScrollSequenceCanvas } from "@/components/3d/ScrollSequenceCanvas";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Engine3D = dynamic(() => import("@/components/Engine3D"), {
  ssr: false,
  loading: () => <div className="w-full min-h-[600px] flex items-center justify-center"><div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>
});

const Wag9Engine3D = dynamic(() => import("@/components/Wag9Engine3D"), {
  ssr: false,
  loading: () => <div className="w-full min-h-[600px] flex items-center justify-center"><div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>
});

// Generate the 120 frame URLs for hero1
const hero1Frames = Array.from({ length: 120 }, (_, i) => {
  const frameNumber = (i + 1).toString().padStart(3, "0");
  return `/assets/hero1/ezgif-frame-${frameNumber}.jpg`;
});

// Generate the 120 frame URLs for hero2
const hero2Frames = Array.from({ length: 120 }, (_, i) => {
  const frameNumber = (i + 1).toString().padStart(3, "0");
  return `/assets/hero2/ezgif-frame-${frameNumber}.jpg`;
});

// Generate the 120 frame URLs for sketch 1
const sketch1Frames = Array.from({ length: 120 }, (_, i) => {
  const frameNumber = (i + 1).toString().padStart(3, "0");
  return `/assets/sketch 1/ezgif-frame-${frameNumber}.jpg`;
});

// Generate the 120 frame URLs for sketch2
const sketch2Frames = Array.from({ length: 120 }, (_, i) => {
  const frameNumber = (i + 1).toString().padStart(3, "0");
  return `/assets/sketch2/ezgif-frame-${frameNumber}.jpg`;
});

// Generate the 120 frame URLs for transition1
const transition1Frames = Array.from({ length: 120 }, (_, i) => {
  const frameNumber = (i + 1).toString().padStart(3, "0");
  return `/assets/transition1/ezgif-frame-${frameNumber}.jpg`;
});

// Combine them into a single continuous sequence (600 frames total)
const combinedFrames = [...hero1Frames, ...hero2Frames, ...transition1Frames, ...sketch1Frames, ...sketch2Frames];

export default function Home() {
  const [imagesReady, setImagesReady] = useState(false);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const logoPlaceholderRef = useRef<HTMLDivElement>(null);

  const introOverlayRef = useRef<HTMLDivElement>(null);
  const introHugeTextRef = useRef<HTMLDivElement>(null);

  const trainsInfoRef = useRef<HTMLDivElement>(null);
  const infraInfoRef = useRef<HTMLDivElement>(null);
  const factsInfoRef = useRef<HTMLDivElement>(null);

  const australiaFactRef = useRef<HTMLDivElement>(null);
  const australiaLineRef = useRef<HTMLDivElement>(null);
  const australiaContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Progress calculation out of total 600 frames.
    const introFadeOutProg = 8 / 600; // Intro overlay fades out
    const startFadeInProg = 10 / 600; // title starts fading in
    const peakVisibilityProg = 18 / 600; // title fully visible in center
    const endFadeOutProg = 35 / 600; // title fully moved to nav

    if (
      titleRef.current &&
      subtitleRef.current &&
      logoPlaceholderRef.current &&
      introOverlayRef.current &&
      introHugeTextRef.current &&
      trainsInfoRef.current &&
      infraInfoRef.current &&
      factsInfoRef.current &&
      australiaFactRef.current &&
      australiaLineRef.current &&
      australiaContentRef.current
    ) {

      const titleEl = titleRef.current;

      // Set initial absolute state exactly in the center of the screen
      gsap.set(titleEl, {
        autoAlpha: 0,
        yPercent: -50,
        xPercent: -50,
        top: "60%",
        left: "50%",
        filter: "blur(10px)",
        scale: 1.1
      });
      gsap.set(subtitleRef.current, {
        autoAlpha: 0,
        yPercent: -50,
        xPercent: -50,
        top: "70%",
        left: "50%"
      });

      gsap.set([trainsInfoRef.current, infraInfoRef.current, factsInfoRef.current, australiaFactRef.current], {
        autoAlpha: 0,
        y: 50
      });
      gsap.set(australiaLineRef.current, { scaleY: 0, transformOrigin: 'top center' });
      gsap.set(australiaContentRef.current, { autoAlpha: 0, x: -30 });

      // Create a timeline mapped to the overall scroll container
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      });

      tl.set({}, {}, 1);

      // 0. Intro overlay fades out
      tl.to(introOverlayRef.current, {
        autoAlpha: 0,
        duration: introFadeOutProg,
        ease: "power2.inOut"
      }, 0);

      // Huge text specifically zooms towards the user
      tl.to(introHugeTextRef.current, {
        scale: 3,
        filter: "blur(20px)",
        autoAlpha: 0,
        duration: introFadeOutProg * 1.5, // Slightly longer trail for the zoom
        ease: "power2.in"
      }, 0);

      // 1. Text fades IN and scrolls up into center
      const durationToFadeIn = peakVisibilityProg - startFadeInProg;

      tl.to(titleEl, {
        autoAlpha: 1,
        top: "50%",
        filter: "blur(0px)",
        scale: 1,
        duration: durationToFadeIn,
        ease: "power2.out"
      }, startFadeInProg)
        .to(subtitleRef.current, {
          autoAlpha: 1,
          top: "60%",
          duration: durationToFadeIn,
          ease: "power2.out"
        }, startFadeInProg + 0.005);

      // 2. Text shrinks and moves to the navbar placeholder position
      const movementDuration = endFadeOutProg - peakVisibilityProg;
      const placeholderRect = logoPlaceholderRef.current.getBoundingClientRect();
      const centerDestX = placeholderRect.left + placeholderRect.width / 2;
      const centerDestY = placeholderRect.top + placeholderRect.height / 2;

      tl.to(titleEl, {
        top: centerDestY + "px",
        left: centerDestX + "px",
        xPercent: -50,
        yPercent: -50,
        scale: 0.35, // Extremely large scale for the final logo size
        transformOrigin: "center center",
        duration: movementDuration,
        ease: "power2.inOut"
      }, peakVisibilityProg)
        .to(subtitleRef.current, {
          autoAlpha: 0,
          top: "30%",
          duration: movementDuration,
          ease: "power2.inOut"
        }, peakVisibilityProg);

      // Section 1: Trains Info (Frames 35 to 63)
      tl.to(trainsInfoRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 5 / 600,
        ease: "power2.out"
      }, 35 / 600)
        .to(trainsInfoRef.current, {
          autoAlpha: 0,
          y: -50,
          duration: 5 / 600,
          ease: "power2.in"
        }, 58 / 600);

      // Section 2: Infrastructure Info (Frames 63 to 91)
      tl.to(infraInfoRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 5 / 600,
        ease: "power2.out"
      }, 63 / 600)
        .to(infraInfoRef.current, {
          autoAlpha: 0,
          y: -50,
          duration: 5 / 600,
          ease: "power2.in"
        }, 86 / 600);

      // Section 3: Fun Facts Info (Frames 91 to 120)
      tl.to(factsInfoRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 5 / 600,
        ease: "power2.out"
      }, 91 / 600)
        .to(factsInfoRef.current, {
          autoAlpha: 0,
          y: -50,
          duration: 5 / 600,
          ease: "power2.in"
        }, 115 / 600);

      // Section 4: Australia Comparison (hero2 frames 55 to 120 -> global 175 to 240)
      tl.to(australiaFactRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 2 / 600,
        ease: "none"
      }, 175 / 600)
        .to(australiaLineRef.current, {
          scaleY: 1,
          duration: 10 / 600,
          ease: "power2.out"
        }, 175 / 600)
        .to(australiaContentRef.current, {
          autoAlpha: 1,
          x: 0,
          duration: 10 / 600,
          ease: "power2.out"
        }, 178 / 600)
        .to([australiaContentRef.current, australiaLineRef.current], {
          autoAlpha: 0,
          x: -50,
          duration: 10 / 600,
          ease: "power2.in"
        }, 230 / 600)
        .to(australiaFactRef.current, {
          autoAlpha: 0,
          duration: 2 / 600
        }, 240 / 600);
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [imagesReady]); // Re-run GSAP when images are ready so heights are correct

  useEffect(() => {
    if (!imagesReady) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0); // Force to top
    } else {
      document.body.style.overflow = "";
    }
  }, [imagesReady]);

  return (
    <>
      {/* 🚂 Preloader Screen */}
      <div className={`fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-center transition-all duration-1000 ${imagesReady ? 'opacity-0 pointer-events-none delay-500' : 'opacity-100 pointer-events-auto cursor-wait'}`}>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.2em] uppercase text-white animate-pulse" style={{ fontFamily: "'Oswald', sans-serif" }}>
          Indian Railways
        </h1>
        <div className="mt-8 w-48 h-[1px] bg-white/20 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-full bg-white/60 animate-[slide_1.5s_ease-in-out_infinite]" style={{ transformOrigin: "left" }}></div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <main className="relative text-zinc-50 min-h-screen font-sans selection:bg-amber-500 selection:text-zinc-900 overflow-x-hidden bg-black">

        {/* 0. Permanent Top Navigation */}
        <nav className="fixed top-0 left-0 w-full z-[400] p-6 md:p-12 pointer-events-none text-white mix-blend-difference">
          <div className="pointer-events-auto max-w-6xl mx-auto flex justify-between items-center text-[10px] md:text-xs font-bold tracking-widest uppercase">
            <div className="flex gap-4 md:gap-8 flex-1">
              <span className="cursor-pointer hover:text-white/70 transition-colors">About</span>
              <span className="cursor-pointer hover:text-white/70 transition-colors">Our Fleet</span>
              <span className="cursor-pointer hover:text-white/70 transition-colors">Advantages</span>
              <span className="cursor-pointer hover:text-white/70 transition-colors">Global</span>
            </div>

            <div className="flex justify-center flex-1">
              {/* Invisible placeholder to establish coordinate target for the big text logo in the center */}
              <div ref={logoPlaceholderRef} className="w-[300px] h-[30px]" />
            </div>

            <div className="hidden md:flex gap-8 flex-1 justify-end">
              <span>99.4% Electrified</span>
              <span>7,400+ Stations</span>
            </div>
          </div>
        </nav>

        {/* 1. The Scroll-locked Canvas that stays fixed in the background */}
        <ScrollSequenceCanvas
          imageUrls={combinedFrames}
          containerId="scroll-container"
          onReady={() => setImagesReady(true)}
        />

        {/* 2. The massive scrolling container (adds the height needed to scrub the sequence) */}
        <div id="scroll-container" className="h-[2000vh] w-full">

          {/* JESKO JETS STYLE INITIAL OVERLAY */}
          <div ref={introOverlayRef} className="fixed inset-0 z-[250] pointer-events-auto flex flex-col justify-between p-6 md:p-12">

            {/* Empty Top Space to clear nav */}
            <div className="h-[20px]"></div>

            {/* Huge Typography Overlay */}
            <div ref={introHugeTextRef} className="absolute inset-0 flex items-center justify-between px-8 md:px-24 pointer-events-none -mt-32 md:-mt-48">
              <h2 className="text-5xl md:text-7xl lg:text-[9rem] font-medium leading-[0.9] tracking-tighter drop-shadow-2xl">
                Lifeline <br />of nation
              </h2>
              <h2 className="text-5xl md:text-7xl lg:text-[9rem] font-medium leading-[0.9] tracking-tighter text-right drop-shadow-2xl">
                Modernizing<br />a legacy
              </h2>
            </div>

            {/* Bottom Content */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end w-full pb-0 md:pb-4">

              {/* Bottom Left Paragraph */}
              <div className="max-w-xs mb-8 md:mb-0 text-center md:text-left self-start md:self-end">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-[1.1]">
                  Your<br />freedom to<br />explore India
                </h3>
                <div className="hidden md:block h-[1px] w-12 bg-white/50 mb-4"></div>
                <p className="text-[11px] md:text-sm font-medium text-white/80 leading-relaxed md:border-l-2 md:border-white/30 md:pl-4 py-1">
                  Indian Railways is the lifeline of the nation. As of 2026, the 69,439 km network is undergoing massive modernization. With Vande Bharat Express and 99.4% electrification, every journey is designed around your comfort and modern ambitions.
                </p>
              </div>

              {/* Bottom Center Pill Button */}
              <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center bg-white rounded-full p-1 shadow-xl cursor-pointer hover:scale-105 transition-transform">
                <span className="px-6 text-sm font-bold text-black whitespace-nowrap">Book the Train</span>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-200 rounded-full flex items-center justify-center text-black shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11 9.27 2.2a2 2 0 0 0-2.27 3.4L18 11H2" /></svg>
                </div>
              </div>

              {/* Bottom Right Scroll Indicator */}
              <div className="hidden md:flex flex-col gap-4 w-[280px]">
                <div className="w-full h-[1px] bg-white/50"></div>
                <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase">
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                    Scroll Down
                  </span>
                  <span>To Start The Journey</span>
                </div>
              </div>

            </div>
          </div>

          {/* Typographic Overlay that locks and fades based on frame state */}
          <div className="fixed inset-0 pointer-events-none z-[300]">

            {/* Absolute positioning so it can smoothly animate from center to top-left without layout jumps */}
            <h1
              ref={titleRef}
              className="absolute text-[10rem] font-bold tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 opacity-0 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] whitespace-nowrap"
              style={{ fontFamily: "'Oswald', sans-serif", WebkitTextStroke: "2px rgba(0,0,0,0.5)" }}
            >
              Indian Railways
            </h1>

            <p
              ref={subtitleRef}
              className="absolute w-full max-w-2xl text-lg md:text-xl text-zinc-100 font-medium text-center leading-relaxed opacity-0 bg-black/60 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10 shadow-2xl"
            >
              A journey through steel, heritage, and modern luxury.
            </p>

            {/* Sequential Info Overlays */}

            {/* Trains Info */}
            <div ref={trainsInfoRef} className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-24 max-w-6xl mx-auto pointer-events-none pt-12 md:pt-0">
              <h3 className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-4 drop-shadow-lg">Modernization & New Trains</h3>
              <h2 className="text-4xl md:text-6xl font-light mb-8 drop-shadow-xl" style={{ fontFamily: "'Oswald', sans-serif" }}>A Shift to Vande Bharat Standards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pointer-events-auto text-left">
                <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-zinc-900/60 transition-colors">
                  <h4 className="text-xl font-bold mb-2 text-white">Vande Bharat Express</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">India's flagship semi-high-speed (160 km/h) self-propelled trains. In early 2026, the long-awaited Vande Bharat Sleeper version was launched for overnight long-distance travel.</p>
                </div>
                <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-zinc-900/60 transition-colors">
                  <h4 className="text-xl font-bold mb-2 text-white">Amrit Bharat Express</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">A high-speed, non-AC train designed for affordable, modern travel for middle and low-income passengers.</p>
                </div>
                <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-zinc-900/60 transition-colors">
                  <h4 className="text-xl font-bold mb-2 text-white">Namo Bharat (RRTS)</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">A regional rapid transit system connecting suburban hubs (like Delhi-Meerut) to city centers.</p>
                </div>
                <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-zinc-900/60 transition-colors">
                  <h4 className="text-xl font-bold mb-2 text-white">Bullet Train (MAHSR)</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">The Mumbai–Ahmedabad project has achieved over 55% physical progress as of early 2026, with major milestones in tunnel breakthroughs and viaduct construction.</p>
                </div>
              </div>
            </div>

            {/* Infrastructure Info */}
            <div ref={infraInfoRef} className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-24 max-w-6xl mx-auto pointer-events-none pt-12 md:pt-0">
              <h3 className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-4 drop-shadow-lg">Infrastructure & Safety</h3>
              <h2 className="text-4xl md:text-6xl font-light mb-8 drop-shadow-xl" style={{ fontFamily: "'Oswald', sans-serif" }}>Building for the Future</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pointer-events-auto text-left">
                <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-zinc-900/60 transition-colors">
                  <h4 className="text-xl font-bold mb-2 text-white">Kavach 4.0</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">IR is rapidly deploying "Kavach," an indigenous Automatic Train Protection (ATP) system designed to prevent collisions. Version 4.0 is currently being rolled out across high-density routes.</p>
                </div>
                <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-zinc-900/60 transition-colors">
                  <h4 className="text-xl font-bold mb-2 text-white">Amrit Bharat Station Scheme</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">Over 1,300 stations are being redeveloped into "City Centres" with airport-like amenities, including roof plazas, food courts, and improved accessibility.</p>
                </div>
                <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-zinc-900/60 transition-colors">
                  <h4 className="text-xl font-bold mb-2 text-white">Dedicated Freight Corridors</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">Exclusive tracks for goods trains to de-congest passenger lines. The Eastern DFC is fully complete, and the Western DFC is nearing 100% completion.</p>
                </div>
                <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-zinc-900/60 transition-colors">
                  <h4 className="text-xl font-bold mb-2 text-white">Strategic Links</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">Recent years saw the completion of the Chenab Bridge (the world's highest rail bridge) and the all-weather rail link to Kashmir and Mizoram.</p>
                </div>
              </div>
            </div>

            {/* Fun Facts Info */}
            <div ref={factsInfoRef} className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-24 max-w-6xl mx-auto pointer-events-none pt-12 md:pt-0">
              <h3 className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-4 drop-shadow-lg">Did You Know?</h3>
              <h2 className="text-4xl md:text-6xl font-light mb-8 drop-shadow-xl" style={{ fontFamily: "'Oswald', sans-serif" }}>Interesting Facts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pointer-events-auto text-left">
                <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-zinc-900/60 transition-colors">
                  <h4 className="text-xl font-bold mb-2 text-white">Highest Station</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">Ghum (West Bengal) on the Darjeeling Himalayan Railway sits at an altitude of 2,257 meters.</p>
                </div>
                <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-zinc-900/60 transition-colors">
                  <h4 className="text-xl font-bold mb-2 text-white">Longest Tunnel</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">The T-50 tunnel on the USBRL project is India's longest operational railway tunnel.</p>
                </div>
                <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:bg-zinc-900/60 transition-colors">
                  <h4 className="text-xl font-bold mb-2 text-white">Net Zero Goal</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">Indian Railways aims to be a Net Zero Carbon Emitter by 2030, increasingly using solar and wind energy to power trains and stations.</p>
                </div>
              </div>
            </div>

            {/* Australia Comparison Fact */}
            <div ref={australiaFactRef} className="absolute bottom-12 md:bottom-24 left-0 flex justify-start px-6 md:px-12 pointer-events-none z-[310]">
              <div className="flex items-stretch gap-4 md:gap-6 max-w-sm md:max-w-xl bg-black/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                <div ref={australiaLineRef} className="w-1.5 md:w-2 bg-amber-500 rounded-full" style={{ transformOrigin: 'top center' }}></div>
                <div ref={australiaContentRef} className="py-2 pointer-events-auto">
                  <h3 className="text-xl md:text-3xl font-bold mb-3 drop-shadow-xl text-white tracking-widest uppercase">The "Australia" Comparison</h3>
                  <p className="text-sm md:text-lg text-zinc-300 italic leading-relaxed font-serif drop-shadow-md">
                    Every single day, Indian Railways carries approximately <span className="font-bold text-white not-italic">23 million passengers</span>. To put that in perspective, that is roughly equivalent to moving the entire population of Australia across the country every <span className="font-bold text-amber-500 not-italic">24 hours</span>.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. The 3D Engine Interactor Section */}
        <section className="relative z-20 w-full bg-[#09090b] border-t border-zinc-800/50 pt-24 pb-24 flex flex-col items-center">

          {/* Section Header */}
          <div className="text-center px-4 w-full max-w-4xl mb-12 z-10">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>Experience the Fleet</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Get up close with the engineering marvels that power the nation in full interactive 3D.</p>
          </div>

          {/* WAP-7 Engine */}
          <div className="w-full max-w-6xl mx-auto rounded-3xl relative h-[60vh] md:h-[80vh] group mb-8">
            {/* Big Name in the Back */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
              <h2 className="text-[10rem] md:text-[18rem] font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-zinc-500 to-zinc-900 leading-none" style={{ fontFamily: "'Oswald', sans-serif" }}>
                WAP-7
              </h2>
            </div>
            {/* Engine in the Front */}
            <div className="absolute inset-0 z-10 w-full h-full">
              <Engine3D />
            </div>
          </div>
          <div className="text-center px-4 w-full max-w-4xl mb-24">
            <p className="text-zinc-400 max-w-2xl mx-auto">Discover the workhorse of Indian Railways. Highly capable and immensely powerful, this electric passenger locomotive hauls the most prestigious trains across the network.</p>
          </div>

          {/* WAG-9 Engine */}
          <div className="w-full max-w-6xl mx-auto rounded-3xl relative h-[60vh] md:h-[80vh] group mb-8">
            {/* Big Name in the Back */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
              <h2 className="text-[10rem] md:text-[18rem] font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-zinc-500 to-zinc-900 leading-none" style={{ fontFamily: "'Oswald', sans-serif" }}>
                WAG-9
              </h2>
            </div>
            {/* Engine in the Front */}
            <div className="absolute inset-0 z-10 w-full h-full">
              <Wag9Engine3D />
            </div>
          </div>
          <div className="text-center px-4 w-full max-w-4xl">
            <p className="text-zinc-400 max-w-2xl mx-auto">Meet the heavy lifter. The WAG-9 is the most powerful freight locomotive in India, forming the backbone of the Dedicated Freight Corridors.</p>
          </div>

        </section>

        {/* 4. The booking section that user scrolls down to after the cinematic hero */}
        <section className="relative z-20 bg-zinc-950/80 backdrop-blur-3xl flex items-center justify-center border-t border-zinc-800/50 py-24">
          <div className="container max-w-4xl mx-auto p-12 rounded-[2rem] bg-zinc-900/40 shadow-2xl border border-zinc-800/50 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" x2="4" y1="22" y2="15" /></svg>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>Plan Your Journey</h2>
            </div>

            {/* Conceptual Booking Form */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5 bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 transition-colors hover:border-zinc-700">
                <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2 block font-medium">From</label>
                <input type="text" placeholder="New Delhi (NDLS)" className="w-full bg-transparent border-none text-xl outline-none placeholder:text-zinc-600 focus:text-white transition-colors" />
              </div>

              <div className="hidden md:flex col-span-2 items-center justify-center">
                <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 relative z-10 bg-zinc-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                  <svg className="absolute" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </div>
              </div>

              <div className="md:col-span-5 bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 transition-colors hover:border-zinc-700">
                <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2 block font-medium">To</label>
                <input type="text" placeholder="Mumbai Central (MMCT)" className="w-full bg-transparent border-none text-xl outline-none placeholder:text-zinc-600 focus:text-white transition-colors" />
              </div>

              <div className="md:col-span-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 transition-colors hover:border-zinc-700">
                <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2 block font-medium">Date</label>
                <input type="date" className="w-full bg-transparent border-none text-lg outline-none text-zinc-400 focus:text-white [color-scheme:dark]" />
              </div>

              <div className="md:col-span-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 transition-colors hover:border-zinc-700">
                <label className="text-xs uppercase tracking-widest text-zinc-500 mb-2 block font-medium">Class</label>
                <select className="w-full bg-transparent border-none text-lg outline-none text-zinc-400 focus:text-white appearance-none cursor-pointer">
                  <option>1A (First AC)</option>
                  <option>2A (Second AC)</option>
                  <option>3A (Third AC)</option>
                  <option>SL (Sleeper)</option>
                </select>
              </div>

              <div className="md:col-span-4">
                <button className="w-full h-full min-h-[5rem] bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-2xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)]">
                  Search Trains
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
