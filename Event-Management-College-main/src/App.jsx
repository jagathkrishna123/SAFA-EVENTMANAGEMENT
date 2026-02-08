import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Display } from "./Display/display";
import ProgramDetails from "./Display/ProgramDetails/ProgramDetails";
import FooterContents from "./Display/Footer/FooterContents";
import { NavBar } from "./Display/NavBar/navBar";
import Login from "./Display/Loign/Login";
import Layout from "./pages/teacher/Layout";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddEvent from "./pages/teacher/AddEvent";
import Registrations from "./pages/teacher/Registrations";
import Attendence from "./pages/teacher/Attendence";
import AdminLayout from "./pages/admin/Layout";
import AdminAddEvent from "./pages/admin/AddEvent";
import AdminRegistrations from "./pages/admin/Registrations";
import AdminAttendence from "./pages/admin/Attendence";
import AddProgram from "./pages/admin/AddProgram";
import TeacherAddProgram from "./pages/teacher/TeacherAddProgram";
import EventDeatils from "./Display/EventDetails/EventDeatils";
import { useAppContext } from "./context/AppContext";
import ScrollToTop from "./Display/ScrollToTop";
import EventRegistration from "./Display/EventRegistration/EventRegistration";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageProgram from "./pages/admin/ManageProgram";
import AddStudent from "./pages/teacher/AddStudent";
import AddTeacher from "./pages/admin/AddTeacher";
import AddReports from "./pages/teacher/AddReports";
import Reports from "./pages/teacher/Reports";
import UserDashboard from "./pages/UserDashboard";
import Rating from "./pages/teacher/Rating";
import UserProfile from "./pages/UserProfile";
import About from "./pages/About";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminNotification from "./pages/admin/AdminNotification";
import TeacherNotification from "./pages/teacher/TeacherNotification";

function App() {
  const { pathname } = useLocation()
  const hideLayout = pathname.includes("admin") || pathname.includes("teacher") || pathname.includes("login");
  const { showUserLogin, user } = useAppContext()
  return (
    <div className="bg-gradient-to-br from-neutral-900 via-gray-900 to-black
">
      <ScrollToTop />
      {showUserLogin && <LoginForm />}
      <div className="w-full">
        {!hideLayout && <NavBar />}
      </div>
      <ToastContainer position="bottom-right" autoClose={800} />
      <Routes>
        <Route path="/" element={<Display />} />
        <Route path="/programdetails/:id" element={<ProgramDetails />} />
        <Route path="/eventdetails/:id" element={<EventDeatils />} />
        <Route path="/event/:id/register" element={<EventRegistration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<UserProfile />} />

        <Route path='/teacher' element={true ? <Layout /> : <Login />}>
          <Route index element={<TeacherDashboard />} />
          <Route path='teacher-add-program' element={<TeacherAddProgram />} />
          <Route path='addevent' element={<AddEvent />} />
          <Route path='rating' element={<Rating />} />
          <Route path='registrations' element={<Registrations />} />
          <Route path='attendence' element={<Attendence />} />
          <Route path='addstudent' element={<AddStudent />} />
          <Route path='addreports' element={<AddReports />} />
          <Route path='teacher-notification' element={<TeacherNotification />} />
        </Route>
        
        <Route path='/admin' element={true ? <AdminLayout /> : <Login />}>
          <Route index element={<AdminDashboard />} />
          <Route path='admin-add-program' element={<AddProgram />} />
          <Route path='addevent' element={<AdminAddEvent />} />
          <Route path='addevent/:id' element={<AdminAddEvent />} />
          <Route path='manageprogram' element={<ManageProgram />} />
          <Route path='feedback' element={<AdminFeedback />} />
          <Route path='registrations' element={<AdminRegistrations />} />
          <Route path='attendence' element={<AdminAttendence />} />
          <Route path='addteacher' element={<AddTeacher />} />
          <Route path='admin-notification' element={<AdminNotification />} />
        </Route>
      </Routes>
      {!hideLayout && <FooterContents />}

    </div>
  );
}
export default App;
