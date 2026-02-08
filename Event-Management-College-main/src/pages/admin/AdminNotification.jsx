import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaBullhorn, FaUser, FaReply, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const AdminNotification = () => {
    const [activeTab, setActiveTab] = useState("compose"); // compose, history
    const [teachers, setTeachers] = useState([]);
    const [notifications, setNotifications] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        recipientType: "all", // all, individual
        recipientId: "",
        subject: "",
        message: ""
    });

    useEffect(() => {
        // Load Teachers
        const fetchTeachers = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/registered-teachers`);
                setTeachers(response.data);
            } catch (error) {
                console.error("Error fetching teachers:", error);
                toast.error("Failed to load teachers");
            }
        };

        // Load Notifications
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/notifications`);
                setNotifications(response.data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
                toast.error("Failed to load notification history");
            }
        };

        fetchTeachers();
        fetchNotifications();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!formData.subject.trim() || !formData.message.trim()) {
            toast.error("Please fill in subject and message");
            return;
        }
        if (formData.recipientType === "individual" && !formData.recipientId) {
            toast.error("Please select a teacher");
            return;
        }

        try {
            const newNotification = {
                subject: formData.subject,
                message: formData.message,
                senderRole: "admin",
                recipientType: formData.recipientType,
                recipientId: formData.recipientType === "individual" ? formData.recipientId : null
            };

            const response = await axios.post(`${API_BASE_URL}/notifications`, newNotification);

            // Refresh notifications after sending
            const historyResponse = await axios.get(`${API_BASE_URL}/notifications`);
            setNotifications(historyResponse.data);

            toast.success("Notification sent successfully!");
            setFormData({
                recipientType: "all",
                recipientId: "",
                subject: "",
                message: ""
            });
            setActiveTab("history");
        } catch (error) {
            console.error("Error sending notification:", error);
            toast.error("Failed to send notification");
        }
    };

    return (
        <div className="min-h-screen text-white font-out container mx-auto ">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                        Notification Center
                    </h1>
                    <p className="text-gray-400 font-medium">Broadcast updates or message faculty directly.</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-2xl">
                    <button
                        onClick={() => setActiveTab("compose")}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "compose" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                    >
                        Compose
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "history" ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                    >
                        History & Replies
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "compose" ? (
                    <motion.div
                        key="compose"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-3xl mx-auto"
                    >
                        <form onSubmit={handleSend} className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] shadow-2xl space-y-6">

                            {/* Recipient Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Recipient Type</label>
                                    <div className="grid grid-cols-2 gap-2 bg-black/20 p-1.5 rounded-2xl">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, recipientType: "all" }))}
                                            className={`py-3 rounded-xl text-sm font-bold transition-all ${formData.recipientType === "all" ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
                                        >
                                            <span className="flex items-center justify-center gap-2"><FaBullhorn /> All Staff</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, recipientType: "individual" }))}
                                            className={`py-3 rounded-xl text-sm font-bold transition-all ${formData.recipientType === "individual" ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
                                        >
                                            <span className="flex items-center justify-center gap-2"><FaUser /> Individual</span>
                                        </button>
                                    </div>
                                </div>

                                {formData.recipientType === "individual" && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Select Teacher</label>
                                        <div className="relative">
                                            <select
                                                name="recipientId"
                                                value={formData.recipientId}
                                                onChange={handleInputChange}
                                                className="w-full p-4 rounded-2xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-blue-500/50 appearance-none"
                                            >
                                                <option value="" className="bg-gray-900">Select a teacher...</option>
                                                {teachers.map(teacher => (
                                                    <option key={teacher.id} value={teacher.registerNumber} className="bg-gray-900">
                                                        {teacher.name} ({teacher.registerNumber})
                                                    </option>
                                                ))}
                                            </select>
                                            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Subject */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="Enter notification subject..."
                                    className="w-full p-4 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 font-bold"
                                />
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Message Content</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Type your message here..."
                                    rows="6"
                                    className="w-full p-4 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 font-medium resize-none"
                                ></textarea>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-900/40 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    <FaPaperPlane /> Send Notification
                                </button>
                            </div>

                        </form>
                    </motion.div>
                ) : (
                    <div className="space-y-6 max-w-4xl mx-auto">
                        {notifications.length === 0 ? (
                            <div className="text-center py-20 bg-white/[0.02] rounded-[2rem] border border-white/5 border-dashed">
                                <p className="text-gray-500 font-bold">No notifications sent yet.</p>
                            </div>
                        ) : (
                            notifications.map((note) => (
                                <NotificationItem key={note.id} note={note} />
                            ))
                        )}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Sub-component for individual notification items in history
const NotificationItem = ({ note }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden"
        >
            <div
                onClick={() => setExpanded(!expanded)}
                className="p-6 cursor-pointer hover:bg-white/[0.02] transition-colors flex items-start justify-between gap-4"
            >
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${note.recipientType === 'all' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                            {note.recipientType === 'all' ? 'Broadcast' : `To: ${note.recipientId}`}
                        </span>
                        <span className="text-gray-500 text-xs font-mono">
                            {new Date(note.timestamp).toLocaleDateString()} {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{note.subject}</h3>
                    <p className="text-gray-400 text-sm line-clamp-1">{note.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {note.replies && note.replies.length > 0 && (
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1">
                            <FaReply className="text-[10px]" /> {note.replies.length}
                        </span>
                    )}
                    {expanded ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-black/20 border-t border-white/5"
                    >
                        <div className="p-6 pt-2 space-y-6">
                            <div className="bg-white/5 p-4 rounded-xl">
                                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{note.message}</p>
                            </div>

                            {/* Replies Section */}
                            {note.replies && note.replies.length > 0 ? (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Replies</h4>
                                    {note.replies.map(reply => (
                                        <div key={reply.id} className="flex gap-4 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
                                                {reply.sender.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold text-indigo-300 text-sm">{reply.sender.name} ({reply.sender.id})</span>
                                                    <span className="text-[10px] text-gray-600">{new Date(reply.timestamp).toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-300">{reply.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-center text-gray-600 italic py-2">No replies yet</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default AdminNotification;