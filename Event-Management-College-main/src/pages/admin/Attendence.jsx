import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = "http://localhost:5000/api";

const Attendence = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsRes, attRes, regsRes, studentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/events`),
        axios.get(`${API_BASE_URL}/attendance`),
        axios.get(`${API_BASE_URL}/registrations`),
        axios.get(`${API_BASE_URL}/users`)
      ]);

      setEvents(eventsRes.data);
      setAttendanceRecords(attRes.data);
      setRegistrations(regsRes.data);
      setUsers(studentsRes.data);
    } catch (error) {
      console.error("Load error:", error);
      toast.error("Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceStats = (eventId) => {
    const eventRegistrations = registrations.filter(reg => String(reg.eventId) === String(eventId));
    const eventAttendance = attendanceRecords.filter(att => String(att.eventId) === String(eventId));

    const approved = eventAttendance.filter(a => a.status === 'approved').length;
    const pending = eventAttendance.filter(a => a.status === 'pending').length;
    const rejected = eventAttendance.filter(a => a.status === 'rejected').length;

    return {
      total: eventRegistrations.length,
      attended: approved,
      pending: pending,
      rejected: rejected
    };
  };

  const getStudentRoster = (eventId) => {
    const eventRegistrations = registrations.filter(reg => String(reg.eventId) === String(eventId));

    return eventRegistrations.map(reg => {
      const student = users.find(u => String(u.id) === String(reg.userId));
      const attRecord = attendanceRecords.find(att =>
        String(att.eventId) === String(eventId) && String(att.userId) === String(reg.userId)
      );

      return {
        ...student,
        attendanceStatus: attRecord ? attRecord.status : 'not-marked',
        attendanceDate: attRecord ? attRecord.date : null
      };
    }).filter(s => s.id);
  };

  if (loading) {
    return (
      <div className="flex-1 h-screen bg-[#03050F] flex items-center justify-center">
        <div className="text-blue-500 font-bold animate-pulse text-xl uppercase tracking-widest">Initialising Admin Control...</div>
      </div>
    );
  }

  const roster = selectedEvent ? getStudentRoster(selectedEvent.id) : [];

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#03050F] p-4 md:p-10 font-out text-gray-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              {selectedEvent ? 'Event Attendance Roster' : 'Global Attendance Overview'}
            </h1>
            <p className="text-gray-500 font-medium tracking-wide">
              {selectedEvent ? `Monitoring attendance for "${selectedEvent.eventName}"` : 'Track student participation across all college events'}
            </p>
          </div>

          {selectedEvent && (
            <button
              onClick={() => setSelectedEvent(null)}
              className="px-6 py-3 bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] text-white rounded-2xl transition-all shadow-xl flex items-center gap-3 font-bold text-sm uppercase tracking-widest"
            >
              &larr; Back to Overview
            </button>
          )}
        </div>

        {selectedEvent ? (
          // Detailed List View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="animate-fadeIn"
          >
            <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-white/10 bg-white/[0.02]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-white mb-2">{selectedEvent.eventName}</h2>
                    <div className="flex gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                      <span>📅 {selectedEvent.date}</span>
                      <span>📍 {selectedEvent.venue}</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {Object.entries(getAttendanceStats(selectedEvent.id)).map(([key, val]) => (
                      <div key={key} className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-center">
                        <span className="block text-xl font-black text-white">{val}</span>
                        <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.03] text-gray-500 uppercase text-[10px] font-black tracking-[0.2em]">
                      <th className="px-8 py-5">Register No</th>
                      <th className="px-8 py-5">Student Details</th>
                      <th className="px-8 py-5">Marked Date</th>
                      <th className="px-8 py-5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {roster.map((student) => (
                      <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-6 font-mono font-bold text-blue-400">{student.registerNumber}</td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-white font-bold">{student.name}</span>
                            <span className="text-xs text-gray-500">{student.department} • Sem {student.semester}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-gray-400 font-medium">
                          {student.attendanceDate ? new Date(student.attendanceDate).toLocaleString() : '—'}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 ${student.attendanceStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            student.attendanceStatus === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              student.attendanceStatus === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                'bg-gray-800 text-gray-600'
                            }`}>
                            {(student.attendanceStatus || 'not-marked').replace('-', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {roster.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-8 py-24 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-30">
                            <FaUsers className="text-6xl" />
                            <p className="font-bold uppercase tracking-widest">No Active Registrations Found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          // Card Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const stats = getAttendanceStats(event.id);
              const attendanceRate = stats.total > 0 ? Math.round((stats.attended / stats.total) * 100) : 0;

              return (
                <motion.div
                  key={event.id}
                  whileHover={{ y: -8 }}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-gray-800/40 border border-blue-500/30 rounded-[2.5rem] overflow-hidden shadow-2xl hover:border-blue-500/60 cursor-pointer transition-all duration-500 group"
                >
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-blue-600/10 p-3 rounded-2xl border border-blue-500/20">
                        <FaCheckCircle className="text-blue-500 text-xl" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-white">{attendanceRate}%</p>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Attendance Rate</p>
                      </div>
                    </div>

                    <h2 className="text-2xl font-black text-white leading-tight mb-4 group-hover:text-blue-400 transition-colors">
                      {event.eventName}
                    </h2>

                    <div className="flex items-center gap-3 text-xs font-bold text-gray-500 mb-8 pb-6 border-b border-white/5">
                      <span className="flex items-center gap-1">📅 {event.date}</span>
                      <span>•</span>
                      <span className="truncate max-w-[120px]">📍 {event.venue}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-xl font-black text-white">{stats.total}</p>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Registered</p>
                      </div>
                      <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                        <p className="text-xl font-black text-emerald-400">{stats.attended}</p>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Approved</p>
                      </div>
                      <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
                        <p className="text-xl font-black text-amber-400">{stats.pending}</p>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Pending</p>
                      </div>
                      <div className="flex items-center justify-center bg-blue-600 rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40">
                        <MdKeyboardDoubleArrowRight className="text-white text-3xl group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendence;
