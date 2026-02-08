import Image1 from "../assets/image1.png";
import Image2 from "../assets/image2.png";
import Image3 from "../assets/image3.png";
import img12 from "../assets/img12.jpg"
import img13 from "../assets/img13.jpg"
import img14 from "../assets/img14.jpg"
import img15 from "../assets/img15.jpg"
import img16 from "../assets/img16.jpg"
import img17 from "../assets/img17.jpg"
import img18 from "../assets/img18.jpg"
import img19 from "../assets/img19.jpg"

import img20 from "../assets/img20.jpg"
import img21 from "../assets/img21.jpg"
import img22 from "../assets/img22.png"
import img23 from "../assets/img23.png"
import img24 from "../assets/img24.jpg"
import img11 from "../assets/img11.jpg"
import { FaCheckCircle, FaStar, FaBolt, FaLightbulb, } from "react-icons/fa";



//PROGRAMS
export const Items = [
  {
    id: 1,
    Name: "Hackathon",
    category: "Technical",
    image: Image1,
    Title: "india's largest student hackathon",
    programDate: "March 18, 2025",
    programTime: "48 Hours",
    Description:
      "A high-energy 48-hour coding marathon where students buildA fast-paced design challenge where teams ideate,teams ideate, prototype,A fast-paced design challenge where teams ideate, prototype, and pitch solutions usingteams ideate, prototype,A fast-paced design challenge where teams ideate, prototype, and pitch solutions using prototype, and pitch solutions using real design-thinking methodsA fast-paced design challenge where teams ideate, prototype, and pitch solutions using real design-thinking methods creative solutions and innovate with real-world challenges.",
    features: [
      { icon: FaBolt, name: "48-hour coding challenge" },
      { icon: FaCheckCircle, name: "Team collaboration" },
      { icon: FaLightbulb, name: "Mentorship from experts" },
      { icon: FaStar, name: "Real-world problem solving" }
    ]
  },

  {
    id: 2,
    Name: "Design Sprint",
    category: "Workshop & Training",
    image: Image2,
    Title: "Campus Design Sprint – Turning Ideas Into Solutions",
    programDate: "April 10, 2025",
    programTime: "38 Hours",
    Description:
      "A fast-paced design challenge where teams ideate, prototype,A fast-paced design challenge where teams teams ideate, prototype,A fast-paced design challenge where teams ideate, prototype, and pitch solutions usingteams ideate, prototype,A fast-paced design challenge where teams ideate, prototype, and pitch solutions usingideate, prototype, and pitch solutions using real design-thinking methodsA fast-paced design challenge where teams ideate, prototype, and pitch solutions using real design-thinking methods and pitch solutions using real design-thinking methods.",
    features: [
      { icon: FaLightbulb, name: "Design-thinking workflow" },
      { icon: FaCheckCircle, name: "Rapid prototyping" },
      { icon: FaStar, name: "User testing sessions" },
      { icon: FaBolt, name: "Pitching to experts" }
    ]
  },

  {
    id: 3,
    Name: "Tech Meetup",
    category: "Technical",
    image: Image3,
    Title: "Campus Tech Meetup – Where Ideas Meet Technology",
    programDate: "May 5, 2025",
    programTime: "20 Hours",
    Description:
      "A tech gathering featuring expert talks, demos,A fast-paced design challenge where teams ideate, prototype, and pitch solutions using real design-thinking methodsA fast-paced design challenge where teams ideate, prototype,teams ideate, prototype,A fast-paced design challenge where teams ideate, prototype, and pitch solutions usingteams ideate, prototype,A fast-paced design challenge where teams ideate, prototype, and pitch solutions using and pitch solutions using real design-thinking methods and networking for students interested in innovation and technology.",
    features: [
      { icon: FaCheckCircle, name: "Industry expert talks" },
      { icon: FaStar, name: "Live tech demos" },
      { icon: FaBolt, name: "Networking opportunities" },
      { icon: FaLightbulb, name: "Panel discussions" }
    ]
  },

  {
    id: 4,
    Name: "AI Workshop",
    category: "Workshop & Training",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Title: "AI & Machine Learning Workshop – Future of Technology",
    programDate: "June 15, 2025",
    programTime: "16 Hours",
    Description:
      "An intensive hands-on workshop on Artificial Intelligence and Machine Learning fundamentals. Learn to build AI models, understand neural networks, and explore practical applications of AI in various industries. Perfect for students interested in cutting-edge technology.",
    features: [
      { icon: FaBolt, name: "Hands-on AI training" },
      { icon: FaCheckCircle, name: "Neural network concepts" },
      { icon: FaStar, name: "Real-world applications" },
      { icon: FaLightbulb, name: "Industry experts" }
    ]
  },

  {
    id: 5,
    Name: "Startup Pitch",
    category: "Career & Placement",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Title: "Campus Startup Pitch Competition – Turn Ideas into Reality",
    programDate: "July 10, 2025",
    programTime: "12 Hours",
    Description:
      "A competitive platform for student entrepreneurs to pitch their innovative startup ideas. Get mentorship from successful entrepreneurs, network with investors, and compete for funding and incubation opportunities. Transform your ideas into viable business ventures.",
    features: [
      { icon: FaBolt, name: "Pitch your startup idea" },
      { icon: FaCheckCircle, name: "Mentorship from experts" },
      { icon: FaStar, name: "Networking opportunities" },
      { icon: FaLightbulb, name: "Funding chances" }
    ]
  },

  {
    id: 6,
    Name: "Cyber Security",
    category: "Workshop & Training",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Title: "Cyber Security Bootcamp – Protect the Digital World",
    programDate: "August 20, 2025",
    programTime: "24 Hours",
    Description:
      "Comprehensive training on cybersecurity fundamentals, ethical hacking techniques, and digital security best practices. Learn to identify vulnerabilities, implement security measures, and protect systems from cyber threats in this intensive bootcamp.",
    features: [
      { icon: FaBolt, name: "Ethical hacking training" },
      { icon: FaCheckCircle, name: "Security best practices" },
      { icon: FaStar, name: "Vulnerability assessment" },
      { icon: FaLightbulb, name: "Certification opportunity" }
    ]
  },

  {
    id: 7,
    Name: "Data Science",
    category: "Workshop & Training",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Title: "Data Science & Analytics Workshop – Unlock Data Insights",
    programDate: "September 5, 2025",
    programTime: "18 Hours",
    Description:
      "Dive deep into the world of data science with hands-on experience in data analysis, visualization, and machine learning algorithms. Learn Python, R, SQL, and popular data science libraries to extract meaningful insights from complex datasets.",
    features: [
      { icon: FaBolt, name: "Data analysis techniques" },
      { icon: FaCheckCircle, name: "Python & R programming" },
      { icon: FaStar, name: "Data visualization" },
      { icon: FaLightbulb, name: "Machine learning basics" }
    ]
  },

  {
    id: 8,
    Name: "Blockchain",
    category: "Technical",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Title: "Blockchain & Web3 Development – Future of Finance",
    programDate: "October 12, 2025",
    programTime: "20 Hours",
    Description:
      "Explore the revolutionary world of blockchain technology and Web3 development. Learn to build decentralized applications, understand cryptocurrency systems, and discover how blockchain is transforming industries beyond finance.",
    features: [
      { icon: FaBolt, name: "Blockchain fundamentals" },
      { icon: FaCheckCircle, name: "Smart contract development" },
      { icon: FaStar, name: "Decentralized apps" },
      { icon: FaLightbulb, name: "Cryptocurrency systems" }
    ]
  },
];

//EVENTS
export const PROGRAMDATAS = [
  {
    id: 1,
    programName:"Hackathon",
    image: img15,
    status: "Sports",
    name: "Inter-College Football Match",
    description: "Department of Physical Education",
    venue: "College Ground",
    prize: "₹20,000 + Trophy",
    registered: "12 Teams",
    isRecommended: true
    
  },
  {
    id: 2,
    image: img12,
    programName:"Tech Meetup",
    status: "Sports",
    name: "Badminton Doubles Tournament",
    description: "Department of Sports & Recreation",
    venue: "Indoor Stadium",
    prize: "₹8,000",
    registered: "12 Players",
    isRecommended: true
  },
  {
    id: 3,
    image: img13,
    programName:"Design Sprint",
    status: "Academics",
    name: "Technical Quiz Competition",
    description: "Department of Information Technology",
    venue: "Seminar Hall 1",
    prize: "₹5,000",
    registered: "15 Participants",
    isRecommended: false
  },
  {
    id: 4,
    image: img14,
    status: "Sports",
    programName:"Hackathon",
    name: "Cricket Knockout Challenge",
    description: "Department of Physical Education",
    venue: "Main Cricket Ground",
    prize: "₹25,000 + Medals",
    registered: "12 Teams",
    isRecommended: true
  },
  {
    id: 5,
    image: img11,
    programName:"Design Sprint",
    status: "Social",
    name: "Community Clean-Up Drive",
    description: "Department of Social Sciences",
    venue: "City Park",
    prize: "Certificates",
    registered: "18 Volunteers",
    isRecommended: false
  },
  {
    id: 6,
    image: img16,
    programName:"Hackathon",
    status: "Academics",
    name: "Science Project Exhibition",
    description: "Department of Science & Research",
    venue: "Block A Exhibition Hall",
    prize: "₹10,000",
    registered: "12 Teams",
    isRecommended: true
  },
  {
    id: 7,
    image: img17,
    programName:"Design Sprint",
    status: "Sports",
    name: "Relay Running Championship",
    description: "Department of Physical Education",
    venue: "Athletic Track",
    prize: "₹7,000",
    registered: "20 Athletes",
    isRecommended: false
  },
  {
    id: 8,
    image: img18,
    programName:"Tech Meetup",
    status: "Sports",
    name: "Basketball 3v3 Tournament",
    description: "Department of Sports & Recreation",
    venue: "Basketball Court",
    prize: "₹12,000",
    registered: "12 Teams",
    isRecommended: true
  },
  {
    id: 9,
    image: img19,
    programName:"Tech Meetup",
    status: "Sports",
    name: "Table Tennis Singles",
    description: "Department of Physical Education",
    venue: "Indoor Sports Hall",
    prize: "₹5,000",
    registered: "12 Participants",
    isRecommended: false
  }
];


export const teacherDashboard_data = {
  "events": 12,
  "upcomingEvents": 3,
  "completedEvents": 9
};

export const adminDashboard_data = {
  "events": 12,
  "upcomingEvents": 3,
  "completedEvents": 9
};

export const PROGRAMS = [
  { id: 1, name: "Hackathon 2025" },
  { id: 2, name: "AI Workshop" },
  { id: 3, name: "Web Development Bootcamp" },
  { id: 4, name: "Cyber Security Seminar" },
  { id: 5, name: "Cloud Computing Training" },
];

///////////////////////////////////////////////////////////////////////////
export const EVENTDATAS = [
  {
    id: 1,
    programName: "Hackathon",
    eventName: "24 Hour Coding Challenge",
    description:
      "A high-intensity 24-hour hackathon where teams collaborate to design, develop, and deploy innovative real-world solutions.",
    date: "2025-03-18",
    startTime: "09:00",
    endTime: "09:00",
    venue: "Block A Exhibition Hall",
    latitude: 11.2588,
    longitude: 75.7804,
    incharge: "Dr. Arun Kumar",
    department: "Computer Science",
    limit: 120,

    // 🔹 Images (links)
    poster: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    priceImage: "https://lh3.googleusercontent.com/gg-dl/ABS2GSnpBXA0bLWPT2jk5L_xrGZTwxNk7qdgtw6djzlI32l1aSdHHVwBCOyGE7wm-SX9-2agvVgv_OYVDzK-20o63Kr_R6Ozub2BntEtC_EKZA4hTEmhsI42WrOJ5y2Be9Qn9TSg0Fbe1aFu3hTgeElaQ1DrkcYLhgXbGfFb-mN9sb79rGx0cg=s1024-rj",
    sponsorImages: [
      "https://images.unsplash.com/photo-1529612700005-e35377bf1415",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    ],

    // 🔹 Participation
    participationType: "team",
    membersPerTeamFromDepartment: 4,
    teamsPerDepartment: 5,

    overallIndividualLimit: "",
    departmentIndividualLimit: "",
  },

  {
    id: 2,
    programName: "Tech Meetup",
    eventName: "Future of Web Technologies",
    description:
      "An expert-led meetup focusing on modern frontend frameworks, backend scalability, and AI-powered web apps.",
    date: "2025-04-05",
    startTime: "10:00",
    endTime: "13:00",
    venue: "Seminar Hall 1",
    latitude: 11.2595,
    longitude: 75.7812,
    incharge: "Ms. Sneha Raj",
    department: "Information Technology",
    limit: 80,

    poster: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    priceImage: "https://lh3.googleusercontent.com/gg-dl/ABS2GSnpBXA0bLWPT2jk5L_xrGZTwxNk7qdgtw6djzlI32l1aSdHHVwBCOyGE7wm-SX9-2agvVgv_OYVDzK-20o63Kr_R6Ozub2BntEtC_EKZA4hTEmhsI42WrOJ5y2Be9Qn9TSg0Fbe1aFu3hTgeElaQ1DrkcYLhgXbGfFb-mN9sb79rGx0cg=s1024-rj",
    sponsorImages: [
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    ],

    participationType: "individual",
    overallIndividualLimit: 80,
    departmentIndividualLimit: 10,

    membersPerTeamFromDepartment: "",
    teamsPerDepartment: "",
  },

  {
    id: 3,
    programName: "Design Sprint",
    eventName: "UI/UX Design Workshop",
    description:
      "Hands-on workshop covering wireframing, prototyping, usability testing, and visual design fundamentals.",
    date: "2025-04-20",
    startTime: "11:00",
    endTime: "16:00",
    venue: "Innovation Lab",
    latitude: 11.2579,
    longitude: 75.7798,
    incharge: "Mr. Rahul Menon",
    department: "Design & Media",
    limit: 60,

    poster: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?q=80&w=1152&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
    sponsorImages: [],

    participationType: "individual",
    overallIndividualLimit: 60,
    departmentIndividualLimit: 8,

    membersPerTeamFromDepartment: "",
    teamsPerDepartment: "",
  },

  {
    id: 4,
    programName: "Hackathon",
    eventName: "AI Model Building Contest",
    description:
      "Participants design and train AI models to solve real-world problems using data preprocessing and ML techniques.",
    date: "2025-05-02",
    startTime: "09:30",
    endTime: "17:30",
    venue: "Computer Lab 2",
    latitude: 11.2601,
    longitude: 75.7825,
    incharge: "Mr. Faisal Khan",
    department: "Artificial Intelligence",
    limit: 50,

    poster: "https://images.unsplash.com/photo-1504639725590-34d0984388bd",
    priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
    sponsorImages: [
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    ],

    participationType: "team",
    membersPerTeamFromDepartment: 3,
    teamsPerDepartment: 4,

    overallIndividualLimit: "",
    departmentIndividualLimit: "",
  },

  {
    id: 5,
    programName: "Design Sprint",
    eventName: "Community Innovation Drive",
    description:
      "Students collaborate to solve real-world community challenges with a focus on social impact.",
    date: "2025-05-15",
    startTime: "10:00",
    endTime: "14:00",
    venue: "City Park",
    latitude: 11.259,
    longitude: 75.7819,
    incharge: "Ms. Anjali Varma",
    department: "Social Sciences",
    limit: 100,

    poster: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b",
    priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
    sponsorImages: [],

    participationType: "individual",
    overallIndividualLimit: 100,
    departmentIndividualLimit: 15,

    membersPerTeamFromDepartment: "",
    teamsPerDepartment: "",
  },
  {
  id: 6,
  programName: "Tech Meetup",
  eventName: "Cloud Computing Essentials",
  description:
    "An introductory session on cloud computing concepts including IaaS, PaaS, SaaS, deployment models, and real-world cloud use cases.",
  date: "2025-06-08",
  startTime: "10:00",
  endTime: "13:00",
  venue: "Seminar Hall 3",
  latitude: 11.2583,
  longitude: 75.7809,
  incharge: "Mr. Vinod Krishnan",
  department: "Computer Applications",
  limit: 90,

  poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
  priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
  sponsorImages: [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  ],

  participationType: "individual",
  overallIndividualLimit: 90,
  departmentIndividualLimit: 12,

  membersPerTeamFromDepartment: "",
  teamsPerDepartment: "",
},

{
  id: 7,
  programName: "Hackathon",
  eventName: "Green Tech Hack",
  description:
    "A sustainability-focused hackathon where teams build innovative tech solutions addressing environmental challenges and climate change.",
  date: "2025-06-20",
  startTime: "09:00",
  endTime: "21:00",
  venue: "Main Auditorium",
  latitude: 11.2611,
  longitude: 75.7833,
  incharge: "Dr. Ramesh Iyer",
  department: "Engineering",
  limit: 100,

  poster: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
  sponsorImages: [
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  ],

  participationType: "team",
  membersPerTeamFromDepartment: 4,
  teamsPerDepartment: 5,

  overallIndividualLimit: "",
  departmentIndividualLimit: "",
},

{
  id: 8,
  programName: "Design Sprint",
  eventName: "Product Design Thinking Sprint",
  description:
    "An intensive design sprint focused on product ideation, user empathy, rapid prototyping, and validation with real users.",
  date: "2025-07-03",
  startTime: "10:30",
  endTime: "16:30",
  venue: "Design Studio",
  latitude: 11.2576,
  longitude: 75.7794,
  incharge: "Ms. Kavya Nair",
  department: "Design",
  limit: 50,

  poster: "https://images.unsplash.com/photo-1600697395543-ef3ee6e9af7b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
  sponsorImages: [],

  participationType: "individual",
  overallIndividualLimit: 50,
  departmentIndividualLimit: 7,

  membersPerTeamFromDepartment: "",
  teamsPerDepartment: "",
},

{
  id: 9,
  programName: "Tech Meetup",
  eventName: "AI in Everyday Applications",
  description:
    "A talk on how artificial intelligence is transforming everyday applications such as recommendation systems, chatbots, and automation tools.",
  date: "2025-07-15",
  startTime: "14:00",
  endTime: "17:00",
  venue: "Conference Hall",
  latitude: 11.2599,
  longitude: 75.7815,
  incharge: "Ms. Priya Nandakumar",
  department: "Artificial Intelligence",
  limit: 120,

  poster: "https://images.unsplash.com/photo-1581090700227-1e37b190418e",
  priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
  sponsorImages: [
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
  ],

  participationType: "individual",
  overallIndividualLimit: 120,
  departmentIndividualLimit: 15,

  membersPerTeamFromDepartment: "",
  teamsPerDepartment: "",
},

{
  id: 10,
  programName: "Hackathon",
  eventName: "Smart City Innovation Hack",
  description:
    "Teams build smart city solutions focusing on mobility, safety, energy optimization, and digital governance using modern technologies.",
  date: "2025-07-28",
  startTime: "09:00",
  endTime: "18:00",
  venue: "Innovation Lab",
  latitude: 11.2607,
  longitude: 75.7829,
  incharge: "Dr. Suresh Kumar",
  department: "Computer Science",
  limit: 120,

  poster: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
  priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
  sponsorImages: [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
  ],

  participationType: "team",
  membersPerTeamFromDepartment: 5,
  teamsPerDepartment: 4,

  overallIndividualLimit: "",
  departmentIndividualLimit: "",
},

{
  id: 11,
  programName: "AI Workshop",
  eventName: "Machine Learning Fundamentals",
  description:
    "A comprehensive introduction to machine learning algorithms, data preprocessing, and model evaluation techniques.",
  date: "2025-08-15",
  startTime: "09:00",
  endTime: "17:00",
  venue: "Computer Lab 1",
  latitude: 11.2580,
  longitude: 75.7805,
  incharge: "Dr. Rajesh Gupta",
  department: "Computer Science",
  limit: 60,

  poster: "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
  sponsorImages: [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  ],

  participationType: "individual",
  overallIndividualLimit: 60,
  departmentIndividualLimit: 8,

  membersPerTeamFromDepartment: "",
  teamsPerDepartment: "",
},

{
  id: 12,
  programName: "Startup Pitch",
  eventName: "Innovation Showcase",
  description:
    "Present your innovative business ideas to industry experts and potential investors. Get valuable feedback and networking opportunities.",
  date: "2025-09-20",
  startTime: "14:00",
  endTime: "18:00",
  venue: "Auditorium",
  latitude: 11.2615,
  longitude: 75.7830,
  incharge: "Ms. Kavita Sharma",
  department: "Entrepreneurship",
  limit: 50,

  poster: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
  sponsorImages: [
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  ],

  participationType: "individual",
  overallIndividualLimit: 50,
  departmentIndividualLimit: 6,

  membersPerTeamFromDepartment: "",
  teamsPerDepartment: "",
},

{
  id: 13,
  programName: "Cyber Security",
  eventName: "Ethical Hacking Challenge",
  description:
    "Test your cybersecurity skills in this capture-the-flag style competition. Learn about common vulnerabilities and defense strategies.",
  date: "2025-10-05",
  startTime: "10:00",
  endTime: "16:00",
  venue: "Cyber Lab",
  latitude: 11.2575,
  longitude: 75.7800,
  incharge: "Mr. Vikram Singh",
  department: "Information Security",
  limit: 40,

  poster: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
  sponsorImages: [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  ],

  participationType: "team",
  membersPerTeamFromDepartment: 2,
  teamsPerDepartment: 3,

  overallIndividualLimit: "",
  departmentIndividualLimit: "",
},

{
  id: 14,
  programName: "Data Science",
  eventName: "Big Data Analytics Workshop",
  description:
    "Learn advanced data analytics techniques using Python and SQL. Work with real datasets to extract valuable business insights.",
  date: "2025-10-25",
  startTime: "09:30",
  endTime: "15:30",
  venue: "Data Science Lab",
  latitude: 11.2600,
  longitude: 75.7820,
  incharge: "Dr. Priya Mohan",
  department: "Mathematics & Statistics",
  limit: 45,

  poster: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
  sponsorImages: [
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
  ],

  participationType: "individual",
  overallIndividualLimit: 45,
  departmentIndividualLimit: 6,

  membersPerTeamFromDepartment: "",
  teamsPerDepartment: "",
},

{
  id: 15,
  programName: "Blockchain",
  eventName: "DeFi & Smart Contracts",
  description:
    "Explore decentralized finance applications and learn to build smart contracts on Ethereum. Understand the future of financial systems.",
  date: "2025-11-10",
  startTime: "11:00",
  endTime: "16:00",
  venue: "Blockchain Lab",
  latitude: 11.2585,
  longitude: 75.7810,
  incharge: "Mr. Arjun Patel",
  department: "Computer Applications",
  limit: 35,

  poster: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
  sponsorImages: [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  ],

  participationType: "individual",
  overallIndividualLimit: 35,
  departmentIndividualLimit: 5,

  membersPerTeamFromDepartment: "",
  teamsPerDepartment: "",
},

{
  id: 16,
  programName: "Hackathon",
  eventName: "FinTech Innovation Hack",
  description:
    "Build innovative financial technology solutions. Create apps for banking, payments, insurance, and investment management.",
  date: "2025-11-25",
  startTime: "08:00",
  endTime: "20:00",
  venue: "Innovation Center",
  latitude: 11.2620,
  longitude: 75.7840,
  incharge: "Ms. Ananya Reddy",
  department: "Finance & Technology",
  limit: 80,

  poster: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
  sponsorImages: [
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  ],

  participationType: "team",
  membersPerTeamFromDepartment: 4,
  teamsPerDepartment: 5,

  overallIndividualLimit: "",
  departmentIndividualLimit: "",
},

{
  id: 17,
  programName: "Design Sprint",
  eventName: "Mobile App Design Challenge",
  description:
    "A focused design sprint to create innovative mobile app concepts. Learn user research, prototyping, and presentation skills.",
  date: "2025-12-05",
  startTime: "09:00",
  endTime: "17:00",
  venue: "Design Studio",
  latitude: 11.2570,
  longitude: 75.7795,
  incharge: "Mr. Rohan Kumar",
  department: "Design & Media",
  limit: 30,

  poster: "https://images.unsplash.com/photo-1600697395543-ef3ee6e9af7b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
  sponsorImages: [],

  participationType: "individual",
  overallIndividualLimit: 30,
  departmentIndividualLimit: 4,

  membersPerTeamFromDepartment: "",
  teamsPerDepartment: "",
},

{
  id: 18,
  programName: "Tech Meetup",
  eventName: "IoT & Embedded Systems",
  description:
    "Discover the Internet of Things ecosystem. Learn about sensors, microcontrollers, and building connected devices.",
  date: "2025-12-20",
  startTime: "13:00",
  endTime: "17:00",
  venue: "Electronics Lab",
  latitude: 11.2590,
  longitude: 75.7815,
  incharge: "Dr. Suresh Nair",
  department: "Electronics & Communication",
  limit: 70,

  poster: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
  sponsorImages: [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  ],

  participationType: "individual",
  overallIndividualLimit: 70,
  departmentIndividualLimit: 9,

  membersPerTeamFromDepartment: "",
  teamsPerDepartment: "",
},

{
  id: 19,
  programName: "AI Workshop",
  eventName: "Computer Vision & Image Processing",
  description:
    "Hands-on workshop on computer vision techniques using OpenCV and deep learning. Build image recognition and processing applications.",
  date: "2026-01-15",
  startTime: "10:00",
  endTime: "16:00",
  venue: "AI Research Lab",
  latitude: 11.2610,
  longitude: 75.7835,
  incharge: "Dr. Meera Krishnan",
  department: "Artificial Intelligence",
  limit: 40,

  poster: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
  sponsorImages: [
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
  ],

  participationType: "individual",
  overallIndividualLimit: 40,
  departmentIndividualLimit: 5,

  membersPerTeamFromDepartment: "",
  teamsPerDepartment: "",
},

{
  id: 20,
  programName: "Startup Pitch",
  eventName: "Social Entrepreneurship Summit",
  description:
    "Pitch social impact startup ideas that address community challenges. Connect with social investors and NGOs.",
  date: "2026-02-01",
  startTime: "09:00",
  endTime: "15:00",
  venue: "Social Innovation Hub",
  latitude: 11.2588,
  longitude: 75.7808,
  incharge: "Ms. Divya Menon",
  department: "Social Sciences",
  limit: 60,

  poster: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  priceImage: "https://i.pinimg.com/736x/b1/f3/fb/b1f3fbe8e408d83d311ee49b7fb4d2d7.jpg",
  sponsorImages: [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  ],

  participationType: "individual",
  overallIndividualLimit: 60,
  departmentIndividualLimit: 8,

  membersPerTeamFromDepartment: "",
  teamsPerDepartment: "",
},

];


export const TEACHERS = [
  {
    id: "a1b2c3",
    teacherId: "AEDXBBA001",
    email: "teacher1@gmail.com",
    createdAt: "2025-01-10T10:30:00Z",
  },
  {
    id: "b2c3d4",
    teacherId: "AEDXBBA002",
    email: "teacher2@college.edu",
    createdAt: "2025-01-10T10:45:00Z",
  },
  {
    id: "c3d4e5",
    teacherId: "AEDXSPY001",
    email: "teacher3@school.ac.in",
    createdAt: "2025-01-10T11:00:00Z",
  },
  {
    id: "d4e5f6",
    teacherId: "AEDXBCM001",
    email: "teacher4@outlook.com",
    createdAt: "2025-01-10T11:15:00Z",
  },
  {
    id: "e5f6g7",
    teacherId: "AEDXBSW001",
    email: "teacher5@gmail.com",
    createdAt: "2025-01-10T11:30:00Z",
  },
  {
    id: "f6g7h8",
    teacherId: "AEDXBCM002",
    email: "teacher6@yahoo.com",
    createdAt: "2025-01-10T11:45:00Z",
  },
  {
    id: "g7h8i9",
    teacherId: "AEDXBSW002",
    email: "teacher7@college.edu",
    createdAt: "2025-01-10T12:00:00Z",
  },
  {
    id: "h8i9j0",
    teacherId: "AEDXBCM003",
    email: "teacher8@gmail.com",
    createdAt: "2025-01-10T12:15:00Z",
  },
  {
    id: "i9j0k1",
    teacherId: "AEDXSPY002",
    email: "teacher9@school.ac.in",
    createdAt: "2025-01-10T12:30:00Z",
  },
  {
    id: "j0k1l2",
    teacherId: "AEDXBCM004",
    email: "teacher10@outlook.com",
    createdAt: "2025-01-10T12:45:00Z",
  },
];



export const STUDENTS = [
  {
    regNo: "SFAXBCA001",
    email: "student1@gmail.com",
  },
  {
    regNo: "SFAXBCA002",
    email: "student2@college.edu",
  },
  {
    regNo: "SFAXBCA003",
    email: "student3@yahoo.com",
  },
  {
    regNo: "SFAXBBA001",
    email: "student4@outlook.com",
  },
  {
    regNo: "SFAXBBA002",
    email: "student5@school.ac.in",
  },
  {
    regNo: "SFAYBBA003",
    email: "student6@gmail.com",
  },
  {
    regNo: "SFAXBSW001",
    email: "student7@college.edu",
  },
  {
    regNo: "SFAXBSW002",
    email: "student8@yahoo.com",
  },
  {
    regNo: "SFAXBCM001",
    email: "student9@school.ac.in",
  },
  {
    regNo: "SFAXBCM002",
    email: "student10@outlook.com",
  },
  {
    regNo: "SFAXSPY002",
    email: "student11@outlook.com",
  },
];

// Demo signup data for students and teachers
export const SIGNUPDATA = [
  // Students
  {
    id: "student1",
    userType: "student",
    registerNumber: "SFAXBCA001",
    email: "student1@gmail.com",
    name: "Rahul Sharma",
    department: "Bachelor of Computer Application",
    semester: "5th Semester",
    admissionNumber: "ADM2021001",
    mobile: "9876543210",
    password: "student123",
    confirmPassword: "student123",
  },
  {
    id: "student2",
    userType: "student",
    registerNumber: "SFAXBBA002",
    email: "student5@school.ac.in",
    name: "Priya Patel",
    department: "Bachelor of Business Administration",
    semester: "3rd Semester",
    admissionNumber: "ADM2021005",
    mobile: "8765432109",
    password: "student456",
    confirmPassword: "student456",
  },
  // Teachers
  {
    id: "teacher1",
    userType: "teacher",
    registerNumber: "AEDXBCM001",
    email: "teacher4@outlook.com",
    name: "Dr. Amit Kumar",
    department: "B.Com (Bachelor of Commerce)",
    gender: "Male",
    designation: "Assistant Professor",
    qualification: "M.Com, Ph.D",
    mobile: "7654321098",
    password: "teacher123",
    confirmPassword: "teacher123",
  },
  {
    id: "teacher2",
    userType: "teacher",
    registerNumber: "AEDXSPY001",
    email: "teacher3@school.ac.in",
    name: "Prof. Meera Singh",
    department: "Psychology",
    gender: "Female",
    designation: "Associate Professor",
    qualification: "M.Sc Psychology, M.Phil",
    mobile: "6543210987",
    password: "teacher456",
    confirmPassword: "teacher456",
  },
];
