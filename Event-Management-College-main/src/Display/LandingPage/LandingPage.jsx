//https://hackcbs.tech/

import time from "../../assets/time.svg";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Items } from "../../Constants/ProgramData";
import { useNavigate } from "react-router-dom";
import Bgimage from "../../assets/bground.svg"

export function LandingPage() {

    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate()

    const scrollToIndex = (index) => {
        const carousel = carouselRef.current;
        if (carousel) {
            const child = carousel.children[index];
            if (child) {
                carousel.scrollTo({
                    left: child.offsetLeft,
                    behavior: "smooth",
                });
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % Items.length;
            setCurrentIndex(nextIndex);
            scrollToIndex(nextIndex);
        }, 4000); 

        return () => clearInterval(interval);
    }, [currentIndex, Items.length]);

    return (
            <div className="flex items-center justify-center w-full min-h-screen relative overflow-hidden pt-[70px]">

            {/* Dark Blue Gradient Background - Matching reference image and navbar */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-transparent to-blue-900/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
           

            
            <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-2 gap-6 relative z-10">

                {/* === Heading === */}
                <motion.div 
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex items-center justify-center w-full text-center"
                >
                    <h1 className="font-momo font-bold text-white text-[40px] md:text-[56px] lg:text-[64px] leading-tight">
                        Welcome to <span className="text-cyan-300">DocketX</span>
                    </h1>
                </motion.div>

            </div>
        </div>
    );
}
