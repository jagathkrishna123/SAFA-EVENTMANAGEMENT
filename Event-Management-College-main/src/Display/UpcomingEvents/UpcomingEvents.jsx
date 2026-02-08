import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaBolt,
    FaCheckCircle,
    FaLightbulb,
    FaStar,
} from "react-icons/fa";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Map to restore icons
const ICON_MAP = {
    "Bolt": FaBolt,
    "Check Circle": FaCheckCircle,
    "Lightbulb": FaLightbulb,
    "Star": FaStar,
};

export function UpcomingEvents() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/programs`);
                const storedPrograms = res.data;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const upcoming = storedPrograms.filter(prog => {
                    if (!prog.programDate) return false;
                    const progDate = new Date(prog.programDate);
                    return progDate >= today;
                });

                setEvents(upcoming);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
        fetchData();
    }, []);

    if (events.length === 0) {
        return (
            <div className="flex items-center justify-center w-full py-20 bg-black/10 rounded-3xl border border-white/5 mx-auto max-w-7xl">
                <p className="text-gray-500 font-medium">No upcoming programs available at the moment.</p>
            </div>
        );
    }

    // Duplicating items for seamless loop
    const displayedItems = [...events, ...events];

    return (
        <div className="relative w-full py-16 overflow-hidden font-out">
            <div className="max-w-7xl mx-auto px-6 mb-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-widest uppercase font-momo italic">
                                Upcoming Programs
                            </h2>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-1 ml-1">
                                Discover what's next in our college
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* === Infinite Auto-Scroll Carousel === */}
            <div className="w-full relative py-6 mask-fade-edges overflow-x-auto hover-pause">

                <div
                    className="flex flex-row gap-8 w-max px-4 animate-scroll"
                    style={{
                        display: 'flex',
                        "--scroll-width": `-${(events.length * 400) + (events.length * 32)}px`,
                        "--scroll-duration": `${events.length * 5}s`
                    }}
                >
                    {displayedItems.map((item, index) => (
                        <motion.div
                            key={`${item.id}-${index}`}
                            whileHover={{
                                y: -12,
                                scale: 1.02,
                                transition: { duration: 0.4, ease: "easeOut" }
                            }}
                            className="flex-shrink-0 flex flex-col mt-2 overflow-hidden w-[400px] rounded-[2rem] relative group bg-gradient-to-b from-gray-900/80 to-black border border-white/5 backdrop-blur-xl transition-all duration-500 hover:border-2 hover:border-blue-500/70 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                        >
                            {/* Background Image Container */}
                            <div
                                onClick={() => navigate(`/programdetails/${item.id}`)}
                                className="w-full h-[260px] cursor-pointer relative overflow-hidden"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                                    whileHover={{ scale: 1.15 }}
                                    transition={{ duration: 0.8 }}
                                    style={{
                                        backgroundImage: `url(${item.image || "https://images.unsplash.com/photo-1540575861501-7ad058ad382d?auto=format&fit=crop&q=80&w=800"})`,
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500"></div>

                                <div className="absolute top-6 left-6 flex gap-3">
                                    <span className="px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black text-white uppercase tracking-[0.15em] backdrop-blur-xl shadow-2xl border border-white/20">
                                        Active
                                    </span>
                                    {item.category && (
                                        <span className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-[0.15em] backdrop-blur-xl border border-white/10">
                                            {item.category}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Event Details Content */}
                            <div className="py-8 px-8 text-left flex flex-col gap-6">
                                <div>
                                    <h3 className="font-sans font-black text-white text-2xl group-hover:text-blue-400 transition-colors duration-300 mb-2 leading-tight">
                                        {item.name || "Upcoming Event"}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                            {item.department || "General Event"}
                                        </p>
                                    </div>
                                </div>

                                {/* Feature Pills */}
                                {/* {item.features && item.features.length > 0 && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {item.features.slice(0, 4).map((f, i) => {
                                            const IconComp = ICON_MAP[f.iconLabel] || FaBolt;
                                            return (
                                                <div key={i} className="flex items-center gap-3 text-[11px] text-gray-300 bg-white/[0.03] p-3 rounded-2xl border border-white/5 group-hover:bg-white/5 transition-all duration-300">
                                                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                                        <IconComp className="text-blue-500 text-sm" />
                                                    </div>
                                                    <span className="truncate font-bold tracking-wide uppercase">{f.name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )} */}

                                <div className="pt-2">
                                    <button
                                        onClick={() => navigate(`/programdetails/${item.id}`)}
                                        className="w-full py-4 bg-white/[0.05] hover:bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 border border-white/10 hover:border-blue-500 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]"
                                    >
                                        Explore Program
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .mask-fade-edges {
                    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                }
                .hover-pause:hover .animate-scroll {
                    animation-play-state: paused !important;
                }
                .animate-scroll {
                    animation: scroll-left var(--scroll-duration) linear infinite;
                }
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(var(--scroll-width)); }
                }
            `}</style>
        </div>
    );
}
