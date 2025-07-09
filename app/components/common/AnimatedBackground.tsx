"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const AnimatedBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any previous animations
    const container = containerRef.current;
    const timeouts: NodeJS.Timeout[] = [];
    const animations: (gsap.core.Tween | gsap.core.Timeline)[] = [];
    
    // Detect if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    // If user prefers reduced motion, create minimal static background
    if (prefersReducedMotion) {
      createStaticBackground();
      return;
    }
    
    // Updated SVG icons with proper sports store themed icons - reduced count
    const svgIcons = [
      {
        name: "Star", // Review star
        color: "#EAB308", // yellow-500
        path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l8.91-1.01L12 2z",
      },
      {
        name: "ShoppingBag", // Product/shopping
        color: "#9333EA", // purple-600
        path: "M3 6l3-4h12l3 4M3 6h18M3 6v14a2 2 0 002 2h14a2 2 0 002-2V6M16 10a4 4 0 01-8 0",
      },
      {
        name: "Trophy", // Sports award
        color: "#F59E0B", // amber-500
        path: "M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0",
      },
      {
        name: "Fire", // Hot deals / trending
        color: "#F97316", // orange-500
        path: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z M12 18a6 6 0 01-6-6c0-1.5.5-3 1.38-5.17.44-.98.986-1.185 1.62-1.185.955 0 1.727.759 1.727 1.711 0 1.196-.168 1.826-.388 2.57-.557 1.89 1.259 3.397 3.226 3.42 1.856.03 3.403-1.166 4.12-2.78 1-2.201 1.396-4.033 1.396-5.83 0-2.337-1.661-4.83-4.08-4.83-.898 0-1.826.256-2.49.601",
      },
      {
        name: "Store", // Sport store
        color: "#EC4899", // pink-500
        path: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z",
      },
    ];

    // Create static background for reduced motion preference
    function createStaticBackground() {
      const iconWrapper = document.createElement("div");
      iconWrapper.className = "absolute inset-0 opacity-20";
      iconWrapper.style.backgroundImage = 
        "linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)";
      iconWrapper.style.backgroundSize = "40px 40px";
      container.appendChild(iconWrapper);
    }

    // Create falling icons - reduced count
    const createIcons = () => {
      // Limit creation to visible viewport only for better performance
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Further reduce icon count for better performance
      const iconCount = Math.min(12, Math.floor((viewportWidth * viewportHeight) / 60000));
      
      for (let i = 0; i < iconCount; i++) {
        timeouts.push(setTimeout(() => {
          createIcon(i);
        }, i * 100)); // Reduced delay between icon creation (was 300)
      }
    };

    // Function to create a single falling icon
    const createIcon = (i: number) => {
      // Select random icon
      const randomIcon = svgIcons[Math.floor(Math.random() * svgIcons.length)];

      // Create wrapper element
      const iconWrapper = document.createElement("div");
      iconWrapper.className = "falling-icon absolute";

      // More scattered positioning with better distribution
      // Divide screen into sections to prevent overlap
      const sectionWidth = 100 / 6; // 6 columns (wider spacing)
      const sectionHeight = 300 / 6; // 6 rows (taller spacing)

      // Calculate grid position (with randomization within the cell)
      const column = i % 6;
      const row = Math.floor(i / 6) % 6;

      // Position within the assigned grid cell (with larger padding to avoid edges)
      const padding = 20; // percent padding within cell
      const leftPos =
        column * sectionWidth +
        padding / 2 +
        Math.random() * (sectionWidth - padding);
      const topPos = -(row * sectionHeight) - Math.random() * 150; // Reduced initial height (was 300)

      iconWrapper.style.left = `${leftPos}%`;
      iconWrapper.style.top = `${topPos}px`;
      iconWrapper.style.zIndex = "0";
      iconWrapper.style.opacity = "0";
      iconWrapper.style.transform = "rotate(0deg)";
      iconWrapper.style.willChange = "transform, opacity"; // Add will-change for better performance

      // Create SVG element with fill for better visibility
      const size = 26 + Math.floor(Math.random() * 16); // 26-42px size
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", `${size}`);
      svg.setAttribute("height", `${size}`);
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", randomIcon.color);
      svg.setAttribute("stroke-width", "1.5");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");

      // Create path element
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", randomIcon.path);

      // Append path to SVG
      svg.appendChild(path);
      iconWrapper.appendChild(svg);
      iconWrapper.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.15))";
      container.appendChild(iconWrapper);

      // Animate the icon
      animateIcon(iconWrapper, column, row);
    };

    // Function to animate a single icon - optimized for performance
    const animateIcon = (
      iconEl: HTMLDivElement,
      column: number,
      row: number
    ) => {
      const duration = 8 + Math.random() * 7; // Faster animation (was 15-30 seconds)
      const delay = Math.random() * 2 + row * 0.5; // Reduced delay (was 6 + row * 1.5)

      // Create timeline for this icon - use repeat: 0 instead of 1 to limit animation cycles
      const tl = gsap.timeline({
        repeat: 0,
        onComplete: () => {
          // Remove the element after animation completes to prevent memory leaks
          iconEl.remove();
        },
      });

      // Initial animation to make visible with delay
      tl.to(iconEl, {
        opacity: () => 0.4 + Math.random() * 0.25, // Lower opacity (0.4-0.65)
        duration: 0.3, // Faster fade-in (was 0.7)
        delay: delay,
      });

      // Main falling animation
      tl.to(
        iconEl,
        {
          y: container.offsetHeight + 200, // Move beyond the container
          duration: duration,
          ease: "power1.in",
        },
        "<" // Start at same time as opacity animation
      );

      // Add horizontal swaying - with reduced movement and complexity
      const swayAnim = gsap.to(iconEl, {
        x: () => (Math.random() < 0.5 ? -1 : 1) * Math.random() * 20, // Further reduced movement
        duration: () => 3 + Math.random() * 2, // Faster swaying (was 5 + random * 4)
        repeat: 1, // Reduce repeats
        yoyo: true,
        ease: "sine.inOut",
      });

      // Add gentle rotation - simplified
      const rotateAnim = gsap.to(iconEl, {
        rotation: () => (Math.random() < 0.5 ? 60 : -60), // Less rotation
        duration: () => 6 + Math.random() * 4, // Faster rotation (was 12 + random * 8)
        ease: "sine.inOut",
      });

      // Add animations to cleanup list
      animations.push(tl, swayAnim, rotateAnim);
    };

    // Create initial set of icons
    createIcons();

    // Create new icons less frequently
    const refreshInterval = setInterval(() => {
      // Check if container still exists
      if (!containerRef.current) {
        clearInterval(refreshInterval);
        return;
      }

      // Only create a single new icon each refresh to reduce overhead
      const randomPosition = Math.floor(Math.random() * 10);
      createIcon(randomPosition);

      // Remove excess icons to prevent memory issues
      const icons = container.querySelectorAll(".falling-icon");
      if (icons.length > 15) { // Lower max count for even better performance
        if (icons[0]) icons[0].remove();
      }
    }, 5000); // More frequent refreshes (was 10000)

    // Enhanced cleanup function
    return () => {
      clearInterval(refreshInterval);
      timeouts.forEach(clearTimeout);
      animations.forEach(anim => anim.kill());
      
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current.querySelectorAll(".falling-icon"));
        // Remove all falling icons
        containerRef.current.querySelectorAll(".falling-icon").forEach(el => el.remove());
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform"
      style={{ height: "150%", zIndex: "0" }}
    >
      {/* Background gradient orbs - simplified */}
      <div className="relative w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/4 to-indigo-500/4 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/4 to-fuchsia-500/4 rounded-full blur-3xl opacity-50" />

        {/* Gradient transitions */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent" />
        <div className="absolute inset-x-0 top-[45%] h-[30%] bg-gradient-to-b from-transparent via-white/20 to-white/70" />
        <div className="absolute inset-x-0 top-[65%] h-[35%] bg-gradient-to-b from-transparent via-white/80 to-white" />
        <div className="absolute inset-x-0 bottom-0 h-[5%] bg-white" />
      </div>
    </div>
  );
};

export default React.memo(AnimatedBackground);
