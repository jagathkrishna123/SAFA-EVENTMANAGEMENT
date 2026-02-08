import React from 'react';
import { FaGraduationCap, FaCalendarCheck, FaUsers, FaLightbulb, FaGlobe, FaAward } from 'react-icons/fa';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6 md:p-12 font-out text-gray-300">
            <div className="max-w-7xl mx-auto pt-16">

                {/* Hero Section */}
                <div className="text-center mb-20 space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                    >
                        About DOCKET
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Empowering educational institutions with seamless event management and academic coordination.
                    </motion.p>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors"
                    >
                        <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
                            <FaGlobe className="text-2xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                        <p className="leading-relaxed">
                            To revolutionize how colleges manage their extracurricular and academic events by providing a centralized, efficient, and user-friendly platform that fosters engagement and organization across the campus.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors"
                    >
                        <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6">
                            <FaLightbulb className="text-2xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
                        <p className="leading-relaxed">
                            A future where academic institutions operate effortlessly, where every student's participation is tracked, every event is a success, and the administrative burden is minimized through smart technology.
                        </p>
                    </motion.div>
                </div>

                {/* Core Features */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose DOCKET?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: <FaCalendarCheck />, title: "Event Management", desc: "Create, schedule, and manage college events with ease.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                            { icon: <FaUsers />, title: "Student Tracking", desc: "Keep track of student participation, attendance, and achievements.", color: "text-amber-400", bg: "bg-amber-500/10" },
                            { icon: <FaGraduationCap />, title: "Academic Focus", desc: "Designed specifically for the unique needs of educational institutions.", color: "text-cyan-400", bg: "bg-cyan-500/10" },
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center ${feature.color} mb-4`}>
                                    <span className="text-xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-400">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Stats / Impact (Optional Mock Data) */}
                <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-3xl p-8 md:p-12 border border-white/10 text-center">
                    <h2 className="text-2xl font-bold text-white mb-8">Making an Impact</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: "Colleges", value: "50+" },
                            { label: "Students", value: "10,000+" },
                            { label: "Events Managed", value: "5,000+" },
                            { label: "Satisfaction", value: "99%" },
                        ].map((stat, idx) => (
                            <div key={idx}>
                                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;