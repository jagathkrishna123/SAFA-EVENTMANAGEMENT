import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCloudUploadAlt,
  FaFileDownload,
  FaTrash,
  FaEdit,
  FaUserPlus,
  FaGraduationCap
} from "react-icons/fa";
import { LuUser, LuMail } from "react-icons/lu";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/students";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const AddStudent = () => {
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    regNo: "",
    email: "",
  });

  const [editIndex, setEditIndex] = useState(null);

  // Fetch students from backend
  const fetchStudents = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOrUpdate = async () => {
    const regNo = formData.regNo.trim().toUpperCase();
    const email = formData.email.trim().toLowerCase();

    if (!regNo || !email) {
      toast.error("Please fill all fields");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      if (editIndex !== null) {
        // Update existing student
        const originalId = students[editIndex].registerNumber || students[editIndex].regNo; // Handle both DB and local keys if needed
        // Note: DB returns 'registerNumber', frontend uses 'regNo' in display usually but we should standardise.
        // The API returns DB rows which have 'registerNumber'. 
        // But let's check how we display. The table below uses 'student.regNo'.
        // We need to make sure state matches. 
        // Actually, the API returns objects with `registerNumber`. 
        // The frontend code below expects `regNo`. 
        // I should probably map the response or change the usage below.
        // For now, let's assume I'll fix the display or the state.
        // Let's stick to the current plan of standardizing on what the component expects if possible, 
        // OR update the component to use `registerNumber`.
        // The previous code used `regNo`. The DB has `registerNumber`.
        // I will map `registerNumber` to `regNo` in fetch or just update the UI to use `registerNumber`.
        // Updating UI is safer.
        await axios.put(`${API_URL}/${originalId}`, { regNo, email });

        fetchStudents();
        setEditIndex(null);
        toast.success("Student updated successfully");
      } else {
        // Add new student
        await axios.post(API_URL, { regNo, email });
        fetchStudents();
        toast.success("Student added successfully");
      }

      setFormData({ regNo: "", email: "" });

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
    setFormData(students[index]);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemove = async (index) => {
    const id = students[index].registerNumber || students[index].regNo;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchStudents();
      toast.info("Student removed");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete student");
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

      const validImports = imported.filter(s =>
        s.regNo &&
        s.email &&
        isValidEmail(s.email)
      );

      if (validImports.length === 0) {
        toast.error("No valid records found in CSV");
        return;
      }

      const importPromises = validImports.map(s =>
        axios.post(API_URL, s).catch(err => {
          console.error(`Failed to import ${s.regNo}:`, err);
          return null;
        })
      );

      Promise.all(importPromises).then(() => {
        fetchStudents();
        toast.success("CSV Import processed");
      });
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExportCSV = () => {
    if (students.length === 0) {
      toast.error("No students to export");
      return;
    }

    const headers = ["regNo", "email"];
    const rows = students.map((s) => [s.registerNumber || s.regNo, s.email]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "students.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
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
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-cyan-500/20">
              <FaGraduationCap />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Student Enrollment
              </h1>
              <p className="text-gray-500 text-lg font-medium">Manage and expand your student database with ease.</p>
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
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Registration Identifier</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-500 transition-colors">
                  <LuUser className="text-xl" />
                </div>
                <input
                  type="text"
                  name="regNo"
                  placeholder="e.g. SFAXBCA001"
                  value={formData.regNo}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-bold text-lg"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Academic Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <LuMail className="text-xl" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="student@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-lg"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <button
              onClick={handleAddOrUpdate}
              className={`w-full md:flex-1 py-5 rounded-3xl font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3 ${editIndex !== null
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-orange-900/40"
                : "bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-cyan-900/40"
                }`}
            >
              <FaUserPlus /> {editIndex !== null ? "Execute Update" : "Add Student"}
            </button>

            {editIndex !== null && (
              <button
                onClick={() => { setEditIndex(null); setFormData({ regNo: "", email: "" }); }}
                className="w-full md:w-auto px-8 py-5 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-3xl font-black text-sm uppercase tracking-widest transition-all border border-white/10"
              >
                Discard
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
            className="group relative overflow-hidden rounded-[2rem] bg-white/[0.02] border border-dashed border-white/10 hover:border-cyan-500/30 transition-all p-8 flex items-center gap-6 cursor-pointer"
          >
            <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 text-2xl">
              <FaCloudUploadAlt />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-1">Bulk Integration</h3>
              <p className="text-gray-500 text-sm font-medium italic">Drop CSV to batch enroll students</p>
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
            className="flex items-center gap-6 p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all text-left"
          >
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 text-2xl">
              <FaFileDownload />
            </div>
            <div>
              <h3 className="text-white font-bold uppercase text-[10px] tracking-[0.2em] mb-1">Data Custody</h3>
              <p className="text-gray-500 text-sm font-medium italic">Export student directory to CSV</p>
            </div>
          </motion.button>
        </div>

        {/* Directory Section */}
        {students.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
                Student Directory
              </h2>
              <span className="px-4 py-1.5 bg-cyan-500/10 text-cyan-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-500/20">
                {students.length} Total Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
                  <tr>
                    <th className="px-8 py-6">Identity</th>
                    <th className="px-8 py-6">Communication</th>
                    <th className="px-8 py-6 text-right">Strategic Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {students.map((student, index) => (
                    <motion.tr
                      key={index}
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
                          <span className="text-white font-bold tracking-wide">{student.registerNumber || student.regNo}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-gray-400 font-medium">{student.email}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(index)}
                            className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-lg active:scale-90"
                            title="Refine Record"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleRemove(index)}
                            className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-90"
                            title="Terminate Record"
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
        )}
      </div>
    </div>
  );
};

export default AddStudent;
