// import Logo2 from "../../assets/logo2.png";
// import { useState, useEffect } from "react";
// import { useRef } from "react";
// import { HiOutlineMenu, HiX, HiOutlineBell, HiOutlineUser, HiHome, HiDocumentText, HiCalendar, HiInformationCircle, HiLogout } from "react-icons/hi";
// import { motion, AnimatePresence } from "framer-motion"; // 👈 Added Framer Motion
// import { Link, useNavigate } from "react-router-dom";
// import { FaRegUserCircle, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
// import { useAppContext } from "../../context/AppContext";
// import { toast } from "react-toastify";
// import { CircleUserRound, LayoutDashboard } from "lucide-react";
// // import Logo2 from "../assets/logo2.png"

// export function NavBar() {
//   const [mobileView, setMobileView] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(3); // Example notification count
//   const { user, setUser } = useAppContext();

//   const navigate = useNavigate();

//   // Load user data from localStorage on component mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.error("Error parsing stored user data:", error);
//       }
//     }
//   }, [setUser]);
//   return (
//     <nav className="absolute top-0 left-0 w-full z-50">
//       <div className=" max-w-[1440px] w-full mx-auto px-4 md:px-6 lg:px-10 flex-wrap">
//         <div className="grid grid-cols-3 items-center w-full pt-4">
//           {/* Logo Section */}
//           <div onClick={() => navigate("/")} className="flex items-center w-[205px] h-[70px] cursor-pointer">
//             <div className="flex items-center h-[66px]">
//               <img src={Logo2} alt="Logo" className="w-[50px]" />
//             </div>
//             <div className="flex items-center justify-center">
//               <h2 className="font-sans font-bold text-white text-[27px]">
//                 DOCKET
//               </h2>
//             </div>
//           </div>

//           {/* Centered Navigation Menu */}
//           <div className="flex justify-center">
//             <div className="hidden md:flex items-center justify-center gap-8 px-8 py-4 bg-white/10 backdrop-blur-xl border border-blue-600/50 rounded-2xl shadow-2xl shadow-purple-500/20">              <div className="group cursor-pointer relative">
//               <Link
//                 to="/"
//                 className="font-sans font-light text-white font-lexend text-[15px] transition-colors group-hover:text-blue-300"
//               >
//                 Home
//               </Link>
//               <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-600 group-hover:w-full transition-all duration-300 rounded-full" />
//             </div>

//               <div className="group cursor-pointer relative">
//                 {user?.userType === "teacher" ? (
//                   <Link
//                     to="/teacher"
//                     className="font-sans font-light font-lexend text-white text-[15px] transition-colors group-hover:text-blue-300"
//                   >
//                     Teacher Dashboard
//                   </Link>
//                 ) : (
//                   <Link
//                     to="/dashboard"
//                     className="font-sans font-light font-lexend text-white text-[15px] transition-colors group-hover:text-blue-300"
//                   >
//                     User Dashboard
//                   </Link>
//                 )}
//                 <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-600 group-hover:w-full transition-all duration-300 rounded-full" />
//               </div>

//               <div className="group cursor-pointer relative">
//                 <Link
//                   to="/reports"
//                   className="font-sans font-light font-lexend text-white text-[15px] transition-colors group-hover:text-blue-300"
//                 >
//                   Reports
//                 </Link>
//                 <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-600 group-hover:w-full transition-all duration-300 rounded-full" />
//               </div>

//               <div className="group cursor-pointer relative">
//                 <Link
//                   to="/about"
//                   className="font-sans font-light font-lexend text-white text-[15px] transition-colors group-hover:text-blue-300">
//                   About
//                 </Link>
//                 <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-600 group-hover:w-full transition-all duration-300 rounded-full" />
//               </div>
//             </div>
//           </div>

//           {/* Right Section - Icons & User Menu */}
//           <div className="flex items-center justify-end gap-4">
//             {/* Bell Icon with Notification Badge */}
//             <div onClick={() => user ? navigate(user.userType === "teacher" ? "/teacher" : "/dashboard") : navigate("/login")} className="relative cursor-pointer group">
//               <HiOutlineBell strokeWidth={1} size={28}
//                 className="text-white text-2xl hover:text-purple-300 transition-colors duration-200"
//               />
//               {notificationCount > 0 && (
//                 <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs  rounded-full border-1 border-gray-600">
//                   {notificationCount > 99 ? '99+' : notificationCount}
//                 </span>
//               )}
//             </div>

//             {/* Profile Icon */}
//             <div
//               onClick={() => user ? navigate("/profile") : navigate("/login")}
//               className="cursor-pointer group"
//             >
//               <CircleUserRound strokeWidth={1} size={28}
//                 className="text-white text-2xl hover:text-purple-300 transition-colors duration-200"
//               />
//             </div>

//             {/* User Menu */}
//             {user ? (
//               <div className="flex items-center gap-3 ml-2">
//                 <div className="hidden lg:flex items-center gap-2">
//                   <span className="text-white font-light text-sm whitespace-nowrap">
//                     {/* Welcome, {user.name.split(' ')[0]} */}
//                     Welcome, {user?.name ? user.name.split(" ").slice(0, 2).join(" ") : user?.email?.split('@')[0] || 'User'}
//                   </span>
//                 </div>
//                 <button
//                   onClick={() => {
//                     // Clear user data
//                     localStorage.removeItem("token");
//                     localStorage.removeItem("user");
//                     localStorage.removeItem("userType");
//                     setUser(null);
//                     toast.success("Logged out successfully!");
//                     navigate("/");
//                   }}
//                   className="
//                       flex items-center justify-center gap-2
//                       px-4 py-2 h-[40px]
//                       bg-blue-600 hover:bg-blue-700
//                       text-white rounded-lg
//                       font-medium text-sm
//                       transition-all duration-200
//                       cursor-pointer
//                       shadow-md hover:shadow-lg
//                     "
//                 >
//                   <span className="hidden sm:inline">Logout</span>
//                   <span className="sm:hidden">×</span>
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={() => navigate("/login")}
//                 className="
//                     md:flex items-center justify-center gap-2
//                     px-6 py-2.5 h-[40px]
//                     bg-blue-600 hover:bg-blue-700
//                     text-white rounded-lg
//                     font-medium
//                     transition-all duration-200
//                     cursor-pointer
//                     shadow-md hover:shadow-lg
//                     hidden
//                   "
//               >
//                 <h3 className="font-sans text-[16px]">
//                   Loginxx
//                 </h3>
//               </button>
//             )}
//           </div>


//           {/* Mobile Menu Icon */}
//           <div className="flex md:hidden items-center justify-center text-white">
//             {mobileView ? (
//               <HiX
//                 className="text-3xl cursor-pointer"
//                 onClick={() => setMobileView(false)}
//               />
//             ) : (
//               <HiOutlineMenu
//                 className="text-3xl cursor-pointer"
//                 onClick={() => setMobileView(true)}
//               />
//             )}
//           </div>
//         </div>

//         {/* Mobile Dropdown Menu (Animated) */}
//         <AnimatePresence>
//           {mobileView && (
//             <motion.div
//               key="mobileMenu"
//               initial={{ x: "100%", opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: "100%", opacity: 0 }}
//               transition={{ type: "spring", stiffness: 80, damping: 20 }}
//               className="fixed top-0 right-0 w-[85%] md:w-1/2 h-full bg-[#03050C]/95 backdrop-blur-3xl border-l border-white/10 shadow-2xl z-50 flex flex-col font-out"
//             >
//               {/* Header */}
//               <div className="flex items-center justify-between p-6 border-b border-white/10">
//                 <span className="text-white font-black text-xl tracking-tight">MENU</span>
//                 <div
//                   onClick={() => setMobileView(false)}
//                   className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 cursor-pointer transition-colors"
//                 >
//                   <HiX className="text-xl" />
//                 </div>
//               </div>

//               {/* User Profile Section */}
//               <div className="p-6">
//                 {user ? (
//                   <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-6">
//                     <div className="flex items-center gap-4 mb-4">
//                       <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg overflow-hidden">
//                         {user.image ? (
//                           <img src={user.image} alt="User" className="w-full h-full object-cover" />
//                         ) : (
//                           <span className="text-xl font-bold">{user.name?.charAt(0) || "U"}</span>
//                         )}
//                       </div>
//                       <div className="overflow-hidden">
//                         <h3 className="text-white font-bold text-lg truncate">{user.name}</h3>
//                         <p className="text-blue-200/60 text-xs font-medium uppercase tracking-wider flex items-center gap-1">
//                           {user.userType === 'teacher' ? <FaChalkboardTeacher /> : <FaUserGraduate />}
//                           {user.userType}
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => {
//                         navigate(user?.userType === "teacher" ? "/teacher" : "/dashboard");
//                         setMobileView(false);
//                       }}
//                       className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
//                     >
//                       <LayoutDashboard size={16} />
//                       Go to Dashboard
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="bg-white/5 border border-white/5 rounded-3xl p-6 text-center">
//                     <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
//                       <HiOutlineUser className="text-3xl" />
//                     </div>
//                     <h3 className="text-white font-bold mb-1">Welcome, Guest</h3>
//                     <p className="text-gray-500 text-sm mb-4">Login to access your dashboard</p>
//                     <button
//                       onClick={() => {
//                         navigate("/login");
//                         setMobileView(false);
//                       }}
//                       className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/40"
//                     >
//                       Login Now
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Navigation Links */}
//               <div className="flex-1 overflow-y-auto px-6 space-y-2">
//                 <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 pl-2">Navigation</p>

//                 <Link
//                   to="/"
//                   onClick={() => setMobileView(false)}
//                   className="flex items-center gap-4 p-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all group"
//                 >
//                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
//                     <HiHome className="text-xl" />
//                   </div>
//                   <span className="font-bold">Home</span>
//                 </Link>

//                 <Link
//                   to="/reports"
//                   onClick={() => setMobileView(false)}
//                   className="flex items-center gap-4 p-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all group"
//                 >
//                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-purple-600/20 group-hover:text-purple-400 transition-colors">
//                     <HiDocumentText className="text-xl" />
//                   </div>
//                   <span className="font-bold">Reports</span>
//                 </Link>

//                 <Link
//                   to="/about"
//                   onClick={() => setMobileView(false)}
//                   className="flex items-center gap-4 p-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all group"
//                 >
//                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-600/20 group-hover:text-emerald-400 transition-colors">
//                     <HiInformationCircle className="text-xl" />
//                   </div>
//                   <span className="font-bold">About Us</span>
//                 </Link>

//                 {/* Extra Links often needed in mobile but hidden in desktop */}
//                 {/* <button className="flex items-center gap-4 p-4 w-full text-left text-gray-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all group">
//                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-amber-600/20 group-hover:text-amber-400 transition-colors">
//                     <HiCalendar className="text-xl" />
//                   </div>
//                   <span className="font-bold">Events</span>
//                 </button> */}
//               </div>

//               {/* Footer / Logout */}
//               {user && (
//                 <div className="p-6 border-t border-white/10">
//                   <button
//                     onClick={() => {
//                       localStorage.removeItem("token");
//                       localStorage.removeItem("user");
//                       localStorage.removeItem("userType");
//                       setUser(null);
//                       setMobileView(false);
//                       toast.success("Logged out successfully!");
//                       navigate("/");
//                     }}
//                     className="w-full py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold flex items-center justify-center gap-2 transition-colors"
//                   >
//                     <HiLogout className="text-xl" />
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </nav>
//   );
// }

/////////////////////////////////////////////////////////////////////////////////

import Logo2 from "../../assets/logo2.png";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { HiOutlineMenu, HiX, HiOutlineBell, HiOutlineUser, HiHome, HiDocumentText, HiCalendar, HiInformationCircle, HiLogout } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaRegUserCircle, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { CircleUserRound, LayoutDashboard } from "lucide-react";

export function NavBar() {
  const [mobileView, setMobileView] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const { user, setUser } = useAppContext();

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  }, [setUser]);

  return (
    <nav className="absolute top-0 left-0 w-full z-50 font-out">
      <div className="max-w-[1440px] w-full mx-auto px-4 md:px-6 lg:px-10 flex-wrap">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center w-full pt-4">

          {/* Logo Section */}
          <div onClick={() => navigate("/")} className="flex items-center w-[205px] h-[70px] cursor-pointer">
            <div className="flex items-center h-[66px]">
              <img src={Logo2} alt="Logo" className="w-[50px]" />
            </div>
            <div className="flex items-center justify-center">
              <h2 className="font-sans font-bold text-white text-[27px]">
                DOCKET
              </h2>
            </div>
          </div>

          {/* Centered Navigation Menu (Desktop only) */}
          <div className="hidden md:flex justify-center">
            <div className="flex items-center justify-center gap-8 px-8 py-4 bg-white/10 backdrop-blur-xl border border-blue-600/50 rounded-2xl shadow-2xl shadow-purple-500/20">

              <div className="group cursor-pointer relative">
                <Link
                  to="/"
                  className="font-sans font-light text-white font-lexend text-[15px] transition-colors group-hover:text-blue-300"
                >
                  Home
                </Link>
                <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-600 group-hover:w-full transition-all duration-300 rounded-full" />
              </div>

              <div className="group cursor-pointer relative">
                {user?.role === "teacher" ? (
                  <Link
                    to="/teacher"
                    className="font-sans font-light font-lexend text-white text-[15px] transition-colors group-hover:text-blue-300"
                  >
                    Teacher Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="font-sans font-light font-lexend text-white text-[15px] transition-colors group-hover:text-blue-300"
                  >
                    User Dashboard
                  </Link>
                )}
                <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-600 group-hover:w-full transition-all duration-300 rounded-full" />
              </div>

              <div className="group cursor-pointer relative">
                <Link
                  to="/reports"
                  className="font-sans font-light font-lexend text-white text-[15px] transition-colors group-hover:text-blue-300"
                >
                  Reports
                </Link>
                <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-600 group-hover:w-full transition-all duration-300 rounded-full" />
              </div>

              <div className="group cursor-pointer relative">
                <Link
                  to="/about"
                  className="font-sans font-light font-lexend text-white text-[15px] transition-colors group-hover:text-blue-300"
                >
                  About
                </Link>
                <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-600 group-hover:w-full transition-all duration-300 rounded-full" />
              </div>

            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-end gap-4">

            {/* Bell Icon */}
            <div
              onClick={() =>
                user
                  ? navigate(user.role === "teacher" ? "/teacher" : "/dashboard")
                  : navigate("/login")
              }
              className="relative cursor-pointer group"
            >
              <HiOutlineBell
                strokeWidth={1}
                size={28}
                className="text-white hover:text-purple-300 transition-colors duration-200"
              />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs rounded-full border-1 border-gray-600">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </div>

            {/* Profile Icon */}
            <div
              onClick={() => (user ? navigate("/profile") : navigate("/login"))}
              className="cursor-pointer group"
            >
              <CircleUserRound
                strokeWidth={1}
                size={28}
                className="text-white hover:text-purple-300 transition-colors duration-200"
              />
            </div>

            {/* Desktop Logout */}
            {user ? (
              <div className="hidden md:flex items-center gap-3 ml-2">
                <div className="hidden lg:flex items-center gap-2">
                  <span className="text-white font-light text-sm whitespace-nowrap">
                    Welcome,{" "}
                    {user?.name
                      ? user.name.split(" ").slice(0, 2).join(" ")
                      : user?.email?.split("@")[0] || "User"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    // localStorage.removeItem("userType"); // Removing userType from local storage is fine, but we relied on user.role
                    setUser(null);
                    toast.success("Logged out successfully!");
                    navigate("/");
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 h-[40px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">×</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="hidden md:flex items-center justify-center gap-2 px-6 py-2.5 h-[40px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
              >
                <h3 className="font-sans text-[16px]">Login</h3>
              </button>
            )}

            {/* Mobile Menu Icon */}
            <div className="flex md:hidden items-center text-white">
              {mobileView ? (
                <HiX
                  className="text-3xl cursor-pointer"
                  onClick={() => setMobileView(false)}
                />
              ) : (
                <HiOutlineMenu
                  className="text-3xl cursor-pointer"
                  onClick={() => setMobileView(true)}
                />
              )}
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu (Animated) */}
        {/* Mobile Dropdown Menu (Animated) */}
        <AnimatePresence>
          {mobileView && (
            <motion.div
              key="mobileMenu"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="fixed top-0 right-0 w-[85%] md:w-1/2 h-full bg-[#03050C]/95 backdrop-blur-3xl border-l border-white/10 shadow-2xl z-50 flex flex-col font-out"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <span className="text-white font-black text-xl tracking-tight">
                  MENU
                </span>
                <div
                  onClick={() => setMobileView(false)}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <HiX className="text-xl" />
                </div>
              </div>

              {/* User Profile Section */}
              <div className="p-6">
                {user ? (
                  <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg overflow-hidden">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold">
                            {user.name?.charAt(0) || "U"}
                          </span>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="text-white font-bold text-lg truncate">
                          {user.name}
                        </h3>
                        <p className="text-blue-200/60 text-xs font-medium uppercase tracking-wider flex items-center gap-1">
                          {user.role === "teacher" ? (
                            <FaChalkboardTeacher />
                          ) : (
                            <FaUserGraduate />
                          )}
                          {user.role}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigate(
                          user?.role === "teacher"
                            ? "/teacher"
                            : "/dashboard"
                        );
                        setMobileView(false);
                      }}
                      className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard size={16} />
                      Go to Dashboard
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/5 rounded-3xl p-6 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                      <HiOutlineUser className="text-3xl" />
                    </div>
                    <h3 className="text-white font-bold mb-1">
                      Welcome, Guest
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Login to access your dashboard
                    </p>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setMobileView(false);
                      }}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/40"
                    >
                      Login Now
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto px-6 space-y-2">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 pl-2">
                  Navigation
                </p>

                <Link
                  to="/"
                  onClick={() => setMobileView(false)}
                  className="flex items-center gap-4 p-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                    <HiHome className="text-xl" />
                  </div>
                  <span className="font-bold">Home</span>
                </Link>

                <Link
                  to="/reports"
                  onClick={() => setMobileView(false)}
                  className="flex items-center gap-4 p-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-purple-600/20 group-hover:text-purple-400 transition-colors">
                    <HiDocumentText className="text-xl" />
                  </div>
                  <span className="font-bold">Reports</span>
                </Link>

                <Link
                  to="/about"
                  onClick={() => setMobileView(false)}
                  className="flex items-center gap-4 p-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-600/20 group-hover:text-emerald-400 transition-colors">
                    <HiInformationCircle className="text-xl" />
                  </div>
                  <span className="font-bold">About Us</span>
                </Link>
              </div>

              {/* Footer / Logout */}
              {user && (
                <div className="p-6 border-t border-white/10">
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      localStorage.removeItem("userType");
                      setUser(null);
                      setMobileView(false);
                      toast.success("Logged out successfully!");
                      navigate("/");
                    }}
                    className="w-full py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <HiLogout className="text-xl" />
                    Logout
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </nav>
  );
}
