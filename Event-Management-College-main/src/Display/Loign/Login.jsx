import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";

// Configure base URL for axios
const API_URL = "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAppContext();

  // Flow states: 'id-input' | 'otp-verification' | 'signup' | 'login'
  const [step, setStep] = useState("id-input");
  const [userType, setUserType] = useState(null); // 'student' | 'teacher'
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  // ID Input state
  const [idInput, setIdInput] = useState("");

  // OTP state
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    department: "",
    semester: "",
    admissionNumber: "", // For students
    registerNumber: "",
    gender: "", // For teachers
    designation: "", // For teachers
    qualification: "", // For teachers
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    registerNumber: "",
    password: "",
  });

  // Generate OTP (6-digit random number)
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Department code mapping
  const departmentMap = {
    BCM: "B.Com (Bachelor of Commerce)",
    SPY: "Psychology",
    BCA: "Bachelor of Computer Application",
    BSW: "Bachelor of Social Work",
    BBA: "Bachelor of Business Administration",
  };

  // Extract department from ID
  const extractDepartment = (id) => {
    // Format: AEDXBCM002, SFAXBCA001, or SFAYBBA003
    // Extract the department code (3 letters after the separator letter like X or Y)
    // Matches patterns like SFAXBCA... where X is the 4th char acting as separator
    const match = id.match(/[A-Z]{3}[A-Z]([A-Z]{3})/);
    if (match && match[1]) {
      const deptCode = match[1];
      return departmentMap[deptCode] || deptCode;
    }
    return "";
  };

  // Handle ID submission
  const handleIdSubmit = async (e) => {
    e.preventDefault();
    const id = idInput.trim().toUpperCase();

    if (!id) {
      toast.error("Please enter an ID");
      return;
    }

    // Admin Redirection - REMOVED (Handled by backend now)
    /*
    if (id === "ADMIN001") {
      navigate("/admin");
      return;
    }
    */

    try {
      const response = await axios.post(`${API_URL}/verify-id`, { registerNumber: id });
      const { status, email, role, message } = response.data;

      if (status === "registered") {
        toast.info(message || "Account found! Please login.");
        setStep("login");
        setLoginData(prev => ({ ...prev, registerNumber: id }));
        return;
      }

      if (status === "allowed") {
        // Admin Bypass: Direct Login
        if (role === "admin") {
          const adminUser = {
            name: "Administrator",
            email: email,
            role: "admin",
            registerNumber: id
          };
          setUser(adminUser);
          localStorage.setItem("user", JSON.stringify(adminUser));
          localStorage.setItem("userType", "admin");
          toast.success("Welcome Admin!");
          navigate("/admin");
          return;
        }

        // Common logic after user is found
        const detectedDept = extractDepartment(id);
        setUserType(role);
        setUserEmail(email);
        setUserId(id);
        setSignupData((prev) => ({
          ...prev,
          registerNumber: id,
          email: email,
          department: detectedDept
        }));

        // Send OTP
        try {
          const otpResponse = await axios.post(`${API_URL}/send-otp`, { registerNumber: id });
          if (otpResponse.data.otp) {
            setGeneratedOtp(otpResponse.data.otp); // For testing display
            console.log(`OTP for ${id}: ${otpResponse.data.otp}`);
          }
          setOtpSent(true);
          setStep("otp-verification");
          toast.info(`OTP sent to ${email}`);
        } catch (otpError) {
          console.error("OTP Error:", otpError);
          toast.error("Failed to send OTP. Please try again.");
        }
      }

    } catch (error) {
      console.error("ID Verification Error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred. Please check your connection.");
      }
    }
  };

  // Handle OTP verification
  const handleOtpVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      await axios.post(`${API_URL}/verify-otp`, {
        registerNumber: userId,
        otp: otp
      });
      toast.success("OTP verified successfully!");
      setStep("signup");
    } catch (error) {
      console.error("OTP Verification Error:", error);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  // Handle signup submission
  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation
    if (!signupData.name || !signupData.password || !signupData.mobile || !signupData.department) {
      toast.error("Please fill all required fields");
      return;
    }

    if (userType === "student" && !signupData.semester) {
      toast.error("Semester is required for students");
      return;
    }

    if (userType === "student" && !signupData.admissionNumber) {
      toast.error("Admission number is required for students");
      return;
    }

    if (userType === "teacher" && !signupData.gender) {
      toast.error("Gender is required for teachers");
      return;
    }

    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!/^\d{10}$/.test(signupData.mobile)) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    try {
      const payload = {
        ...signupData,
        role: userType, // Backend expects 'role', frontend state is 'userType'
      };

      // Remove confirmPassword
      delete payload.confirmPassword;

      await axios.post(`${API_URL}/register`, payload);

      toast.success(`${userType === "student" ? "Student" : "Teacher"} registered successfully!`);

      // Auto go to login
      setStep("login");
      setLoginData((prev) => ({ ...prev, registerNumber: signupData.registerNumber }));

      // Reset signup form
      setSignupData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile: "",
        department: "",
        semester: "",
        admissionNumber: "",
        registerNumber: "",
        gender: "",
        designation: "",
        qualification: "",
      });

    } catch (error) {
      console.error("Signup error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred during registration.");
      }
    }
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.registerNumber || !loginData.password) {
      toast.error("Please enter register number and password");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, {
        registerNumber: loginData.registerNumber,
        password: loginData.password
      });

      const { user } = response.data;

      if (user) {
        toast.success("Login successful!");

        // Store user data in localStorage (maintain existing structure for now)
        localStorage.setItem("token", "local-token-" + Date.now()); // Placeholder token
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userType", user.role);

        // Set user in context
        setUser(user);

        // Navigate to appropriate dashboard
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "teacher") {
          navigate("/teacher");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred during login.");
      }
    }
  };

  // Reset OTP (for resend functionality)
  const handleResendOtp = async () => {
    try {
      const otpResponse = await axios.post(`${API_URL}/send-otp`, { registerNumber: userId });
      if (otpResponse.data.otp) {
        setGeneratedOtp(otpResponse.data.otp);
        console.log(`New OTP for ${userId}: ${otpResponse.data.otp}`);
      }
      setOtp("");
      toast.info("OTP resent.");
    } catch (error) {
      console.error("Resend OTP Error:", error);
      toast.error("Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-gray-900 to-black p-4">
      <div className="w-full max-w-md">
        {/* ID Input Step */}
        {step === "id-input" && (
          <form onSubmit={handleIdSubmit} className="bg-gray-700/30 backdrop-blur-lg border border-white/10 rounded-xl p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-2">Verify</h2>
            <p className="text-gray-400 mb-6">Enter your ID to continue</p>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Register Number/ID</label>
              <input
                type="text"
                value={idInput}
                onChange={(e) => setIdInput(e.target.value.toUpperCase())}
                placeholder="xxxxxxxxxx"
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
            >
              Continue
            </button>
          </form>
        )}

        {/* OTP Verification Step */}
        {step === "otp-verification" && (
          <form onSubmit={handleOtpVerify} className="bg-gray-700/30 backdrop-blur-lg border border-white/10 rounded-xl p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-2">Verify OTP</h2>
            <p className="text-gray-400 mb-2">OTP sent to: {userEmail}</p>

            {/* Display OTP for testing */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 text-sm font-medium mb-2">For Testing: Your OTP is</p>
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-yellow-400 tracking-widest bg-gray-800/50 px-6 py-2 rounded-lg border border-yellow-500/30">
                  {generatedOtp}
                </span>
              </div>
              <p className="text-yellow-400/80 text-xs mt-2 text-center">This OTP is also logged to browser console</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                className="px-4 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition"
              >
                Resend
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setStep("id-input");
                setIdInput("");
                setOtp("");
                setUserType(null);
                setUserEmail("");
                setUserId("");
                setSignupData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                  mobile: "",
                  department: "",
                  semester: "",
                  admissionNumber: "",
                  registerNumber: "",
                  gender: "",
                  designation: "",
                  qualification: "",
                });
              }}
              className="mt-4 text-gray-400 hover:text-white text-sm"
            >
              ← Back
            </button>
          </form>
        )}

        {/* Signup Form Step */}
        {step === "signup" && (
          <form onSubmit={handleSignup} className="bg-gray-700/30 backdrop-blur-lg border border-white/10 rounded-xl p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {userType === "student" ? "Student" : "Teacher"} Signup
            </h2>
            <p className="text-gray-400 mb-6">Complete your registration</p>

            <div className="space-y-4">
              <Input
                label="Full Name"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                required
              />

              <Input
                label="Email"
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                disabled
                className="bg-gray-800/30"
              />

              <Input
                label="Register Number/ID"
                value={signupData.registerNumber}
                onChange={(e) => setSignupData({ ...signupData, registerNumber: e.target.value.toUpperCase() })}
                disabled
                className="bg-gray-800/30"
              />

              <Input
                label="Mobile Number"
                type="tel"
                value={signupData.mobile}
                onChange={(e) => setSignupData({ ...signupData, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                placeholder="10 digits"
                required
              />

              <Input
                label="Department"
                value={signupData.department}
                onChange={(e) => setSignupData({ ...signupData, department: e.target.value })}
                disabled
                className="bg-gray-800/30"
              />

              {userType === "student" && (
                <>
                  <Input
                    label="Semester"
                    value={signupData.semester}
                    onChange={(e) => setSignupData({ ...signupData, semester: e.target.value })}
                    required
                  />
                  <Input
                    label="Admission Number"
                    value={signupData.admissionNumber}
                    onChange={(e) => setSignupData({ ...signupData, admissionNumber: e.target.value.toUpperCase() })}
                    required
                  />

                </>
              )}

              {userType === "teacher" && (
                <>
                  <div>
                    <label className="block text-gray-300 mb-2">Gender <span className="text-red-500">*</span></label>
                    <select
                      value={signupData.gender}
                      onChange={(e) => setSignupData({ ...signupData, gender: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <Input
                    label="Designation"
                    value={signupData.designation}
                    onChange={(e) => setSignupData({ ...signupData, designation: e.target.value })}
                    placeholder="e.g., Assistant Professor, Associate Professor"
                    required
                  />
                  <Input
                    label="Qualification"
                    value={signupData.qualification}
                    onChange={(e) => setSignupData({ ...signupData, qualification: e.target.value })}
                    placeholder="e.g., M.Sc, Ph.D, M.Com"
                    required
                  />
                </>
              )}

              <Input
                label="Password"
                type="password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
                minLength={6}
              />

              <Input
                label="Confirm Password"
                type="password"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition mt-6"
            >
              Create Account
            </button>

            <p className="mt-4 text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setStep("login")}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Login here
              </button>
            </p>

            <button
              type="button"
              onClick={() => setStep("otp-verification")}
              className="mt-4 text-gray-400 hover:text-white text-sm"
            >
              ← Back
            </button>
          </form>
        )}

        {/* Login Form Step */}
        {step === "login" && (
          <form onSubmit={handleLogin} className="bg-gray-700/30 backdrop-blur-lg border border-white/10 rounded-xl p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-2">Login</h2>
            <p className="text-gray-400 mb-6">Enter your credentials to continue</p>

            <div className="space-y-4">
              <Input
                label="Register Number"
                value={loginData.registerNumber}
                onChange={(e) => setLoginData({ ...loginData, registerNumber: e.target.value.toUpperCase() })}
                required
              />

              <Input
                label="Password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition mt-6"
            >
              Login
            </button>

            <p className="mt-4 text-center text-gray-400 text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setStep("id-input");
                  setIdInput("");
                  setOtp("");
                  setUserType(null);
                  setUserEmail("");
                  setUserId("");
                  setSignupData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    mobile: "",
                    department: "",
                    semester: "",
                    admissionNumber: "",
                    registerNumber: "",
                    gender: "",
                    designation: "",
                    qualification: "",
                  });
                }}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Sign up
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

// Reusable Input Component
const Input = ({ label, value, onChange, type = "text", placeholder = "", required = false, disabled = false, className = "", ...props }) => (
  <div>
    <label className="block text-gray-300 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 ${className}`}
      {...props}
    />
  </div>
);

export default Login;
