import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaUser,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaTrophy,
  FaHandshake,
  FaInfoCircle,
  FaCheckCircle,
  FaTimes,
  FaArrowLeft,
  FaChevronRight,
  FaIdCard
} from "react-icons/fa";
import { BiWorld } from "react-icons/bi";
import { toast } from "react-toastify";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isTeacher = user.role === "teacher" || user.role === "admin";

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/events`);
        const foundEvent = res.data.find((e) => e.id === Number(id));
        setEvent(foundEvent);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchEvent();
  }, [id]);

  const [isRegistered, setIsRegistered] = useState(false);
  useEffect(() => {
    const checkRegistration = async () => {
      if (!user.id || !event) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/registrations/user/${user.id}`);
        const registered = res.data.some(r => Number(r.eventId) === Number(event.id));
        setIsRegistered(registered);
      } catch (error) {
        console.error("Check registration error:", error);
      }
    };
    checkRegistration();
  }, [user.id, event]);

  const isPastEvent = () => {
    if (!event) return false;
    return new Date(event.date) < new Date().setHours(0, 0, 0, 0);
  };

  const handleRegister = () => {
    if (!event) return;

    if (isTeacher) {
      toast.warning("Instructional Staff are restricted from dynamic registration.");
      return;
    }

    if (isPastEvent()) {
      toast.error("This event has already occurred. Registration is closed.");
      return;
    }

    if (isRegistered) {
      toast.info("Registration index already exists for your profile.");
      return;
    }

    if (event.participationType === "individual") {
      setShowConfirm(true);
    } else {
      navigate(`/event/${event.id}/register`);
    }
  };

  const handleConfirmIndividual = async () => {
    setShowConfirm(false);

    const registrationData = {
      eventId: event.id,
      userId: user.id || null,
      userName: user.name || "Guest",
      userEmail: user.email || null,
      registeredUserDept: user.department || "Unknown",
      participationType: "individual",
      teamData: null,
      status: "confirmed"
    };

    try {
      await axios.post(`${API_BASE_URL}/registrations`, registrationData);
      setIsRegistered(true);
      toast.success("Enrolled Successfully! Access your dashboard for details.");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.error || "Failed to submit registration.");
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-[#03050F] flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 border-4 border-blue-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-6 shadow-lg shadow-cyan-500/20"></div>
          <p className="text-gray-400 text-xl font-black uppercase tracking-[0.3em] animate-pulse">Syncing Event Data</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03050F] font-out text-gray-300 selection:bg-cyan-500/30">
      {/* Background Visuals */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        {/* Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase font-black text-[10px] tracking-[0.3em] mb-12 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Spectrum
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {/* Project Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-[3rem] overflow-hidden group shadow-2xl border border-white/10"
            >
              <div className="aspect-[21/9] relative">
                <img
                  src={event.poster || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200"}
                  alt={event.eventName}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03050F] via-[#03050F]/40 to-transparent"></div>
              </div>

              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap items-center gap-3 mb-6"
                >
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-500/20">
                    {event.department}
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
                    {event.participationType}
                  </span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
                  {event.eventName}
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl font-medium leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>

            {/* Event Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5">
                    <FaCalendarAlt className="text-xl" />
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-widest">Event Timeline</h3>
                </div>
                <div className="space-y-4">
                  <StatItem icon={FaCalendarAlt} label="Event Date" value={event.date} />
                  <StatItem icon={FaClock} label="Operational Window" value={`${event.startTime} - ${event.endTime}`} />
                  <StatItem icon={FaCheckCircle} label="Participation" value={event.participationType} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                    <FaMapMarkerAlt className="text-xl" />
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-widest">Event Location</h3>
                </div>
                <div className="space-y-4">
                  <StatItem icon={FaMapMarkerAlt} label="Sector / Venue" value={event.venue} />
                  <StatItem icon={FaUsers} label="Slot Capacity" value={event.limit || "Unrestricted"} />
                  <StatItem icon={FaIdCard} label="Project Manager" value={event.incharge} />
                </div>
              </motion.div>
            </div>

            {/* Prizes / Rewards Section */}
            {event.priceImage && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem]"
              >
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 border border-amber-500/20">
                    <FaTrophy />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Honor & Recognition</h2>
                </div>
                <div className="relative group overflow-hidden rounded-[2rem] border border-white/10 bg-black/20">
                  <img
                    src={event.priceImage}
                    alt="Price Details"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              </motion.section>
            )}

            {/* Location Matrix */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem]"
            >
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                    <BiWorld size={20} />
                  </div>
                  <h2 className="text-lg md:text-2xl font-black text-white uppercase tracking-[0.2em]">Geospatial Data</h2>
                </div>
                <button
                  onClick={() => window.open(`https://www.google.com/maps?q=${event.latitude},${event.longitude}`, '_blank')}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-3 active:scale-95"
                >
                  <FaChevronRight /> Link Interface
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-black/20 rounded-3xl border border-white/5">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 text-center">Latitude Index</p>
                  <p className="text-xl font-bold text-white tracking-widest text-center">{event.latitude}</p>
                </div>
                <div className="border-l border-white/10">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 text-center">Longitude Index</p>
                  <p className="text-xl font-bold text-white tracking-widest text-center">{event.longitude}</p>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-8">
              {/* Enrollment Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] text-center shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <FaIdCard size={120} />
                </div>

                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/20">
                  <FaUsers className="text-white text-3xl" />
                </div>

                <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-4">Event Enrollment</h3>
                <p className="text-gray-500 text-sm font-medium mb-12">Submit your credentials to secure participation in this event.</p>

                <div className="space-y-4">
                  {isPastEvent() ? (
                    <div className="w-full py-5 rounded-[2rem] bg-gray-900 border border-white/5 text-gray-600 font-black text-xs uppercase tracking-[0.2em] shadow-inner">
                      Operation Closed
                    </div>
                  ) : isTeacher ? (
                    <div className="w-full py-5 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 text-amber-500 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                      <FaChalkboardTeacher /> Student Access Only
                    </div>
                  ) : isRegistered ? (
                    <div className="w-full py-5 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                      <FaCheckCircle /> Access Secured
                    </div>
                  ) : (
                    <button
                      onClick={handleRegister}
                      className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-[2rem] transition-all font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                    >
                      Register Now
                    </button>
                  )}
                </div>

                <div className="mt-12 pt-12 border-t border-white/10 space-y-6">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Network Group</span>
                    <span className="text-white">{event.participationType}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Sector Load</span>
                    <span className="text-white">{event.limit || "UNLIMITED"}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Status</span>
                    <span className="text-emerald-500 animate-pulse">Operational</span>
                  </div>
                </div>
              </motion.div>

              {/* Sponsor Hub */}
              {event.sponsorImages?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem]"
                >
                  <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-8 text-center flex items-center justify-center gap-4">
                    <span className="w-6 h-[1px] bg-gray-800"></span> Corporate Partners <span className="w-6 h-[1px] bg-gray-800"></span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {event.sponsorImages.map((img, i) => (
                      <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center justify-center h-20 hover:border-white/10 transition-colors">
                        <img src={img} alt="Partner" className="max-h-12 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Overlay */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#0A0D1F] border border-white/10 p-12 rounded-[3.5rem] max-w-lg w-full text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-blue-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-blue-500/20 text-blue-400">
                <FaInfoCircle size={40} />
              </div>

              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Validate Enrollment</h2>
              <p className="text-gray-400 font-medium mb-12">You are about to initiate an individual enrollment session for <span className="text-white">{event.eventName}</span>. Confirm to commit data.</p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-3xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                >
                  Discard
                </button>
                <button
                  onClick={handleConfirmIndividual}
                  className="flex-1 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                >
                  Authenticate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 group">
    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all">
      <Icon />
    </div>
    <div>
      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">{label}</p>
      <p className="text-white font-bold tracking-wide">{value}</p>
    </div>
  </div>
);

export default EventDetails;
