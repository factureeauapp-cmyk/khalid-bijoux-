"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    // Main Dot position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Follower position with smooth spring physics
    const springConfig = { damping: 20, stiffness: 250, mass: 0.5 };
    const followerX = useSpring(mouseX, springConfig);
    const followerY = useSpring(mouseY, springConfig);

    useEffect(() => {
        setMounted(true);

        const handleMouseMove = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseDown = () => setIsClicked(true);
        const handleMouseUp = () => setIsClicked(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive = target.closest('a, button, input, select, .interactive');
            setIsHovering(!!isInteractive);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [isVisible, mouseX, mouseY]);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Main Dot */}
                    <motion.div
                        className="fixed top-0 left-0 w-2 h-2 bg-[#C9A84C] rounded-full pointer-events-none z-[10000] mix-blend-difference"
                        style={{
                            x: mouseX,
                            y: mouseY,
                            translateX: "-50%",
                            translateY: "-50%",
                        }}
                        animate={{
                            scale: isClicked ? 0.8 : isHovering ? 0 : 1,
                            opacity: isHovering ? 0 : 1
                        }}
                    />

                    {/* Follower Ring */}
                    <motion.div
                        className="fixed top-0 left-0 rounded-full border border-[#C9A84C] pointer-events-none z-[9999]"
                        style={{
                            x: followerX,
                            y: followerY,
                            translateX: "-50%",
                            translateY: "-50%",
                            width: 30,
                            height: 30,
                        }}
                        animate={{
                            scale: isClicked ? 1.5 : isHovering ? 2.5 : 1,
                            backgroundColor: isHovering ? "rgba(201, 168, 76, 0.15)" : "rgba(201, 168, 76, 0)",
                            borderColor: isHovering ? "rgba(201, 168, 76, 0.8)" : "rgba(201, 168, 76, 0.4)",
                            borderWidth: isHovering ? "2px" : "1px",
                        }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                            mass: 0.1
                        }}
                    >
                        {/* Glow effect when hovering */}
                        {isHovering && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(201,168,76,0.3)]"
                            />
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
