import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

const OurPrograms = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [pastPrograms, setPastPrograms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/programs`);
        const allPrograms = res.data;

        // 2. Filter for Past Dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const history = allPrograms.filter(prog => {
          if (!prog.programDate) return false;
          const progDate = new Date(prog.programDate);
          return progDate < today;
        });

        // 3. Restore Icons
        const processed = history.map(p => ({
          ...p,
          features: (p.features || []).map(f => ({
            ...f,
            icon: ICON_MAP[f.iconLabel] || FaBolt
          }))
        }));

        setPastPrograms(processed);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const categories = [
    "All",
    "Technical",
    "Cultural",
    "Sports",
    "Academic",
    // "Workshop & Training",
    // "Career & Placement",
    // "Social & Community",
    "Arts & Creativity"
  ];

  // FILTER PROGRAMS BY CATEGORY
  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  const filteredPrograms = useMemo(() => {
    if (activeFilter === "All") {
      return pastPrograms;
    }
    return pastPrograms.filter(item => item.category === activeFilter);
  }, [activeFilter, pastPrograms]);

  // Navigate to details
  const handleCardClick = (id) => {
    navigate(`/programdetails/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-10 overflow-x-hidden min-h-screen font-out">
      <div className="flex flex-col w-full pt-24 md:pt-28">

        {/* SECTION TITLE */}
        <div className="w-full flex flex-col md:flex-row mt-8 px-1">
          <div className="flex flex-row md:flex-col items-center md:items-start justify-center md:justify-start">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[24px] md:text-[36px] font-bold font-lexend text-white"
            >
              <span className="text-cyan-400">Past Programs</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-400 mt-2 text-lg hidden md:block"
            >
              Explore our history of successful events and workshops
            </motion.p>
          </div>

          {/* FILTER BUTTONS */}
          <div className="w-full flex flex-wrap justify-center gap-4 mt-6">
            {categories.map((category) => {
              const isActive = activeFilter === category

              return (
                <motion.button
                  key={category}
                  onClick={() => handleFilterChange(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
          px-6 py-2.5
          rounded-full
          text-sm font-semibold
          tracking-wide
          transition-all duration-300
          backdrop-blur-md
          h-fit
          ${isActive
                      ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                      : "bg-slate-800/60 text-gray-300 hover:bg-slate-700/60 hover:text-white"
                    }
        `}
                >
                  {category}
                </motion.button>
              )
            })}
          </div>

        </div>

        {/* PROGRAMS GRID */}
        {filteredPrograms.length > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mt-10">
            {filteredPrograms.map((item) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                key={item.id}
                onClick={() => handleCardClick(item.id)}
                className="flex flex-col rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border border-slate-600 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer group overflow-hidden"
              >
                {/* IMAGE */}
                <div className="w-full overflow-hidden rounded-t-2xl relative">
                  <img
                    src={item.image || "https://via.placeholder.com/400x300"}
                    alt={item.name}
                    className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute top-4 left-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm px-3 py-1 rounded-full font-semibold shadow-lg">
                    {item.name}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {item.category}
                  </div>
                </div>

                {/* PROGRAM DETAILS */}
                <div className="flex flex-col w-full p-5 md:p-6 gap-3 md:gap-4">

                  {/* TITLE */}
                  <div>
                    <h3 className="font-bold text-lg md:text-xl text-white mb-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        📅 {item.programDate}
                      </span>
                      <span className="flex items-center gap-1">
                        ⏰ {item.programTime}
                      </span>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {(item.description || "").substring(0, 150)}...
                  </p>

                  {/* FEATURES */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.features && item.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded-lg text-xs text-cyan-300">
                        <span className="text-cyan-400">{feature.icon && React.createElement(feature.icon)}</span>
                        <span>{feature.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* VIEW DETAILS BUTTON */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(item.id);
                    }}
                    className="mt-4 w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                  >
                    View
                  </motion.button>

                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
            <p className="text-xl">No past programs found.</p>
            <p className="text-sm mt-2">Events that happened before today will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default OurPrograms;
