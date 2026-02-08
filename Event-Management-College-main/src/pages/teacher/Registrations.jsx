import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = "http://localhost:5000/api";

const Registrations = () => {
  const { user } = useAppContext();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsRes, regsRes, studentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/events`),
        axios.get(`${API_BASE_URL}/registrations`),
        axios.get(`${API_BASE_URL}/users`)
      ]);

      const teacherEvents = eventsRes.data.filter(event =>
        event.incharge && event.incharge.includes(user.name)
      );

      setMyEvents(teacherEvents);
      setRegistrations(regsRes.data);
      setUsers(studentsRes.data);
    } catch (error) {
      console.error("Load error:", error);
      toast.error("Failed to load registration data.");
    } finally {
      setLoading(false);
    }
  };

  // Get registered students for a specific event
  const getEventStudents = (eventId) => {
    const eventRegs = registrations.filter(reg => String(reg.eventId) === String(eventId));
    let allStudents = [];

    eventRegs.forEach(reg => {
      if (reg.teamData && reg.teamData.members && reg.teamData.members.length > 0) {
        // Team Registration: Add all members
        reg.teamData.members.forEach(member => {
          // Find full user details using Register Number
          const student = users.find(u => u.registerNumber && u.registerNumber.toUpperCase() === member.regNo.toUpperCase());
          if (student) {
            allStudents.push({
              ...student,
              regId: reg.id,
              regStatus: reg.status,
              regDate: reg.registeredAt
            });
          } else {
            // Fallback
            allStudents.push({
              id: `temp-${member.regNo}`,
              name: member.name,
              registerNumber: member.regNo,
              email: "N/A",
              department: "External/Unknown",
              semester: "-",
              mobile: "-",
              regId: reg.id,
              regStatus: reg.status,
              regDate: reg.registeredAt
            });
          }
        });
      } else {
        // Individual Registration
        const student = users.find(u => String(u.id) === String(reg.userId));
        if (student) {
          allStudents.push({
            ...student,
            regId: reg.id,
            regStatus: reg.status,
            regDate: reg.registeredAt
          });
        }
      }
    });

    return allStudents;
  };

  if (loading) {
    return (
      <div className="flex-1 h-screen bg-[#03050F] flex items-center justify-center">
        <div className="text-blue-500 font-bold animate-pulse">Loading Registrations Dashboard...</div>
      </div>
    );
  }

  const selectedEventStudents = selectedEvent ? getEventStudents(selectedEvent.id) : [];

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#03050F] p-4 md:p-10 font-out text-gray-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-2">
              {selectedEvent ? 'Event Roster' : 'My Event Registrations'}
            </h1>
            <p className="text-gray-500 font-medium tracking-wide">
              {selectedEvent ? `Reviewing participants for "${selectedEvent.eventName}"` : 'Manage students registered for the events you are leading'}
            </p>
          </div>

          {selectedEvent && (
            <button
              onClick={() => setSelectedEvent(null)}
              className="px-6 py-3 bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] text-white rounded-2xl transition-all shadow-xl flex items-center gap-3 font-bold text-sm uppercase tracking-widest"
            >
              &larr; All My Events
            </button>
          )}
        </div>

        {selectedEvent ? (
          // Detailed View: Registered Students for a specific event
          <div className="animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              <div className="lg:col-span-2 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-black text-white mb-4 leading-tight">{selectedEvent.eventName}</h2>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/20">
                    <span>📅</span> {selectedEvent.date}
                  </div>
                  <div className="flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-xl border border-purple-500/20">
                    <span>📍</span> {selectedEvent.venue}
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl flex flex-col justify-center items-center text-center">
                <span className="text-5xl font-black text-white mb-2">{selectedEventStudents.length}</span>
                <span className="text-xs font-black text-blue-100 uppercase tracking-[0.2em]">Registered Students</span>
              </div>
            </div>

            <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-black text-white tracking-tight">Participant Directory</h3>
                {selectedEventStudents.length > 0 && (
                  <span className="text-[10px] font-black font-mono text-gray-500 uppercase">Export Table (Coming Soon)</span>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                  <thead>
                    <tr className="bg-white/[0.03] text-gray-500 uppercase text-[10px] font-black tracking-[0.2em]">
                      <th className="px-8 py-5">Roll No</th>
                      <th className="px-8 py-5">Student Identity</th>
                      <th className="px-8 py-5">Classification</th>
                      <th className="px-8 py-5">Communication</th>
                      <th className="px-8 py-5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {selectedEventStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-6 font-mono font-black text-blue-500/80">{student.registerNumber}</td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-white font-black text-lg">{student.name}</span>
                            <span className="text-xs text-gray-500 font-medium">{student.email}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs bg-white/5 px-2 py-0.5 rounded-lg w-max border border-white/5 text-gray-300">{student.department}</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Sem: {student.semester}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-gray-300 font-bold text-sm tracking-widest">{student.mobile}</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest leading-none ${student.regStatus === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}>
                            {student.regStatus || 'Enrolled'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {selectedEventStudents.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-8 py-24 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-white/[0.02] rounded-full flex items-center justify-center border border-white/5">
                              <span className="text-4xl grayscale opacity-30">👥</span>
                            </div>
                            <div>
                              <p className="text-white font-black text-xl mb-1">No Active Registrations</p>
                              <p className="text-gray-500 font-medium">As soon as students join, they will appear in this directory.</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          // List View: All Relevant Events
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myEvents.map((event) => {
              const studentsCount = getEventStudents(event.id).length;
              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-blue-500/10 cursor-pointer hover:border-blue-500/40 transition-all duration-700 group relative flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={event.image || event.poster}
                      alt={event.eventName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 ease-in-out"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#03050F] to-transparent" />
                    <div className="absolute bottom-6 left-6 pr-6">
                      <span className="px-3 py-1 bg-blue-600/80 backdrop-blur-md text-white text-[10px] font-black rounded-lg mb-3 inline-block shadow-2xl border border-white/20 uppercase tracking-widest">
                        {event.programName}
                      </span>
                      <h2 className="text-2xl font-black text-white leading-tight drop-shadow-2xl">
                        {event.eventName}
                      </h2>
                    </div>
                  </div>

                  <div className="p-8 pt-4 flex-1 flex flex-col">
                    <div className="space-y-4 text-sm text-gray-500 mb-8">
                      <div className="flex items-center gap-3">
                        <span className="text-lg opacity-40">📅</span>
                        <span className="font-bold tracking-tight text-gray-400">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg opacity-40">📍</span>
                        <span className="font-medium truncate text-gray-400">{event.venue}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-4xl font-black text-white">{studentsCount}</span>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Participants</span>
                      </div>
                      <div className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                        <span className="text-white text-xl group-hover:translate-x-1 transition-transform"><MdKeyboardDoubleArrowRight className='text-2xl' /></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {myEvents.length === 0 && (
              <div className="col-span-full py-32 text-center bg-white/[0.01] rounded-[3rem] border-2 border-dashed border-white/5">
                <div className="max-w-md mx-auto">
                  <span className="text-6xl mb-6 block grayscale">📭</span>
                  <h3 className="text-2xl font-black text-white mb-2">No Managed Events Found</h3>
                  <p className="text-gray-500 font-medium">You haven't been assigned as an incharge for any events yet. Contact the administrator to get started.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Registrations;