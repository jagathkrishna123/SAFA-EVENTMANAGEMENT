import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaReply, FaPaperPlane, FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const TeacherNotification = () => {
    const { user } = useAppContext();
    const [notifications, setNotifications] = useState([]);
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null); // ID of notification being replied to

    // Load and Filter Notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return;
            try {
                const response = await axios.get(`${API_BASE_URL}/notifications`);
                const allNotifications = response.data;

                // Filter functionality: Show if recipient is 'all' OR specifically matches this user
                const myNotifications = allNotifications.filter(note => {
                    if (note.recipientType === 'all') return true;
                    // Check if recipient ID matches user's ID
                    const teacherId = user.teacherId || user.registerNumber || user.id;
                    return note.recipientId === teacherId;
                });

                setNotifications(myNotifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
        // Poll for changes every few seconds to see new messages without refresh
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, [user]);

    const handleReplySubmit = async (notificationId) => {
        if (!replyText.trim()) {
            toast.error("Reply cannot be empty");
            return;
        }

        if (!user) {
            toast.error("User info not found");
            return;
        }

        try {
            const senderId = user.teacherId || user.registerNumber || user.name;
            const senderName = user.name;

            const response = await axios.post(`${API_BASE_URL}/notifications/${notificationId}/reply`, {
                message: replyText,
                senderId,
                senderName
            });

            // Update local state by re-fetching or updating the specific item
            setNotifications(prev => prev.map(note =>
                note.id === notificationId
                    ? { ...note, replies: [...(note.replies || []), response.data.reply] }
                    : note
            ));

            toast.success("Reply sent to Admin");
            setReplyText("");
            setReplyingTo(null);
        } catch (error) {
            console.error("Error sending reply:", error);
            toast.error("Failed to send reply");
        }
    };

    return (
        <div className="min-h-screen text-white font-out container mx-auto p-4 md:p-8">
            <div className="mb-10">
                <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                    Inbox
                </h1>
                <p className="text-gray-400 font-medium">Updates and messages from Administration.</p>
            </div>

            <div className="grid gap-6 max-w-4xl mx-auto">
                {notifications.length === 0 ? (
                    <div className="text-center py-20 bg-white/[0.02] rounded-[2rem] border border-white/5 border-dashed">
                        <FaBell className="text-4xl text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold">No new notifications.</p>
                    </div>
                ) : (
                    notifications.map((note) => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-xl"
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/20">
                                        <FaUserShield className="text-xl" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold text-white mb-1">{note.subject}</h3>
                                            <span className="text-[10px] bg-white/5 px-2 py-1 rounded-lg text-gray-400 font-mono">
                                                {new Date(note.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-blue-400/60 text-xs font-bold uppercase tracking-widest mb-4">From Administration</p>

                                        <div className="bg-black/20 p-6 rounded-2xl text-gray-300 leading-relaxed text-sm mb-6">
                                            {note.message}
                                        </div>

                                        {/* Replies Thread */}
                                        {note.replies && note.replies.length > 0 && (
                                            <div className="mb-6 pl-4 border-l-2 border-white/5 space-y-3">
                                                {note.replies.filter(r => user && r.sender.id === (user.teacherId || user.registerNumber || user.id)).map(reply => (
                                                    <div key={reply.id} className="text-sm">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-purple-400 font-bold text-xs">You</span>
                                                            <span className="text-[10px] text-gray-600">{new Date(reply.timestamp).toLocaleString()}</span>
                                                        </div>
                                                        <p className="text-gray-400">{reply.message}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Reply Action */}
                                        {replyingTo === note.id ? (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="bg-white/5 p-4 rounded-2xl"
                                            >
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Write your reply to admin..."
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 text-sm mb-3 min-h-[100px]"
                                                />
                                                <div className="flex gap-3 justify-end">
                                                    <button
                                                        onClick={() => setReplyingTo(null)}
                                                        className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleReplySubmit(note.id)}
                                                        className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-900/40 flex items-center gap-2"
                                                    >
                                                        <FaPaperPlane /> Send Reply
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <button
                                                onClick={() => { setReplyingTo(note.id); setReplyText(""); }}
                                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition-all"
                                            >
                                                <FaReply /> Reply to Admin
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeacherNotification;