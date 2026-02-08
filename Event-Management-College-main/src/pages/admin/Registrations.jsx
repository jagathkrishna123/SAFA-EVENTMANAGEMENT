import React, { useState, useEffect } from 'react';
import { BsCalendarDate } from 'react-icons/bs';
import { IoLocationSharp } from "react-icons/io5";
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = "http://localhost:5000/api";

const Registrations = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsRes, regsRes, studentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/events`),
        axios.get(`${API_BASE_URL}/registrations`),
        axios.get(`${API_BASE_URL}/users`)
      ]);

      setEvents(eventsRes.data);
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
              regDate: reg.registeredAt,
              teamName: `Team of ${reg.userName}`
            });
          } else {
            // Fallback if user lookup fails (e.g. deleted user)
            allStudents.push({
              id: `temp-${member.regNo}`,
              name: member.name,
              registerNumber: member.regNo,
              email: "N/A",
              department: "Externa/Unknown",
              semester: "-",
              mobile: "-",
              regId: reg.id,
              regStatus: reg.status,
              regDate: reg.registeredAt,
              teamName: `Team of ${reg.userName}`
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
    return <div className="p-6 text-white min-h-screen">Loading registrations...</div>;
  }

  const selectedEventStudents = selectedEvent ? getEventStudents(selectedEvent.id) : [];

  return (
    <div className="p-6 text-gray-300 min-h-screen font-out">
      <h1 className="text-3xl font-bold mb-8 text-white border-b border-white/10 pb-4">
        {selectedEvent ? 'Event Registrations' : 'Admin: All Event Registrations'}
      </h1>

      {selectedEvent ? (
        // Detailed View: Registered Students for a specific event
        <div className="animate-fadeIn">
          <button
            onClick={() => setSelectedEvent(null)}
            className="mb-8 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all shadow-lg flex items-center gap-2 border border-white/5"
          >
            &larr; Back to Events Overview
          </button>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-white/10 shadow-2xl mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-bold rounded-full mb-3 inline-block border border-blue-500/20">
                  {selectedEvent.programName}
                </span>
                <h2 className="text-3xl font-bold text-white mb-3">{selectedEvent.eventName}</h2>
                <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                  <span className="flex items-center gap-2">📅 {selectedEvent.date}</span>
                  <span className="flex items-center gap-2">📍 {selectedEvent.venue}</span>
                  <span className="flex items-center gap-2">👨‍🏫 {selectedEvent.incharge}</span>
                </div>
              </div>
              <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/5 text-center">
                <span className="block text-3xl font-black text-white">{selectedEventStudents.length}</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total Enrolled</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-bold text-white">
                Registered Student Directory
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead>
                  <tr className="bg-white/5 text-gray-400 uppercase text-[10px] font-black tracking-[0.15em]">
                    <th className="px-8 py-5">Register No</th>
                    <th className="px-8 py-5">Student Information</th>
                    <th className="px-8 py-5">Academic Info</th>
                    <th className="px-8 py-5">Contact Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {selectedEventStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6 font-mono text-blue-400 font-bold">{student.registerNumber}</td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-lg">{student.name}</span>
                          <span className="text-sm text-gray-500">{student.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-300 font-medium">{student.department}</span>
                          <span className="text-xs text-gray-500">Semester {student.semester}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-gray-300 text-sm font-medium">{student.mobile}</span>
                      </td>
                    </tr>
                  ))}
                  {selectedEventStudents.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center text-gray-500 italic">
                        <div className="flex flex-col items-center gap-3">
                          <span className="text-4xl text-gray-700">📋</span>
                          <p>No students have registered for this event yet.</p>
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
        // List View: All Events
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const count = getEventStudents(event.id).length;
            return (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="bg-gray-900 border border-blue-500/50 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.1)] cursor-pointer hover:border-blue-500/30 transition-all duration-500 group relative"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={event.image || event.poster}
                    alt={event.eventName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <span className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-3 inline-block shadow-lg border border-white/10">
                      {event.programName}
                    </span>
                    <h2 className="text-2xl font-black text-white leading-tight drop-shadow-lg">
                      {event.eventName}
                    </h2>
                  </div>
                </div>

                <div className="p-7 pt-5">
                  <div className="space-y-4 text-sm text-gray-400">
                    <div className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-2xl border border-white/5">
                      <span className="text-lg"><BsCalendarDate className='text-red-400' /></span>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Event Date</p>
                        <p className="text-gray-200 font-medium">{event.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-2xl border border-white/5">
                      <span className="text-lg"><IoLocationSharp className='text-green-700' /></span>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Location</p>
                        <p className="text-gray-200 font-medium truncate max-w-[180px]">{event.venue}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-white">{count}</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Enrolled</span>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-all group-hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                      <span className="text-white text-xl"><MdOutlineKeyboardDoubleArrowRight /></span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {events.length === 0 && (
            <div className="col-span-full py-20 text-center bg-gray-900/30 rounded-3xl border border-dashed border-white/10 mt-10">
              <span className="text-5xl mb-4 block opacity-20">📅</span>
              <p className="text-gray-500 font-medium">No events have been created yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Registrations;
