import { FaCalendarAlt, FaClock, FaCheckCircle, FaUsers, FaUserCheck, FaStar, FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from 'react';
import { useEffect } from 'react';

const API_BASE_URL = "http://localhost:5000/api";

const TeacherDashboard = () => {
  const { user } = useAppContext();
  const [dashboardData, setDashboardData] = useState({
    events: 0,
    upcomingEvents: 0,
    completedEvents: 0
  })
  const [recentEvents, setRecentEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDashboard = async () => {
    setLoading(true)
    if (!user) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/events`);
      const allEvents = res.data;

      const teacherEvents = allEvents.filter(event =>
        event.incharge && event.incharge.includes(user.name)
      )

      const now = new Date()
      const upcoming = teacherEvents.filter(event => new Date(event.date) >= now).length
      const completed = teacherEvents.length - upcoming

      setDashboardData({
        events: teacherEvents.length,
        upcomingEvents: upcoming,
        completedEvents: completed
      })

      const sortedEvents = [...teacherEvents].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
      setRecentEvents(sortedEvents)
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load dashboard statistics.");
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [user])

  const statsCards = [
    {
      title: "Total Events",
      value: dashboardData.events,
      icon: <FaCalendarAlt className="w-8 h-8 text-blue-400" />,
      bgColor: "from-blue-600 to-indigo-700",
      lightBg: "bg-blue-600/10"
    },
    {
      title: "Upcoming Events",
      value: dashboardData.upcomingEvents,
      icon: <FaClock className="w-8 h-8 text-amber-400" />,
      bgColor: "from-amber-600 to-orange-700",
      lightBg: "bg-amber-600/10"
    },
    {
      title: "Completed Events",
      value: dashboardData.completedEvents,
      icon: <FaCheckCircle className="w-8 h-8 text-emerald-400" />,
      bgColor: "from-emerald-600 to-teal-700",
      lightBg: "bg-emerald-600/10"
    },
  ]

  if (loading) {
    return (
      <div className="flex-1 h-screen bg-[#03050F] flex items-center justify-center">
        <div className="text-blue-500 font-bold animate-pulse text-xl">Loading Dashboard...</div>
      </div>
    )
  }

  return (
    <div className='flex-1 h-screen overflow-y-auto bg-gradient-to-br from-[#03050F] via-[#0a0d1f] to-[#03050F] p-4 md:p-8 font-out text-gray-300'>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-3">Teacher Dashboard</h1>
          <p className="text-gray-500 text-lg font-medium">Welcome back, <span className="text-white font-bold">{user?.name}</span>. Here's your event overview.</p>
        </div>

        {/* Stats Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          {statsCards.map((card, index) => (
            <div key={index} className={`${card.lightBg} backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:scale-[1.03] transition-all duration-500 shadow-2xl hover:shadow-${card.title.split(' ')[0].toLowerCase()}-500/10`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className='text-4xl font-black text-white mb-2 leading-none'>{card.value}</p>
                  <p className='text-gray-500 font-black text-xs uppercase tracking-widest'>{card.title}</p>
                </div>
                <div className={`bg-white/5 p-4 rounded-2xl shadow-inner border border-white/5`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Events Section */}
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <FaCalendarAlt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Recent Events</h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Latest updates from your events</p>
              </div>
            </div>
          </div>

          {/* Events Table */}
          <div className='relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.01]'>
            <div className="overflow-x-auto">
              <table className='w-full text-left'>
                <thead className='bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.2em] text-gray-500'>
                  <tr>
                    <th scope='col' className='px-8 py-5'>#</th>
                    <th scope='col' className='px-8 py-5'>Event Identity</th>
                    <th scope='col' className='px-8 py-5 max-sm:hidden'>Program</th>
                    <th scope='col' className='px-8 py-5 max-sm:hidden'>Timeline</th>
                    <th scope='col' className='px-8 py-5 text-right'>Participation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentEvents.map((event, index) => (
                    <tr key={event.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className='px-8 py-6 text-gray-600 font-mono font-bold'>{index + 1}</td>
                      <td className='px-8 py-6'>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-800 overflow-hidden border border-white/5">
                            <img src={event.image || event.poster} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div>
                            <p className='text-white font-black text-lg group-hover:text-blue-400 transition-colors'>{event.eventName}</p>
                            <p className='text-gray-500 text-[10px] font-bold uppercase tracking-widest truncate max-w-[200px]'>{event.venue}</p>
                          </div>
                        </div>
                      </td>
                      <td className='px-8 py-6 text-gray-400 max-sm:hidden'>
                        <span className="bg-white/5 px-3 py-1 rounded-lg text-xs font-bold border border-white/5">{event.programName}</span>
                      </td>
                      <td className='px-8 py-6 text-gray-400 max-sm:hidden font-medium text-sm'>{event.date}</td>
                      <td className='px-8 py-6 text-right'>
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 ${event.participationType === 'team' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'
                          }`}>
                          {event.participationType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Empty State */}
          {recentEvents.length === 0 && (
            <div className="text-center py-24 bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
              <div className="w-20 h-20 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                <FaCalendarAlt className="w-10 h-10 text-gray-700" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">No Events Managed</h3>
              <p className="text-gray-500 font-medium">You haven't been assigned to any events yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default TeacherDashboard