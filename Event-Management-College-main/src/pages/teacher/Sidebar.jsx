import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CgNotes } from 'react-icons/cg';
import { FaStarHalfStroke } from 'react-icons/fa6';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { MdOutlineAddBox, MdOutlineGroupAdd, MdOutlineSpaceDashboard } from 'react-icons/md';
import { PiUserCheckBold } from 'react-icons/pi';
import { TbReportMedical } from 'react-icons/tb';
import { LuMessageSquareMore } from 'react-icons/lu';

const Sidebar = () => {
    const menuItems = [
        { to: '/teacher', icon: MdOutlineSpaceDashboard, label: 'Dashboard', end: true },
        { to: '/teacher/teacher-add-program', icon: MdOutlineAddBox, label: 'Add Program' },
        { to: '/teacher/addevent', icon: IoMdAddCircleOutline, label: 'Add Event' },
        { to: '/teacher/rating', icon: FaStarHalfStroke, label: 'Rating' },
        { to: '/teacher/attendence', icon: PiUserCheckBold, label: 'Attendance' },
        { to: '/teacher/registrations', icon: CgNotes, label: 'Registrations' },
        { to: '/teacher/addstudent', icon: MdOutlineGroupAdd, label: 'Add Students' },
        { to: '/teacher/addreports', icon: TbReportMedical, label: 'Add Reports' },
        { to: '/teacher/teacher-notification', icon: LuMessageSquareMore, label: 'Notification' },
    ];

    return (
        <div className='flex flex-col bg-white/[0.02] backdrop-blur-xl border-r border-white/10 h-full overflow-y-auto py-8 text-gray-400 font-out sticky top-0'>
            <div className="px-1 space-y-2">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                            `group relative flex items-center gap-4 py-3.5 px-4 rounded-md transition-all duration-300 overflow-hidden ${isActive
                                ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-400"
                                : "hover:bg-white/5 hover:text-gray-200"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {/* Active Indicator Glow */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeGlowTeacher"
                                        className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}

                                {/* Active Border */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeBorderTeacher"
                                        className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}

                                <item.icon className={`text-xl relative z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-300"}`} />
                                <span className='hidden md:inline-block font-bold text-sm tracking-wide relative z-10 uppercase opacity-80 group-hover:opacity-100'>
                                    {item.label}
                                </span>

                                {/* Hover Particle Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Footer Info */}
            <div className="mt-auto px-6 py-8 border-t border-white/5 hidden md:block">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1">Status</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
                        <span className="text-xs font-bold text-gray-400">Teacher Portal</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;