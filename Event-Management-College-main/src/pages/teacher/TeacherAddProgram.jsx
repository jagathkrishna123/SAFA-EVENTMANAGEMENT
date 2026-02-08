
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBolt,
  FaCheckCircle,
  FaLightbulb,
  FaStar,
  FaCalendarAlt,
  FaClock,
  FaTag,
  FaInfoCircle,
  FaCloudUploadAlt,
  FaPlus,
  FaTrash,
  FaImage,
  FaFilePdf
} from "react-icons/fa";
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

const TeacherAddProgram = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [brochure, setBrochure] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([]);

  const [featureIcon, setFeatureIcon] = useState(FaBolt);
  const [featureIconLabel, setFeatureIconLabel] = useState("Bolt");
  const [featureName, setFeatureName] = useState("");

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

  // Helper to convert file to Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageBase64 = null;
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
    if (brochure) {
      try {
        brochureBase64 = await toBase64(brochure);
      } catch (error) {
        console.error("Error converting brochure:", error);
        alert("Error processing brochure");
        return;
      }
    }

    const newProgram = {
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
      await axios.post(`${API_BASE_URL}/programs`, newProgram);
      toast.success("Program created successfully and saved!");

      // Reset form
      setName("");
      setTitle("");
      setCategory("");
      setImage(null);
      setBrochure(null);
      setDate("");
      setTime("");
      setDescription("");
      setFeatures([]);
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.error || "Failed to save program.");
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
              Add New Program
            </h1>
            <p className="text-gray-500 text-lg font-medium">Create and configure a flagship experience.</p>
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
              <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                <FaTag />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Core Configuration</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Program Name</label>
                  <input
                    type="text"
                    className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-lg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. InnovateX 2026"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Category</label>
                  <select
                    className="w-full p-4 rounded-2xl bg-[#0a0d1f] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold cursor-pointer appearance-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled className="bg-gray-900">Select Category</option>
                    {CATEGORY_OPTIONS.map((cat, index) => (
                      <option key={index} value={cat} className="bg-gray-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Tagline / Title</label>
                <textarea
                  className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all h-[152px] resize-none font-medium leading-relaxed"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Unleashing the future of student innovation"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Logistics */}
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <FaClock />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Timeline & Description</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Launch Date</label>
                  <input
                    type="date"
                    className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Duration / Time</label>
                  <input
                    type="text"
                    className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 3 Days"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Detailed Synopsis</label>
                <textarea
                  className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all h-[68px] resize-none font-medium leading-relaxed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe the program objectives..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Visual Assets */}
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-pink-600/20 rounded-xl flex items-center justify-center text-pink-400 border border-pink-500/20">
                <FaImage />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Visual Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Image Upload */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block ml-1">Program Hero Image</label>
                <div className="relative group min-h-[200px] rounded-[2rem] bg-white/[0.02] border-2 border-dashed border-white/10 hover:border-blue-500/30 transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer overflow-hidden">
                  {image ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
                      <img src={URL.createObjectURL(image)} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-bold text-xs uppercase tracking-widest">Change Image</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      <FaCloudUploadAlt className="text-3xl text-gray-700 group-hover:text-blue-400 transition-all mx-auto" />
                      <p className="text-gray-600 font-bold uppercase text-[8px] tracking-[0.2em]">Upload JPG/PNG</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setImage(e.target.files[0])} />
                </div>
              </div>

              {/* Brochure Upload */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block ml-1">Program Brochure (PDF)</label>
                <div className="relative group min-h-[200px] rounded-[2rem] bg-white/[0.02] border-2 border-dashed border-white/10 hover:border-indigo-500/30 transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer overflow-hidden">
                  {brochure ? (
                    <div className="flex flex-col items-center gap-3">
                      <FaFilePdf className="text-4xl text-red-500" />
                      <p className="text-white font-bold text-sm truncate max-w-[200px]">{brochure.name}</p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setBrochure(null); }}
                        className="text-[10px] text-gray-500 hover:text-red-400 uppercase tracking-widest font-black"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <FaFilePdf className="text-3xl text-gray-700 group-hover:text-indigo-400 transition-all mx-auto" />
                      <p className="text-gray-600 font-bold uppercase text-[8px] tracking-[0.2em]">Upload PDF Document</p>
                    </div>
                  )}
                  <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setBrochure(e.target.files[0])} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Features */}
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <FaBolt />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Program Highlighters</h2>
            </div>

            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] space-y-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  className="w-full sm:w-auto p-4 rounded-2xl bg-[#0a0d1f] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold cursor-pointer appearance-none px-8"
                  onChange={(e) => {
                    const selected = ICON_OPTIONS.find(item => item.label === e.target.value);
                    setFeatureIcon(selected.value);
                    setFeatureIconLabel(selected.label);
                  }}
                >
                  {ICON_OPTIONS.map((item, i) => (
                    <option key={i} value={item.label} className="bg-gray-800">{item.label}</option>
                  ))}
                </select>

                <input
                  type="text"
                  className="flex-1 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                  placeholder="Feature name (e.g. Free Certification)"
                  value={featureName}
                  onChange={(e) => setFeatureName(e.target.value)}
                />

                <button
                  type="button"
                  onClick={addFeature}
                  className="px-8 py-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-2xl text-emerald-400 font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 active:scale-95"
                >
                  <FaPlus /> Add
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {features.map((f, index) => {
                    const IconComp = ICON_OPTIONS.find(opt => opt.label === f.iconLabel)?.value || FaBolt;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex justify-between items-center bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <IconComp />
                          </div>
                          <span className="font-bold text-sm text-gray-300">{f.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <FaTrash size={12} />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {features.length === 0 && (
                  <p className="col-span-full text-center text-gray-600 font-bold py-6 uppercase tracking-widest text-[10px]">No features added yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Suite */}
          <div className="pt-10">
            <button
              type="submit"
              className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] transition-all shadow-2xl shadow-blue-900/40 active:scale-[0.98]"
            >
              Initialize Program
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default TeacherAddProgram;