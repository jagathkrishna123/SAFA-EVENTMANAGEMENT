import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBolt,
  FaCheckCircle,
  FaLightbulb,
  FaStar,
  FaPlus,
  FaTrash,
  FaCloudUploadAlt,
  FaCalendarAlt,
  FaClock,
  FaClipboardList,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000/api";

const ICON_OPTIONS = [
  { label: "Bolt", value: FaBolt },
  { label: "Check Circle", value: FaCheckCircle },
  { label: "Lightbulb", value: FaLightbulb },
  { label: "Star", value: FaStar },
];

const CATEGORY_OPTIONS = [
  "Technical",
  "Cultural",
  "Sports",
  "Academic",
  // "Workshop & Training",
  // "Career & Placement",
  // "Social & Community",
  "Arts & Creativity"
];

const AddProgram = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const existingProgram = location.state?.programData || null;

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [brochure, setBrochure] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([]);

  const [featureIconLabel, setFeatureIconLabel] = useState("Bolt");
  const [featureName, setFeatureName] = useState("");

  useEffect(() => {
    if (existingProgram) {
      setName(existingProgram.Name);
      setTitle(existingProgram.Title);
      setCategory(existingProgram.category || "");
      setDate(existingProgram.programDate);
      setTime(existingProgram.programTime);
      setDescription(existingProgram.Description);
      setFeatures(existingProgram.features || []);
      setImagePreview(existingProgram.image);
    }
  }, [existingProgram]);

  const addFeature = () => {
    if (featureName.trim() === "") return;
    if (features.length >= 4) {
      alert("Maximum 4 features allowed");
      return;
    }
    setFeatures((prev) => [...prev, { iconLabel: featureIconLabel, name: featureName }]);
    setFeatureName("");
  };

  const removeFeature = (index) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageBase64 = imagePreview;
    if (image) {
      try {
        imageBase64 = await toBase64(image);
      } catch (error) {
        console.error("Error converting image:", error);
        alert("Error processing image");
        return;
      }
    }

    let brochureBase64 = null;
    if (brochure instanceof File) {
      try {
        brochureBase64 = await toBase64(brochure);
      } catch (error) {
        console.error("Error converting brochure:", error);
        alert("Error processing brochure");
        return;
      }
    } else if (existingProgram && existingProgram.brochure) {
      brochureBase64 = existingProgram.brochure;
    }

    const programData = {
      name: name,
      category: category,
      image: imageBase64,
      brochure: brochureBase64,
      title: title,
      programDate: date,
      programTime: time,
      description: description,
      features: features,
    };

    try {
      if (existingProgram) {
        await axios.put(`${API_BASE_URL}/programs/${existingProgram.id}`, programData);
        toast.success("Program refined successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/programs`, programData);
        toast.success("New program launched successfully!");
      }
      navigate(-1);
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.error || "Failed to save program details.");
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#03050F] p-4 md:p-10 font-out text-gray-300 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent mb-3">
            {existingProgram ? "Refine Program" : "Architect New Program"}
          </h1>
          <p className="text-gray-500 text-lg font-medium">Design the next big experience for the college community.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl space-y-10"
        >
          {/* Section 1: Core Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Program Identity</label>
                <input
                  type="text"
                  className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-bold text-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Advaya 2024"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Domain / Category</label>
                <select
                  className="w-full p-4 rounded-2xl bg-[#0a0d1f] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-bold cursor-pointer appearance-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" className="bg-gray-900">Select Domain</option>
                  {CATEGORY_OPTIONS.map((cat, index) => (
                    <option key={index} value={cat} className="bg-gray-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Headline / Slogan</label>
                <input
                  type="text"
                  className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-bold text-lg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="India’s largest student talent hunt"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-bold cursor-pointer"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Duration</label>
                  <input
                    type="text"
                    className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-bold"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="3 Days"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Media Assets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Cover Imagery</label>
              <div className="relative group overflow-hidden rounded-[2rem] bg-white/[0.02] border-2 border-dashed border-white/10 hover:border-cyan-500/30 transition-all aspect-video flex flex-col items-center justify-center p-6 text-center cursor-pointer">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    <div className="z-10 bg-black/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-white font-black text-xs uppercase tracking-widest group-hover:bg-cyan-600 transition-all">
                      Swap Image
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <FaCloudUploadAlt className="text-5xl text-gray-700 group-hover:text-cyan-500 transition-all mx-auto" />
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Drop or Select Event Poster</p>
                  </div>
                )}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImage(file);
                      const reader = new FileReader();
                      reader.onloadend = () => setImagePreview(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Official Brochure (PDF)</label>
              <div className="relative group overflow-hidden rounded-[2rem] bg-white/[0.02] border-2 border-dashed border-white/10 hover:border-indigo-500/30 transition-all aspect-video flex flex-col items-center justify-center p-6 text-center cursor-pointer">
                <FaClipboardList className="text-5xl text-gray-700 group-hover:text-indigo-500 transition-all mx-auto mb-4" />
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                  {brochure ? brochure.name : "Select Program PDF"}
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => setBrochure(e.target.files[0])}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Narrative */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Program Abstract / Narrative</label>
            <textarea
              className="w-full p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all h-40 resize-none font-medium text-lg leading-relaxed"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Craft a compelling story about this program..."
              required
            ></textarea>
          </div>

          {/* Section 4: Highlights Module */}
          <div className="bg-white/[0.03] p-8 md:p-10 rounded-[2.5rem] border border-white/10">
            <h2 className="text-xl font-black text-white mb-8 tracking-tight flex items-center gap-3">
              <span className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white text-xs"><FaBolt /></span>
              Strategic Highlights
            </h2>

            <div className="flex flex-col md:flex-row gap-6 mb-10">
              <div className="flex flex-col md:flex-row gap-4">
                <select
                  className="p-4 rounded-2xl bg-[#0a0d1f] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-bold appearance-none cursor-pointer px-6"
                  value={featureIconLabel}
                  onChange={(e) => setFeatureIconLabel(e.target.value)}
                >
                  {ICON_OPTIONS.map((item, i) => (
                    <option key={i} value={item.label}>{item.label}</option>
                  ))}
                </select>

                <input
                  type="text"
                  className="flex-1 p-4 rounded-2xl bg-[#03050F] border border-white/10 text-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-bold"
                  placeholder="e.g. Total Cash Prize ₹50K"
                  value={featureName}
                  onChange={(e) => setFeatureName(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={addFeature}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <FaPlus /> Add Highlight
              </button>
            </div>

            {/* Feature Stream */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence>
                {features.map((f, index) => {
                  const IconComp = ICON_OPTIONS.find(opt => opt.label === f.iconLabel)?.value || FaBolt;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex justify-between items-center bg-white/[0.03] p-5 rounded-2xl border border-white/5 group shadow-xl"
                    >
                      <div className="flex items-center gap-4 text-white">
                        <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500">
                          <IconComp />
                        </div>
                        <span className="font-bold text-sm tracking-wide uppercase">{f.name}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                      >
                        ✕
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {features.length === 0 && (
              <p className="text-gray-700 text-center py-6 font-bold uppercase text-[10px] tracking-widest border border-dashed border-white/5 rounded-2xl">
                No highlights added. Add up to 4 key features.
              </p>
            )}
          </div>

          {/* Action Hub */}
          <div className="pt-6 flex flex-col md:flex-row gap-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-5 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-3xl font-black text-sm uppercase tracking-widest transition-all border border-white/10"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="flex-[2] py-5 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl shadow-cyan-900/40 active:scale-[0.98]"
            >
              {existingProgram ? "Execute Update" : "Launch Program"}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default AddProgram;