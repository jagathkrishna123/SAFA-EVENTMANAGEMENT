import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Sparkles, Target, Zap, Award } from "lucide-react";
import {
  FaBolt,
  FaCheckCircle,
  FaLightbulb,
  FaStar,
} from "react-icons/fa";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Map to restore icons from localStorage string labels
const ICON_MAP = {
  "Bolt": FaBolt,
  "Check Circle": FaCheckCircle,
  "Lightbulb": FaLightbulb,
  "Star": FaStar,
};

// Map for default lucide icons for specific features if needed
const FEATURE_DEFAULTS = [Sparkles, Target, Zap, Award];

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(null);
  const [linkedEvents, setLinkedEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Program from backend
        // Note: Using GET /api/programs and finding by ID since we don't have a single GET /api/programs/:id yet
        // but it's better to implement one. For now, filter local result to avoid backend changes if possible.
        const res = await axios.get(`${API_BASE_URL}/programs`);
        const selectedItem = res.data.find((item) => item.id === Number(id));

        if (selectedItem) {
          // Restore icons from labels (features are already parsed JSON from backend)
          const featuresWithIcons = (selectedItem.features || []).map(f => ({
            ...f,
            icon: ICON_MAP[f.iconLabel] || FaBolt
          }));
          setShowDetail({ ...selectedItem, features: featuresWithIcons });

          // Fetch Events linked to this program
          try {
            const eventsRes = await axios.get(`${API_BASE_URL}/events`);
            const programEvents = eventsRes.data.filter(e => e.programId === Number(id));
            setLinkedEvents(programEvents);
          } catch (e) {
            console.error("Events fetch error:", e);
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleDownload = () => {
    if (!showDetail.brochure || typeof showDetail.brochure !== 'string') {
      alert("No valid brochure available for this program. Please re-upload the brochure in the admin panel.");
      return;
    }

    try {
      // If it's a base64 data URL (matching common PDF mime types or generic data URIs)
      const isDataUrl = showDetail.brochure.startsWith('data:');

      if (isDataUrl) {
        const link = document.createElement('a');
        link.href = showDetail.brochure;
        // Clean filename for different OS/browsers
        const safeName = (showDetail.Name || 'Program').replace(/[^a-z0-9]/gi, '_');
        link.setAttribute('download', `${safeName}_Brochure.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (showDetail.brochure.startsWith('http')) {
        // Fallback for direct URLs
        window.open(showDetail.brochure, '_blank');
      } else {
        alert("The brochure format is invalid. Please re-upload it.");
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download brochure. If the file is very large, it might have been corrupted during storage.");
    }
  };

  return showDetail ? (
    <div className="min-h-screen bg-gradient-to-br from-[#03050F] via-[#0a0d1f] to-[#03050F] text-white font-out relative overflow-hidden pt-20 px-3">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full p-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {/* Date Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm mb-8">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-300 font-medium text-sm">
              {showDetail.programDate} • {showDetail.programTime}
            </span>
          </div>

          {/* Program Name */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent leading-tight">
            {showDetail.Name}
          </h1>

          {/* Program Title */}
          <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed mb-10">
            {showDetail.Title}
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button
              onClick={handleDownload}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-1"
            >
              <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Download Brochure
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full mb-24 relative">
          <div className="text-center mb-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
            >
              <Sparkles className="w-3 h-3" /> Core Advantages
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Program Highlights
            </h2>
            <p className="text-gray-400 text-lg font-medium">Engineered for excellence and student success</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {showDetail.features && showDetail.features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                className="group relative"
              >
                <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
                <div className="relative h-full flex flex-col items-center text-center p-8 rounded-[2rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 group-hover:border-blue-500/50 group-hover:bg-white/[0.05] transition-all duration-500">
                  {/* Icon Container */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 group-hover:border-blue-400/50 group-hover:scale-110 transition-all duration-500 mb-6 shadow-xl">
                    <feature.icon className="text-blue-400 text-2xl group-hover:text-blue-200 transition-colors" />
                  </div>

                  {/* Feature Name */}
                  <h3 className="text-white font-black text-xs uppercase tracking-[0.15em] leading-tight flex-1">
                    {feature.name}
                  </h3>

                  {/* Subtle Decorative Line */}
                  <div className="w-8 h-[1px] bg-gradient-to-r from-blue-500 to-purple-500 mt-4 opacity-30 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* About Section */}
        <div className="w-full max-w-7xl mx-auto mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Description */}
            <div className="order-2 lg:order-1">
              <div className="mb-6">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-6">
                  About the {showDetail.Name}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {showDetail.Description}
                </p>
                <div className="flex flex-wrap gap-4 mt-8">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-300 text-sm font-medium">Expert Mentorship</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-300 text-sm font-medium">Hands-on Learning</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-cyan-300 text-sm font-medium">Industry Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl opacity-75 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>

                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
                  <img
                    src={showDetail.image || "https://via.placeholder.com/600x400"}
                    alt={showDetail.Name}
                    className="w-full h-80 md:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Featured
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Related Events Section */}
      {linkedEvents.length > 0 && (
        <div className="w-full max-w-7xl mx-auto mb-20 px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Events under {showDetail.Name}
            </h2>
            <p className="text-gray-400 text-lg">Discover exciting opportunities within this program</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {linkedEvents.map(event => (
              <div
                key={event.id}
                onClick={() => navigate(`/eventdetails/${event.id}`)}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-blue-500/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={event.poster || "https://via.placeholder.com/300"}
                    alt={event.eventName}
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Active
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-300">
                    {event.eventName}
                  </h3>
                  <p className="text-blue-300 text-sm font-medium mb-3">
                    {event.department}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                    {event.description}
                  </p>

                  {/* CTA Indicator */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-400">Click to explore</span>
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                      <svg className="w-3 h-3 text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-[#03050F] via-[#0a0d1f] to-[#03050F] flex justify-center items-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-300 text-lg font-medium animate-pulse">Loading program details...</p>
        <button onClick={() => navigate("/")} className="mt-4 text-blue-400 hover:text-blue-300 underline">Back to Home</button>
      </div>
    </div>
  );
};

export default ProgramDetails;
