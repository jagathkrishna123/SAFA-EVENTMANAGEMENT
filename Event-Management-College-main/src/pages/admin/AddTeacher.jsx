import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCloudUploadAlt,
  FaFileDownload,
  FaTrash,
  FaEdit,
  FaUserPlus,
  FaChalkboardTeacher,
  FaSearch
} from "react-icons/fa";
import { LuScanFace, LuMail } from "react-icons/lu";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/teachers";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const AddTeacher = () => {
  const [teachers, setTeachers] = useState([]);

  const [formData, setFormData] = useState({
    teacherId: "",
    email: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch teachers from backend
  const fetchTeachers = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Failed to load teachers");
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOrUpdate = async () => {
    const teacherId = formData.teacherId.trim().toUpperCase();
    const email = formData.email.trim().toLowerCase();

    if (!teacherId || !email) {
      toast.error("Please fill all fields");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      if (editIndex !== null) {
        // Update existing teacher
        // We need the original ID to identify the record if ID is changed
        const originalId = teachers[editIndex].teacherId;
        await axios.put(`${API_URL}/${originalId}`, { teacherId, email });

        // Optimistic update or refresh
        fetchTeachers();
        setEditIndex(null);
        toast.success("Teacher record updated");
      } else {
        // Add new teacher
        await axios.post(API_URL, { teacherId, email });
        fetchTeachers();
        toast.success("New teacher enrolled successfully");
      }

      setFormData({ teacherId: "", email: "" });

    } catch (error) {
      console.error("Operation failed:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Operation failed. Please try again.");
      }
    }
  };

  const handleEdit = (index) => {
    setFormData(teachers[index]);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemove = async (index) => {
    const teacherId = teachers[index].teacherId;
    try {
      await axios.delete(`${API_URL}/${teacherId}`);
      fetchTeachers();
      toast.info("Teacher record removed");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete teacher");
    }
  };

  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").slice(1);
      const imported = [];

      const validImports = imported.filter(t =>
        t.teacherId &&
        t.email &&
        isValidEmail(t.email)
      );

      if (validImports.length === 0) {
        toast.error("No valid records found in CSV");
        return;
      }

      // Sequential import to avoid overwhelming server or race conditions
      const importPromises = validImports.map(t =>
        axios.post(API_URL, t).catch(err => {
          console.error(`Failed to import ${t.teacherId}:`, err);
          return null;
        })
      );

      Promise.all(importPromises).then(() => {
        fetchTeachers();
        toast.success("CSV Import processed");
      });
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExportCSV = () => {
    if (teachers.length === 0) {
      toast.error("Nothing to export");
      return;
    }

    const headers = ["teacherId", "email"];
    const rows = teachers.map((t) => [t.teacherId, t.email]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "teachers_directory.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Teacher directory exported");
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 min-h-screen bg-[#03050F] p-4 md:p-10 font-out text-gray-300 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-500/20">
              <FaChalkboardTeacher />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Faculty Enrollment
              </h1>
              <p className="text-gray-500 text-lg font-medium">Provision access and manage teacher accounts.</p>
            </div>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Teacher Identifier</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors">
                  <LuScanFace className="text-xl" />
                </div>
                <input
                  type="text"
                  name="teacherId"
                  placeholder="e.g. TCH001"
                  value={formData.teacherId}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-lg"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Official Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors">
                  <LuMail className="text-xl" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="teacher@institution.edu"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-bold text-lg"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <button
              onClick={handleAddOrUpdate}
              className={`w-full md:flex-1 py-5 rounded-3xl font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3 ${editIndex !== null
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-orange-900/40"
                : "bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-indigo-900/40"
                }`}
            >
              <FaUserPlus /> {editIndex !== null ? "Apply Changes" : "Add Teacher"}
            </button>

            {editIndex !== null && (
              <button
                onClick={() => { setEditIndex(null); setFormData({ teacherId: "", email: "" }); }}
                className="w-full md:w-auto px-8 py-5 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-3xl font-black text-sm uppercase tracking-widest transition-all border border-white/10"
              >
                Abort
              </button>
            )}
          </div>
        </motion.div>

        {/* CSV Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-[2rem] bg-white/[0.02] border border-dashed border-white/10 hover:border-indigo-500/30 transition-all p-8 flex items-center gap-6 cursor-pointer"
          >
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 text-2xl">
              <FaCloudUploadAlt />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-1">Batch Injection</h3>
              <p className="text-gray-500 text-sm font-medium italic">Import faculty list from CSV</p>
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleExportCSV}
            className="flex items-center gap-6 p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all text-left"
          >
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 text-2xl">
              <FaFileDownload />
            </div>
            <div>
              <h3 className="text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-1">Data Custody</h3>
              <p className="text-gray-500 text-sm font-medium italic">Backup faculty directory to CSV</p>
            </div>
          </motion.button>
        </div>

        {/* Directory Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative mb-6 group"
        >
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
            <FaSearch className="text-lg" />
          </div>
          <input
            type="text"
            placeholder="Search Faculty by ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-5 rounded-3xl bg-white/[0.01] border border-white/5 text-white placeholder-gray-700 focus:outline-none focus:bg-white/[0.03] focus:border-white/10 transition-all font-bold tracking-wide"
          />
        </motion.div>

        {/* Directory Section */}
        <AnimatePresence mode="wait">
          {filteredTeachers.length > 0 ? (
            <motion.div
              key="directory"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                  <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                  Faculty Directory
                </h2>
                <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                  {filteredTeachers.length} Active Records
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
                    <tr>
                      <th className="px-8 py-6">Reference</th>
                      <th className="px-8 py-6">Communication Bridge</th>
                      <th className="px-8 py-6 text-right">Strategic Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {filteredTeachers.map((teacher, index) => (
                      <motion.tr
                        key={teacher.teacherId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 font-bold text-[10px]">
                              {index + 1}
                            </div>
                            <span className="text-white font-bold tracking-wide">{teacher.teacherId}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-gray-400 font-medium">{teacher.email}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(teachers.findIndex(t => t.teacherId === teacher.teacherId))}
                              className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-lg active:scale-90"
                              title="Refine Record"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleRemove(teachers.findIndex(t => t.teacherId === teacher.teacherId))}
                              className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-90"
                              title="Terminate Access"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-20 text-center bg-white/[0.01] border border-white/5 rounded-[2.5rem]"
            >
              <div className="text-gray-600 font-bold italic">No faculty records found matching your search.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AddTeacher;
