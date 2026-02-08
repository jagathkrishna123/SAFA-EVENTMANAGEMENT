import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const Attendence = () => {
  const { user } = useAppContext();
  const [myEvents, setMyEvents] = useState([]);
  const [attendanceRequests, setAttendanceRequests] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsRes, attRes, studentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/events`),
        axios.get(`${API_BASE_URL}/attendance`),
        axios.get(`${API_BASE_URL}/students`)
      ]);

      const teacherEvents = eventsRes.data.filter(event =>
        event.incharge && event.incharge.includes(user.name)
      );
      setMyEvents(teacherEvents);

      const requestsByEvent = {};
      teacherEvents.forEach(event => {
        const eventRequests = attRes.data.filter(att =>
          Number(att.eventId) === Number(event.id)
        ).map(att => {
          const student = studentsRes.data.find(u => String(u.id) === String(att.userId));
          return {
            ...att,
            studentName: student ? student.name : "Unknown",
            studentRegNo: student ? student.registerNumber : "N/A",
            studentDept: student ? student.department : "N/A",
            studentSem: student ? student.semester : "N/A"
          };
        });
        requestsByEvent[event.id] = eventRequests;
      });

      setAttendanceRequests(requestsByEvent);
    } catch (error) {
      console.error("Load error:", error);
      toast.error("Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (recordId, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/attendance/${recordId}`, { status: newStatus });
      toast.success(`Attendance ${newStatus} successfully`);
      loadData();
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update attendance status.");
    }
  };

  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#03050F] via-[#0a0d1f] to-[#03050F] w-full text-white font-out p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Attendance Management
          </h1>
          <p className="text-gray-400">Manage attendance approvals for your events</p>
        </div>

        {myEvents.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-lg">You are not incharge of any events yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {myEvents.map(event => {
              const requests = attendanceRequests[event.id] || [];
              const pendingRequests = requests.filter(r => r.status === 'pending');
              const historyRequests = requests.filter(r => r.status !== 'pending');

              return (
                <div key={event.id} className="bg-gray-900/50 border border-gray-700 rounded-2xl overflow-hidden backdrop-blur-sm">
                  <div className="p-6 border-b border-gray-700 bg-gray-800/30">
                    <h2 className="text-xl font-bold text-white mb-1">{event.eventName}</h2>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                      <span>Pending: {pendingRequests.length}</span>
                      <span>Total: {requests.length}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    {requests.length === 0 ? (
                      <p className="text-gray-500 italic">No attendance records found for this event.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="text-gray-400 border-b border-gray-700 text-sm uppercase">
                              <th className="py-3 px-4">Student</th>
                              <th className="py-3 px-4">Register No</th>
                              <th className="py-3 px-4">Class</th>
                              <th className="py-3 px-4">Date</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-300">
                            {requests.sort((a, b) => (a.status === 'pending' ? -1 : 1)).map(request => (
                              <tr key={request.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                <td className="py-3 px-4 font-medium text-white">{request.studentName}</td>
                                <td className="py-3 px-4">{request.studentRegNo}</td>
                                <td className="py-3 px-4">{request.studentDept} - {request.studentSem}</td>
                                <td className="py-3 px-4">{new Date(request.date).toLocaleString()}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${request.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                    request.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                      'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Pending'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  {request.status === 'pending' && (
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() => handleStatusUpdate(request.id, 'approved')}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                                      >
                                        Reject
                                      </button>
                                    </div>
                                  )}
                                  {request.status !== 'pending' && (
                                    <span className="text-gray-500 text-sm">Processed</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendence;