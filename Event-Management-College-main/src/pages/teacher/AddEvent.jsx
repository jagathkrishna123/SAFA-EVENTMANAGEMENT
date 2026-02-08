import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserTie,
  FaUsers,
  FaImage,
  FaTrophy,
  FaRegHandshake,
  FaPlus,
  FaTag,
  FaCloudUploadAlt
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000/api";

const AddEvent = () => {
  const [programs, setPrograms] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [eventData, setEventData] = useState({
    programName: "",
    programId: "",
    eventName: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    latitude: "",
    longitude: "",
    incharge: "",
    department: "",
    limit: "",

    // Images
    poster: null,
    priceImage: null,
    sponsorImages: [],

    // Participation
    participationType: "individual",
    overallIndividualLimit: "",
    departmentIndividualLimit: "",
    membersPerTeamFromDepartment: "",
    teamsPerDepartment: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programsRes, teachersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/programs`),
          axios.get(`${API_BASE_URL}/registered-teachers`)
        ]);
        setPrograms(programsRes.data);
        setTeachers(teachersRes.data);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load dependency data.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProgramSelect = (e) => {
    const selectedId = Number(e.target.value);
    const selectedProgram = programs.find(p => p.id === selectedId);
    if (selectedProgram) {
      setEventData(prev => ({
        ...prev,
        programName: selectedProgram.name,
        programId: selectedProgram.id
      }));
    }
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handlePosterImage = async (e) => {
    if (e.target.files[0]) {
      const base64 = await toBase64(e.target.files[0]);
      setEventData((prev) => ({ ...prev, poster: base64 }));
    }
  };

  const handlePriceImage = async (e) => {
    if (e.target.files[0]) {
      const base64 = await toBase64(e.target.files[0]);
      setEventData((prev) => ({ ...prev, priceImage: base64 }));
    }
  };

  const handleSponsorImages = async (e) => {
    const files = Array.from(e.target.files);
    const base64Files = await Promise.all(files.map(f => toBase64(f)));
    setEventData((prev) => ({
      ...prev,
      sponsorImages: [...prev.sponsorImages, ...base64Files].slice(0, 3),
    }));
  };

  const removeSponsorImage = (index) => {
    setEventData((prev) => ({
      ...prev,
      sponsorImages: prev.sponsorImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventData.programId) {
      toast.error("Please select a program");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/events`, {
        ...eventData,
        status: "pending"
      });
      toast.success("Event created successfully! Sent for approval.");
      // Clear form
      setEventData({
        programName: eventData.programName,
        programId: eventData.programId,
        eventName: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        venue: "",
        latitude: "",
        longitude: "",
        incharge: "",
        department: "",
        limit: "",
        poster: null,
        priceImage: null,
        sponsorImages: [],
        participationType: "individual",
        overallIndividualLimit: "",
        departmentIndividualLimit: "",
        membersPerTeamFromDepartment: "",
        teamsPerDepartment: "",
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.error || "Failed to save event.");
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#03050F] p-4 md:p-10 font-out text-gray-300 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-[30px] md:text-6xl font-black bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-500 bg-clip-text text-transparent mb-3">
              Orchestrate Event
            </h1>
            <p className="text-gray-500 text-[16px] md:text-lg font-medium">Fine-tune the parameters of your college experience.</p>
          </motion.div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 md:p-14 rounded-[3.5rem] shadow-2xl space-y-14"
        >
          {/* Section 1: Core Configuration */}
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 border border-blue-500/20">
                <FaCalendarAlt />
              </div>
              <h2 className="text-lg md:text-2xl font-black text-white tracking-tight font-medium md:font-extrabold">Core Configuration</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Parent Program</label>
                  <select
                    className="w-full p-4 rounded-2xl bg-[#0a0d1f] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold cursor-pointer appearance-none"
                    onChange={handleProgramSelect}
                    value={eventData.programId || ""}
                  >
                    <option value="" disabled className="bg-gray-900">Select Program</option>
                    {programs.map((prog) => (
                      <option key={prog.id} value={prog.id} className="bg-gray-900">
                        {prog.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Event Name</label>
                  <input
                    type="text"
                    name="eventName"
                    value={eventData.eventName}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-lg"
                    placeholder="e.g. Code Sprint"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Detailed Synopsis</label>
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all h-[152px] resize-none font-medium leading-relaxed"
                  placeholder="Describe the objective and format of this event..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Logistics */}
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <FaClock />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight text-lg md:text-2xl font-medium md:font-extrabold">Timeline & Location</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={eventData.startTime}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={eventData.endTime}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Venue Name</label>
                <input
                  type="text"
                  name="venue"
                  value={eventData.venue}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                  placeholder="Seminar Hall 1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Geographical Offsets (Lat, Lng)</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={eventData.latitude}
                    onChange={handleChange}
                    placeholder="Latitude"
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
                  />
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={eventData.longitude}
                    placeholder="Longitude"
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Host Department</label>
                <input
                  type="text"
                  name="department"
                  value={eventData.department}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                  placeholder="CS & Engineering"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Governance */}
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-violet-600/20 rounded-full flex items-center justify-center text-violet-400 border border-violet-500/20">
                <FaUserTie />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight font-medium md:font-extrabold text-lg md:text-2xl">Event Stewardship</h2>
            </div>

            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem]">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 block ml-1 text-center">Assign Event Incharges</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {teachers.length === 0 ? (
                  <p className="col-span-full text-center text-gray-600 font-bold py-10 uppercase tracking-widest text-xs">No registered teachers found in system.</p>
                ) : (
                  teachers.map((teacher) => {
                    const isSelected = eventData.incharge.split(", ").includes(teacher.name);
                    return (
                      <label
                        key={teacher.id}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${isSelected ? 'bg-violet-600/20 border-violet-500/50' : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                          }`}
                      >
                        <input
                          type="checkbox"
                          value={teacher.name}
                          checked={isSelected}
                          onChange={(e) => {
                            const name = e.target.value;
                            const currentIncharges = eventData.incharge ? eventData.incharge.split(", ") : [];
                            let newIncharges = e.target.checked ? [...currentIncharges, name] : currentIncharges.filter(i => i !== name);
                            setEventData(prev => ({ ...prev, incharge: newIncharges.join(", ") }));
                          }}
                          className="hidden"
                        />
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-500 group-hover:text-gray-300'
                          }`}>
                          <FaUserTie />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className={`font-bold text-sm truncate ${isSelected ? 'text-white' : 'text-gray-400'}`}>{teacher.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium truncate uppercase tracking-tighter">{teacher.department}</p>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
              <p className="text-[10px] font-black text-violet-400 mt-6 text-center uppercase tracking-widest">Selected: {eventData.incharge || "None"}</p>
            </div>
          </div>

          {/* Section 4: Participation Mechanics */}
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <FaUsers />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight text-lg md:text-2xl font-medium md:font-extrabold">Participation Protocols</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 block ml-1">Archetypex</label>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setEventData(prev => ({ ...prev, participationType: "individual" }))}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${eventData.participationType === "individual" ? 'bg-emerald-600/20 border-emerald-500' : 'bg-white/[0.02] border-white/5 grayscale opacity-40'
                      }`}
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">👤</div>
                    <span className="font-black text-xs uppercase tracking-[0.2em] text-white">Individual</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventData(prev => ({ ...prev, participationType: "team" }))}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${eventData.participationType === "team" ? 'bg-emerald-600/20 border-emerald-500' : 'bg-white/[0.02] border-white/5 grayscale opacity-40'
                      }`}
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">👥</div>
                    <span className="font-black text-xs uppercase tracking-[0.2em] text-white">Group / Team</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {eventData.participationType === "individual" ? (
                    <motion.div
                      key="individual"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                    >
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Global Limit</label>
                        <input
                          type="number"
                          name="overallIndividualLimit"
                          value={eventData.overallIndividualLimit}
                          onChange={handleChange}
                          className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-bold"
                          placeholder="e.g. 100"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Per Department</label>
                        <input
                          type="number"
                          name="departmentIndividualLimit"
                          value={eventData.departmentIndividualLimit}
                          onChange={handleChange}
                          className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-bold"
                          placeholder="e.g. 10"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="team"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                    >
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Teams Per Dept.</label>
                        <input
                          type="number"
                          name="teamsPerDepartment"
                          value={eventData.teamsPerDepartment}
                          onChange={handleChange}
                          className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-bold"
                          placeholder="e.g. 2"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Members / Team</label>
                        <input
                          type="number"
                          name="membersPerTeamFromDepartment"
                          value={eventData.membersPerTeamFromDepartment}
                          onChange={handleChange}
                          className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-bold"
                          placeholder="e.g. 4"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Section 5: Visual Brand */}
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-pink-600/20 rounded-full flex items-center justify-center text-pink-400 border border-pink-500/20">
                <FaImage />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight font-medium md:font-extrabold text-lg md:text-2xl">Visual Identity & Recognition</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Event Poster */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block ml-1">Master Poster</label>
                <div className="relative group aspect-square rounded-[2rem] bg-white/[0.02] border-2 border-dashed border-white/10 hover:border-blue-500/30 transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer overflow-hidden">
                  {eventData.poster ? (
                    <img src={eventData.poster} className="absolute inset-0 w-full h-full object-cover" alt="Poster" />
                  ) : (
                    <div className="space-y-3">
                      <FaCloudUploadAlt className="text-3xl text-gray-700 group-hover:text-blue-400 transition-all mx-auto" />
                      <p className="text-gray-600 font-bold uppercase text-[8px] tracking-[0.2em]">Upload JPG/PNG</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePosterImage} />
                </div>
              </div>

              {/* Price Image */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block ml-1">Grand Prize</label>
                <div className="relative group aspect-square rounded-[2rem] bg-white/[0.02] border-2 border-dashed border-white/10 hover:border-amber-500/30 transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer overflow-hidden">
                  {eventData.priceImage ? (
                    <img src={eventData.priceImage} className="absolute inset-0 w-full h-full object-cover" alt="Price" />
                  ) : (
                    <div className="space-y-3">
                      <FaTrophy className="text-3xl text-gray-700 group-hover:text-amber-500 transition-all mx-auto" />
                      <p className="text-gray-600 font-bold uppercase text-[8px] tracking-[0.2em]">Upload Trophy Asset</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePriceImage} />
                </div>
              </div>

              {/* Sponsors */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block ml-1">Sponsors (Max 3)</label>
                <div className="relative group aspect-square rounded-[2rem] bg-white/[0.02] border-2 border-dashed border-white/10 hover:border-pink-500/30 transition-all p-4 flex flex-col justify-center gap-3 overflow-hidden">
                  <div className="grid grid-cols-2 gap-2 h-full">
                    {eventData.sponsorImages.map((img, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden border border-white/10 aspect-square">
                        <img src={img} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeSponsorImage(i)}
                          className="absolute -top-1 -right-1 bg-red-600 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {eventData.sponsorImages.length < 3 && (
                      <div className="relative rounded-xl overflow-hidden border border-dashed border-white/10 aspect-square flex items-center justify-center opacity-30 group-hover:opacity-100 transition-all">
                        <FaRegHandshake className="text-xl" />
                        <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleSponsorImages} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Suite */}
          <div className="pt-10 flex flex-col md:flex-row gap-6">
            <button
              type="submit"
              className="flex-1 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] transition-all shadow-2xl shadow-blue-900/40 active:scale-[0.98]"
            >
              Deploy Event
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default AddEvent;
