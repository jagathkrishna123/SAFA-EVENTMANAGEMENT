import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaUsers,
  FaUserAlt,
  FaBuilding,
  FaGraduationCap,
  FaArrowLeft,
  FaShieldAlt,
  FaInfoCircle,
  FaCheckCircle
} from "react-icons/fa";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const EventRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  // Team form state
  const [teamData, setTeamData] = useState({
    department: "",
    semester: "",
    members: [],
  });

  useEffect(() => {
    const loadInitialData = async () => {
      // 1. Load User
      const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
      if (!loggedInUser) {
        toast.error("Please login to register for events");
        navigate("/login");
        return;
      }
      if (loggedInUser.role === "teacher" || loggedInUser.role === "admin") {
        toast.warning("Instructional Staff are restricted from dynamic registration.");
        navigate(-1);
        return;
      }
      setUser(loggedInUser);

      try {
        // 2. Load Event
        const eventsRes = await axios.get(`${API_BASE_URL}/events`);
        const foundEvent = eventsRes.data.find((e) => e.id === Number(id));
        if (!foundEvent) {
          toast.error("Event not found");
          navigate(-1);
          return;
        }
        setEvent(foundEvent);

        // 2.5 Check if event is in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(foundEvent.date);
        if (eventDate < today) {
          setIsLimitReached(true);
          setLimitMessage("This event has already occurred. Registration is closed.");
        }

        // 3. Load Registrations
        const regsRes = await axios.get(`${API_BASE_URL}/registrations`);
        const allRegs = regsRes.data;
        setRegistrations(allRegs);

        // 4. Check if already registered
        const userRegsRes = await axios.get(`${API_BASE_URL}/registrations/user/${loggedInUser.id}`);
        const isAlreadyRegistered = userRegsRes.data.some(reg => Number(reg.eventId) === Number(foundEvent.id));

        if (isAlreadyRegistered) {
          setIsLimitReached(true);
          setLimitMessage("You are already registered for this event.");
        }

        // 5. Initialize Team Data
        if (foundEvent.participationType === "team") {
          setTeamData({
            department: loggedInUser.department || "",
            semester: loggedInUser.semester || "",
            members: Array.from(
              { length: Number(foundEvent.membersPerTeamFromDepartment) || 0 },
              (_, i) => i === 0
                ? { name: loggedInUser.name, regNo: loggedInUser.registerNumber }
                : { name: "", regNo: "" }
            ),
          });
        }

        // 6. Validate Limits
        checkLimits(foundEvent, loggedInUser, allRegs);
      } catch (error) {
        console.error("Load error:", error);
        toast.error("Failed to load registration data.");
      }
    };
    loadInitialData();
  }, [id, navigate]);

  const checkLimits = (event, user, allRegs) => {
    const eventRegs = allRegs.filter(r => r.eventId === event.id);

    if (event.participationType === "individual") {
      // Overall Limit
      if (event.overallIndividualLimit && eventRegs.length >= Number(event.overallIndividualLimit)) {
        setIsLimitReached(true);
        setLimitMessage("Registration closed. Maximum participant limit reached.");
        return;
      }

      // Department Limit
      const deptRegs = eventRegs.filter(r => r.teamData?.department === user.department || r.registeredUserDept === user.department);
      if (event.departmentIndividualLimit && deptRegs.length >= Number(event.departmentIndividualLimit)) {
        setIsLimitReached(true);
        setLimitMessage(`Your department (${user.department}) has reached its maximum slot limit.`);
      }
    } else {
      // Team Limits
      const deptTeams = eventRegs.filter(r => r.teamData?.department === user.department);
      if (event.teamsPerDepartment && deptTeams.length >= Number(event.teamsPerDepartment)) {
        setIsLimitReached(true);
        setLimitMessage(`Maximum teams allowed from your department (${user.department}) has been reached.`);
      }
    }
  };

  const handleMemberChange = (index, field, value) => {
    // Note: index 0 (Captain) allows updates only via initial load, but for others we allow ID update
    const updatedMembers = [...teamData.members];
    updatedMembers[index][field] = value;
    setTeamData(prev => ({ ...prev, members: updatedMembers }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLimitReached) {
      toast.error(limitMessage);
      return;
    }

    // Additional Team Validation
    if (event.participationType === "team") {
      const isComplete = teamData.members.every(m => m.regNo.trim() && m.name.trim());
      if (!isComplete) {
        toast.error("Please provide valid member IDs for all team members.");
        return;
      }
    }

    setShowConfirm(true);
  };

  const handleConfirmRegistration = async () => {
    setShowConfirm(false);

    const registrationData = {
      eventId: event.id,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      registeredUserDept: user.department,
      participationType: event.participationType,
      teamData: event.participationType === "team" ? teamData : null,
      status: "pending"
    };

    try {
      await axios.post(`${API_BASE_URL}/registrations`, registrationData);
      toast.success("Successfully Registered for " + event.eventName);
      navigate(-1);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.error || "Failed to submit registration.");
    }
  };

  if (!event || !user) return null;

  return (
    <div className="min-h-screen bg-[#03050C] text-gray-300 font-out p-6 md:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto pt-20">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 text-blue-400 mb-4 cursor-pointer hover:text-blue-300 transition-colors" onClick={() => navigate(-1)}>
              <FaArrowLeft className="text-sm" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Event</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-500 bg-clip-text text-transparent mb-2">
              Event Booking
            </h1>
            <p className="text-gray-500 font-medium tracking-tight">Securing your spot for <span className="text-white">{event.eventName}</span></p>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-3xl backdrop-blur-3xl">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${event.participationType === 'individual' ? 'bg-blue-600/20 text-blue-400' : 'bg-emerald-600/20 text-emerald-400'}`}>
              {event.participationType === 'individual' ? <FaUserAlt /> : <FaUsers />}
            </div>
            <div className="px-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Mode</p>
              <p className="font-bold text-white uppercase text-xs">{event.participationType}</p>
            </div>
          </div>
        </motion.div>

        {/* Limit Warning */}
        {isLimitReached && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 rounded-3xl bg-red-500/10 border border-red-500/20 flex gap-4 items-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <FaShieldAlt className="text-xl" />
            </div>
            <div>
              <p className="text-red-400 font-black text-xs uppercase tracking-widest mb-1">Registration Restricted</p>
              <p className="text-gray-400 text-sm font-medium">{limitMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Main Form Holder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          {/* Decorative Backglow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-violet-600/20 rounded-[3.5rem] blur-2xl opacity-50 -z-10"></div>

          <form onSubmit={handleSubmit} className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-xl p-8 md:p-12 shadow-2xl space-y-12">

            {/* User Credentials Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <FaUserAlt className="text-sm" />
                </div>
                <h2 className="text-lg font-black text-white tracking-tight font-medium md:font-extrabold">Personal Identity</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Full Name</label>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 font-bold flex items-center gap-3">
                    <FaUserAlt className="text-xs text-gray-600" />
                    {user.name}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Registration #</label>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 font-bold flex items-center gap-3 font-mono">
                    <FaShieldAlt className="text-xs text-gray-600" />
                    {user.registerNumber}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Department</label>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 font-bold flex items-center gap-3">
                    <FaBuilding className="text-xs text-gray-600" />
                    {user.department}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Semester</label>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 font-bold flex items-center gap-3">
                    <FaGraduationCap className="text-xs text-gray-600" />
                    {user.semester}
                  </div>
                </div>
              </div>
            </div>

            {/* Team Configuration Section */}
            {event.participationType === "team" && (
              <div className="space-y-8 pt-8 border-t border-white/5">
                <div className="flex flex-col items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <FaUsers className="text-sm" />
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tight font-medium md:font-extrabold">Combat Team Roster</h2>
                  </div>
                  <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                    {teamData.members.length} Members Needed
                  </span>
                </div>

                <div className="space-y-4">
                  {teamData.members.map((member, index) => (
                    <div key={index} className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-3xl border transition-all ${index === 0 ? 'bg-emerald-600/10 border-emerald-500/30' : 'bg-white/[0.02] border-white/5'}`}>

                      {/* Member ID Input */}
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 ml-1">
                          {index === 0 ? "Captain ID" : `Member ${index + 1} ID`}
                        </label>
                        <input
                          type="text"
                          placeholder="Registration #"
                          className="w-full p-4 rounded-2xl bg-[#0a0d1f] border border-white/10 text-white placeholder-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold font-mono disabled:opacity-50 uppercase"
                          value={member.regNo}
                          onChange={(e) => {
                            // Allow updating ID, triggers lookup
                            const newRegNo = e.target.value.toUpperCase();
                            handleMemberChange(index, "regNo", newRegNo);

                            // Auto-lookup logic
                            if (index !== 0 && newRegNo.length > 5) {
                              axios.get(`${API_BASE_URL}/users/lookup/${newRegNo}`)
                                .then(res => {
                                  if (res.data && res.data.name) {
                                    handleMemberChange(index, "name", res.data.name);
                                  } else {
                                    handleMemberChange(index, "name", "");
                                  }
                                }).catch(err => {
                                  console.error("Lookup error:", err);
                                  handleMemberChange(index, "name", "");
                                });
                            } else if (index !== 0) {
                              handleMemberChange(index, "name", "");
                            }
                          }}
                          disabled={index === 0}
                          required
                        />
                      </div>

                      {/* Member Name Display (Read-Only for members) */}
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 ml-1">
                          {index === 0 ? "Captain Name" : `Member ${index + 1} Name`}
                        </label>
                        <input
                          type="text"
                          placeholder={index === 0 ? "Full Name" : "Auto-filled from ID"}
                          className={`w-full p-4 rounded-2xl bg-[#0a0d1f] border border-white/10 text-white placeholder-gray-700 outline-none transition-all font-bold disabled:opacity-70 ${index !== 0 ? 'cursor-not-allowed text-gray-400' : ''}`}
                          value={member.name}
                          onChange={(e) => {
                            if (index === 0) handleMemberChange(index, "name", e.target.value);
                          }}
                          disabled={true} // Always disabled as it's auto-filled or captain (which is pre-filled from user)
                          required
                        />
                        {index !== 0 && member.regNo && !member.name && (
                          <p className="text-[10px] text-red-500 font-bold ml-1">User not found</p>
                        )}
                        {index !== 0 && member.name && (
                          <p className="text-[10px] text-emerald-500 font-bold ml-1">Verified: {member.name}</p>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Section */}
            <div className="pt-8 flex flex-col items-center gap-6">
              <button
                type="submit"
                disabled={isLimitReached}
                className={`w-full max-w-sm py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-[0.98] ${isLimitReached
                  ? "bg-gray-800 text-gray-600 cursor-not-allowed border border-white/5"
                  : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-blue-900/40"}`}
              >
                {isLimitReached ? "Booking Restricted" : "Commit Booking"}
              </button>

              <div className="flex items-center gap-2 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                <FaShieldAlt className="text-blue-500/50" />
                Aggregated Protocol SECURE
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* CONFIRMATION POPUP */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#02040A]/90 backdrop-blur-md flex items-center justify-center z-50 p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0A0D1F] border border-white/10 p-10 md:p-14 rounded-[3.5rem] max-w-lg w-full text-center space-y-8 shadow-3xl"
            >
              <div className="w-20 h-20 bg-blue-600/20 rounded-[2rem] flex items-center justify-center text-blue-500 mx-auto text-3xl">
                <FaInfoCircle />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-black text-white tracking-tight">Initialize Booking?</h2>
                <p className="text-gray-500 font-medium">You are about to register for <span className="text-white">{event.eventName}</span>. This action will be logged under your institutional record.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="py-5 rounded-3xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-black text-xs uppercase tracking-widest transition-all border border-white/10"
                >
                  Regret
                </button>
                <button
                  onClick={handleConfirmRegistration}
                  className="py-5 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40"
                >
                  Affirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventRegistration;
