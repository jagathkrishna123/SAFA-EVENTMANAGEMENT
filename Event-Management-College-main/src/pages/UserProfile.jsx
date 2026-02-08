import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaUser, FaEnvelope, FaPhone, FaIdCard, FaUniversity, FaGraduationCap, FaChalkboardTeacher, FaVenusMars, FaBook, FaSave, FaTimes, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserProfile = () => {
    const { user, setUser } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [displayUser, setDisplayUser] = useState(null);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setDisplayUser(storedUser);
            setEditData(storedUser);
            if (!user) setUser(storedUser);
        } else if (user) {
            setDisplayUser(user);
            setEditData(user);
        }
    }, [user, setUser]);

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await toBase64(file);
                const updatedUser = { ...displayUser, image: base64 };
                setDisplayUser(updatedUser);
                setEditData(updatedUser);
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                toast.success("Profile image updated!");
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Failed to upload image");
            }
        }
    };

    const handleSave = () => {
        setUser(editData);
        localStorage.setItem('user', JSON.stringify(editData));
        setDisplayUser(editData);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
    };

    const handleCancel = () => {
        setEditData(displayUser);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    if (!displayUser) {
        return <div className="text-white text-center p-10 mt-20">Loading profile...</div>;
    }

    const isStudent = displayUser.userType === 'student';

    const InfoBlock = ({ icon: Icon, label, value, name, color, editable }) => (
        <div className="flex items-center gap-4 text-gray-300">
            <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center text-${color}-400 border border-${color}-500/20`}>
                <Icon />
            </div>
            <div className="flex-1">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-0.5">{label}</p>
                {isEditing && editable ? (
                    <input
                        type="text"
                        name={name}
                        value={editData[name] || ''}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-blue-500 transition-all font-medium"
                    />
                ) : (
                    <p className="font-bold text-white tracking-wide">{value || 'Not provided'}</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#03050F] p-4 md:p-12 font-out">
            <div className="max-w-4xl mx-auto pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
                >
                    {/* Header / Cover Area */}
                    <div className="h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 relative">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute -bottom-16 left-8 md:left-12">
                            <div className="relative group">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-4 border-[#03050F] overflow-hidden bg-gray-800 shadow-2xl relative z-10"
                                >
                                    {displayUser.image ? (
                                        <img
                                            src={displayUser.image}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                                            <FaUser className="w-16 h-16" />
                                        </div>
                                    )}
                                </motion.div>

                                <label className="absolute -bottom-2 -right-2 bg-gradient-to-br from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-white p-3 rounded-2xl cursor-pointer shadow-xl transition-all z-20 hover:rotate-12 active:scale-90">
                                    <FaCamera className="w-5 h-5" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="pt-20 px-8 pb-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                            <div className="flex flex-col gap-4">
                                <h1 className="text-4xl font-black text-white mb-1 tracking-tight">{displayUser.name}</h1>
                                <div className="flex items-center gap-3 flex flex-col md:flex-row">
                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 flex items-center gap-2 shadow-lg shadow-blue-500/5">
                                        {isStudent ? <FaGraduationCap /> : <FaChalkboardTeacher />}
                                        {displayUser.userType}
                                    </span>
                                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/20 shadow-lg shadow-purple-500/5">
                                        {displayUser.department}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 md:mt-0 flex gap-3">
                                <AnimatePresence mode="wait">
                                    {isEditing ? (
                                        <div className="flex gap-3">
                                            <motion.button
                                                key="save"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                onClick={handleSave}
                                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-green-500/20 active:scale-95"
                                            >
                                                <FaSave /> Save Changes
                                            </motion.button>
                                            <motion.button
                                                key="cancel"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                onClick={handleCancel}
                                                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest flex items-center gap-2 active:scale-95"
                                            >
                                                <FaTimes /> Discard
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <motion.button
                                            key="edit"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            onClick={() => setIsEditing(true)}
                                            className="px-8 py-3 bg-white/5 hover:bg-white/[0.08] border border-white/10 text-gray-300 hover:text-white rounded-2xl transition-all font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 backdrop-blur-xl group active:scale-95"
                                        >
                                            <FaEdit className="group-hover:rotate-12 transition-transform" /> Modify Profile
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Information */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/[0.01] rounded-[2rem] p-8 border border-white/5 relative group hover:border-white/10 transition-colors"
                            >
                                <h2 className="text-xs font-black text-gray-600 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
                                    <span className="w-8 h-[1px] bg-gray-800"></span>
                                    Identity Essentials
                                </h2>
                                <div className="space-y-6">
                                    <InfoBlock icon={FaEnvelope} label="Official Email" value={displayUser.email} name="email" color="blue" editable={false} />
                                    <InfoBlock icon={FaPhone} label="Communication Link" value={displayUser.mobile} name="mobile" color="purple" editable={true} />
                                    {!isStudent && <InfoBlock icon={FaVenusMars} label="Gender Identity" value={displayUser.gender} name="gender" color="pink" editable={false} />}
                                </div>
                            </motion.div>

                            {/* Academic / Professional Information */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/[0.01] rounded-[2rem] p-8 border border-white/5 relative group hover:border-white/10 transition-colors"
                            >
                                <h2 className="text-xs font-black text-gray-600 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
                                    <span className="w-8 h-[1px] bg-gray-800"></span>
                                    {isStudent ? 'Academic Credentials' : 'Professional Dossier'}
                                </h2>
                                <div className="space-y-6">
                                    <InfoBlock icon={FaIdCard} label="Master Identifier" value={displayUser.registerNumber} name="registerNumber" color="emerald" editable={false} />
                                    <InfoBlock icon={FaUniversity} label="Sector / Department" value={displayUser.department} name="department" color="amber" editable={false} />

                                    {isStudent ? (
                                        <>
                                            <InfoBlock icon={FaBook} label="Active Semester" value={displayUser.semester} name="semester" color="cyan" editable={false} />
                                            <InfoBlock icon={FaIdCard} label="Admission Ledger" value={displayUser.admissionNumber} name="admissionNumber" color="indigo" editable={false} />
                                        </>
                                    ) : (
                                        <>
                                            <InfoBlock icon={FaChalkboardTeacher} label="Current Designation" value={displayUser.designation} name="designation" color="cyan" editable={false} />
                                            <InfoBlock icon={FaGraduationCap} label="Academic Qualification" value={displayUser.qualification} name="qualification" color="indigo" editable={false} />
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UserProfile;