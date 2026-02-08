const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// In-memory OTP storage
const otpStore = new Map(); // Key: registerNumber, Value: otp

// Create or connect to database
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) console.error(err.message);
    else console.log("Connected to SQLite database.");
});

// Initialize Database Tables
db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL, -- 'student' or 'teacher'
        registerNumber TEXT UNIQUE NOT NULL,
        department TEXT,
        mobile TEXT,
        semester TEXT,
        admissionNumber TEXT,
        gender TEXT,
        designation TEXT,
        qualification TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    // Allowed Students Table (Mock Data Source)
    db.run(`CREATE TABLE IF NOT EXISTS allowed_students (
        registerNumber TEXT PRIMARY KEY,
        email TEXT NOT NULL
    )`);

    // Allowed Teachers Table (Mock Data Source)
    db.run(`CREATE TABLE IF NOT EXISTS allowed_teachers (
        teacherId TEXT PRIMARY KEY,
        email TEXT NOT NULL
    )`);

    // Allowed Admins Table (Mock Data Source)
    db.run(`CREATE TABLE IF NOT EXISTS allowed_admins (
        adminId TEXT PRIMARY KEY,
        email TEXT NOT NULL
    )`);

    // Programs Table
    db.run(`CREATE TABLE IF NOT EXISTS programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        image TEXT,
        brochure TEXT,
        title TEXT NOT NULL,
        programDate TEXT NOT NULL,
        programTime TEXT NOT NULL,
        description TEXT NOT NULL,
        features TEXT -- JSON string
    )`);

    // Notifications Table
    db.run(`CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        senderRole TEXT NOT NULL,
        recipientType TEXT NOT NULL, -- 'all' or 'individual'
        recipientId TEXT, -- teacherId if individual
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        replies TEXT -- JSON string of reply objects
    )`);

    // Seed Data (Check if empty then insert)
    db.get("SELECT count(*) as count FROM allowed_students", (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO allowed_students VALUES (?, ?)");
            stmt.run("SFAXBCA001", "student1@college.edu");
            stmt.run("SFAXBCA002", "student2@college.edu");
            stmt.finalize();
            console.log("Seeded allowed_students");
        }
    });

    db.get("SELECT count(*) as count FROM allowed_teachers", (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO allowed_teachers VALUES (?, ?)");
            stmt.run("AEDXBCA001", "teacher1@college.edu");
            stmt.finalize();
            console.log("Seeded allowed_teachers");
        }
    });

    db.get("SELECT count(*) as count FROM allowed_admins", (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO allowed_admins VALUES (?, ?)");
            stmt.run("ADMIN001", "admin@college.edu");
            stmt.finalize();
            console.log("Seeded allowed_admins");
        }
    });
});

// APIs

// 1. Verify ID
app.post("/verify-id", (req, res) => {
    const { registerNumber } = req.body;
    if (!registerNumber) return res.status(400).json({ error: "ID is required" });

    const id = registerNumber.toUpperCase();

    // Check Users table first (if already registered)
    db.get("SELECT * FROM users WHERE registerNumber = ?", [id], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });

        if (user) {
            return res.json({
                status: "registered",
                email: user.email,
                role: user.role,
                message: "User already registered"
            });
        }

        // Keep existing logic: SFA -> Student, AED -> Teacher
        if (id.startsWith("SFA")) {
            db.get("SELECT * FROM allowed_students WHERE registerNumber = ?", [id], (err, row) => {
                if (err) return res.status(500).json({ error: err.message });
                if (row) {
                    return res.json({ status: "allowed", email: row.email, role: "student" });
                } else {
                    return res.status(404).json({ error: "Student ID not found in records." });
                }
            });
        } else if (id.startsWith("AED")) {
            db.get("SELECT * FROM allowed_teachers WHERE teacherId = ?", [id], (err, row) => {
                if (err) return res.status(500).json({ error: err.message });
                if (row) {
                    return res.json({ status: "allowed", email: row.email, role: "teacher" });
                } else {
                    return res.status(404).json({ error: "Teacher ID not found in records." });
                }
            });
        } else if (id.startsWith("ADMIN")) {
            db.get("SELECT * FROM allowed_admins WHERE adminId = ?", [id], (err, row) => {
                if (err) return res.status(500).json({ error: err.message });
                if (row) {
                    return res.json({ status: "allowed", email: row.email, role: "admin" });
                } else {
                    return res.status(404).json({ error: "Admin ID not found in records." });
                }
            });
        } else {
            return res.status(400).json({ error: "Invalid ID format." });
        }
    });
});

// 2. Send OTP
app.post("/send-otp", (req, res) => {
    const { registerNumber } = req.body;
    if (!registerNumber) return res.status(400).json({ error: "ID is required" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in memory
    otpStore.set(registerNumber, otp);
    console.log(`OTP for ${registerNumber}: ${otp}`); // Log for testing

    // In a real app, send email here
    // await sendEmail(email, otp);

    res.json({ message: "OTP sent successfully", otp: otp }); // Returning OTP for testing convenience
});

// 3. Verify OTP
app.post("/verify-otp", (req, res) => {
    const { registerNumber, otp } = req.body;

    if (otpStore.get(registerNumber) === otp) {
        otpStore.delete(registerNumber); // Clear used OTP
        res.json({ message: "OTP verified" });
    } else {
        res.status(400).json({ error: "Invalid OTP" });
    }
});

// 4. Register (Signup)
app.post("/register", (req, res) => {
    const {
        name, email, password, role,
        registerNumber, department, mobile,
        semester, admissionNumber,
        gender, designation, qualification
    } = req.body;

    const stmt = db.prepare(`
        INSERT INTO users (
            name, email, password, role, registerNumber, department, mobile,
            semester, admissionNumber, gender, designation, qualification
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
        name, email, password, role, registerNumber, department, mobile,
        semester, admissionNumber, gender, designation, qualification,
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "User registered successfully", userId: this.lastID });
        }
    );
    stmt.finalize();
});

// 5. Login
app.post("/login", (req, res) => {
    const { registerNumber, password } = req.body;

    db.get("SELECT * FROM users WHERE registerNumber = ? AND password = ?", [registerNumber, password], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });

        if (user) {
            const { password, ...userWithoutPassword } = user; // Exclude password
            res.json({ user: userWithoutPassword });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});

// Update lookup endpoint for team members
app.get("/api/users/lookup/:regNo", (req, res) => {
    const { regNo } = req.params;
    db.get("SELECT name, registerNumber, department FROM users WHERE registerNumber = ?", [regNo.toUpperCase()], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    });
});

// Get all registered users (for roster mapping)
app.get("/api/users", (req, res) => {
    db.all("SELECT id, name, email, role, registerNumber, department, mobile, semester FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 6. Teacher Management APIs

// Get all teachers
app.get("/api/teachers", (req, res) => {
    db.all("SELECT * FROM allowed_teachers", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add a teacher
app.post("/api/teachers", (req, res) => {
    const { teacherId, email } = req.body;
    if (!teacherId || !email) return res.status(400).json({ error: "Missing fields" });

    const stmt = db.prepare("INSERT INTO allowed_teachers (teacherId, email) VALUES (?, ?)");
    stmt.run(teacherId, email, function (err) {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(400).json({ error: "Teacher ID already exists" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Teacher added", id: this.lastID });
    });
    stmt.finalize();
});

// Update a teacher
app.put("/api/teachers/:id", (req, res) => {
    const { id } = req.params; // Old teacherId
    const { teacherId, email } = req.body; // New values

    const stmt = db.prepare("UPDATE allowed_teachers SET teacherId = ?, email = ? WHERE teacherId = ?");
    stmt.run(teacherId, email, id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Teacher not found" });
        res.json({ message: "Teacher updated" });
    });
    stmt.finalize();
});

// Delete a teacher
app.delete("/api/teachers/:id", (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare("DELETE FROM allowed_teachers WHERE teacherId = ?");
    stmt.run(id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Teacher not found" });
        res.json({ message: "Teacher deleted" });
    });
    stmt.finalize();
});

// 7. Student Management APIs

// Get all students
app.get("/api/students", (req, res) => {
    db.all("SELECT * FROM allowed_students", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add a student
app.post("/api/students", (req, res) => {
    const { regNo, email } = req.body;
    if (!regNo || !email) return res.status(400).json({ error: "Missing fields" });

    const stmt = db.prepare("INSERT INTO allowed_students (registerNumber, email) VALUES (?, ?)");
    stmt.run(regNo.toUpperCase(), email.toLowerCase(), function (err) {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(400).json({ error: "Register Number already exists" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Student added", id: this.lastID });
    });
    stmt.finalize();
});

// Update a student
app.put("/api/students/:id", (req, res) => {
    const { id } = req.params; // Old registerNumber
    const { regNo, email } = req.body; // New values

    const stmt = db.prepare("UPDATE allowed_students SET registerNumber = ?, email = ? WHERE registerNumber = ?");
    stmt.run(regNo.toUpperCase(), email.toLowerCase(), id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Student not found" });
        res.json({ message: "Student updated" });
    });
    stmt.finalize();
});

// Delete a student
app.delete("/api/students/:id", (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare("DELETE FROM allowed_students WHERE registerNumber = ?");
    stmt.run(id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Student not found" });
        res.json({ message: "Student deleted" });
    });
    stmt.finalize();
});

// 8. Program Management APIs

// Get all programs
app.get("/api/programs", (req, res) => {
    db.all("SELECT * FROM programs", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Parse features JSON for each program
        const programs = rows.map(p => ({
            ...p,
            features: JSON.parse(p.features || "[]")
        }));
        res.json(programs);
    });
});

// Add a program
app.post("/api/programs", (req, res) => {
    const {
        name, category, image, brochure, title,
        programDate, programTime, description, features
    } = req.body;

    const stmt = db.prepare(`
        INSERT INTO programs (
            name, category, image, brochure, title, 
            programDate, programTime, description, features
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
        name, category, image, brochure, title,
        programDate, programTime, description, JSON.stringify(features || []),
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Program created successfully", id: this.lastID });
        }
    );
    stmt.finalize();
});

// Update a program
app.put("/api/programs/:id", (req, res) => {
    const { id } = req.params;
    const {
        name, category, image, brochure, title,
        programDate, programTime, description, features
    } = req.body;

    const stmt = db.prepare(`
        UPDATE programs SET 
            name = ?, category = ?, image = ?, brochure = ?, title = ?, 
            programDate = ?, programTime = ?, description = ?, features = ?
        WHERE id = ?
    `);

    stmt.run(
        name, category, image, brochure, title,
        programDate, programTime, description, JSON.stringify(features || []),
        id,
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Program not found" });
            res.json({ message: "Program updated successfully" });
        }
    );
    stmt.finalize();
});

// Delete a program
app.delete("/api/programs/:id", (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare("DELETE FROM programs WHERE id = ?");
    stmt.run(id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Program not found" });
        res.json({ message: "Program deleted successfully" });
    });
    stmt.finalize();
});

// 9. Event Management APIs

// Create events table
db.run(`
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        programId INTEGER,
        programName TEXT,
        eventName TEXT,
        description TEXT,
        date TEXT,
        startTime TEXT,
        endTime TEXT,
        venue TEXT,
        latitude REAL,
        longitude REAL,
        incharge TEXT,
        department TEXT,
        participationType TEXT,
        overallIndividualLimit INTEGER,
        departmentIndividualLimit INTEGER,
        membersPerTeamFromDepartment INTEGER,
        teamsPerDepartment INTEGER,
        poster TEXT,
        priceImage TEXT,
        sponsorImages TEXT,
        status TEXT DEFAULT 'pending'
    )
`);

// Get all events
app.get("/api/events", (req, res) => {
    db.all("SELECT * FROM events", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const events = rows.map(e => ({
            ...e,
            sponsorImages: JSON.parse(e.sponsorImages || "[]")
        }));
        res.json(events);
    });
});

// Add an event
app.post("/api/events", (req, res) => {
    const {
        programId, programName, eventName, description, date,
        startTime, endTime, venue, latitude, longitude,
        incharge, department, participationType,
        overallIndividualLimit, departmentIndividualLimit,
        membersPerTeamFromDepartment, teamsPerDepartment,
        poster, priceImage, sponsorImages, status
    } = req.body;

    const stmt = db.prepare(`
        INSERT INTO events (
            programId, programName, eventName, description, date,
            startTime, endTime, venue, latitude, longitude,
            incharge, department, participationType,
            overallIndividualLimit, departmentIndividualLimit,
            membersPerTeamFromDepartment, teamsPerDepartment,
            poster, priceImage, sponsorImages, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
        programId, programName, eventName, description, date,
        startTime, endTime, venue, latitude, longitude,
        incharge, department, participationType,
        overallIndividualLimit, departmentIndividualLimit,
        membersPerTeamFromDepartment, teamsPerDepartment,
        poster, priceImage, JSON.stringify(sponsorImages || []),
        status || 'pending',
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Event created successfully", id: this.lastID });
        }
    );
    stmt.finalize();
});

// Update an event
app.put("/api/events/:id", (req, res) => {
    const { id } = req.params;
    const {
        programId, programName, eventName, description, date,
        startTime, endTime, venue, latitude, longitude,
        incharge, department, participationType,
        overallIndividualLimit, departmentIndividualLimit,
        membersPerTeamFromDepartment, teamsPerDepartment,
        poster, priceImage, sponsorImages, status
    } = req.body;

    const stmt = db.prepare(`
        UPDATE events SET 
            programId = ?, programName = ?, eventName = ?, description = ?, date = ?,
            startTime = ?, endTime = ?, venue = ?, latitude = ?, longitude = ?,
            incharge = ?, department = ?, participationType = ?,
            overallIndividualLimit = ?, departmentIndividualLimit = ?,
            membersPerTeamFromDepartment = ?, teamsPerDepartment = ?,
            poster = ?, priceImage = ?, sponsorImages = ?, status = ?
        WHERE id = ?
    `);

    stmt.run(
        programId, programName, eventName, description, date,
        startTime, endTime, venue, latitude, longitude,
        incharge, department, participationType,
        overallIndividualLimit, departmentIndividualLimit,
        membersPerTeamFromDepartment, teamsPerDepartment,
        poster, priceImage, JSON.stringify(sponsorImages || []),
        status, id,
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Event not found" });
            res.json({ message: "Event updated successfully" });
        }
    );
    stmt.finalize();
});

// Update event status
app.patch("/api/events/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const stmt = db.prepare("UPDATE events SET status = ? WHERE id = ?");
    stmt.run(status, id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Event not found" });
        res.json({ message: "Event status updated" });
    });
    stmt.finalize();
});

// Get registered teachers (with names)
app.get("/api/registered-teachers", (req, res) => {
    db.all("SELECT id, name, department, registerNumber FROM users WHERE role = 'teacher'", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Delete an event
app.delete("/api/events/:id", (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare("DELETE FROM events WHERE id = ?");
    stmt.run(id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Event not found" });
        res.json({ message: "Event deleted successfully" });
    });
    stmt.finalize();
});

// 10. Registration Management APIs

// Create registrations table
db.run(`
    CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId INTEGER,
        userId TEXT,
        userName TEXT,
        userEmail TEXT,
        registeredUserDept TEXT,
        participationType TEXT,
        teamData TEXT, -- JSON string
        status TEXT DEFAULT 'pending',
        registeredAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

// Get all registrations
app.get("/api/registrations", (req, res) => {
    db.all("SELECT * FROM registrations", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const processed = rows.map(r => ({
            ...r,
            teamData: JSON.parse(r.teamData || "null")
        }));
        res.json(processed);
    });
});

// Add a registration
app.post("/api/registrations", (req, res) => {
    const {
        eventId, userId, userName, userEmail, registeredUserDept,
        participationType, teamData, status
    } = req.body;

    const stmt = db.prepare(`
        INSERT INTO registrations (
            eventId, userId, userName, userEmail, registeredUserDept,
            participationType, teamData, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
        eventId, userId, userName, userEmail, registeredUserDept,
        participationType, JSON.stringify(teamData || null),
        status || 'pending',
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Registration successful", id: this.lastID });
        }
    );
    stmt.finalize();
});

// Get registrations for a specific user (including team memberships)
app.get("/api/registrations/user/:userId", (req, res) => {
    const { userId } = req.params;

    // First get the user's register number to search in teamData JSON
    db.get("SELECT registerNumber FROM users WHERE id = ?", [userId], (err, userRecord) => {
        if (err) return res.status(500).json({ error: err.message });

        let query = "SELECT * FROM registrations WHERE userId = ?";
        let params = [userId];

        if (userRecord && userRecord.registerNumber) {
            // Search in teamData JSON string for the register number
            query = `
                SELECT * FROM registrations 
                WHERE userId = ? 
                OR (participationType = 'team' AND teamData LIKE ?)
            `;
            params = [userId, `%${userRecord.registerNumber}%`];
        }

        db.all(query, params, (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            const processed = rows.map(r => ({
                ...r,
                teamData: JSON.parse(r.teamData || "null")
            }));
            res.json(processed);
        });
    });
});

// 11. Attendance Management APIs

// Create attendance table
db.run(`
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId INTEGER,
        userId TEXT,
        status TEXT DEFAULT 'pending',
        date TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

// Get all attendance records
app.get("/api/attendance", (req, res) => {
    db.all("SELECT * FROM attendance", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Mark/Update attendance
app.post("/api/attendance", (req, res) => {
    const { eventId, userId, status } = req.body;
    const stmt = db.prepare("INSERT INTO attendance (eventId, userId, status) VALUES (?, ?, ?)");
    stmt.run(eventId, userId, status || 'pending', function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Attendance marked", id: this.lastID });
    });
    stmt.finalize();
});

// Update attendance status (Approve/Reject)
app.patch("/api/attendance/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.run("UPDATE attendance SET status = ? WHERE id = ?", [status, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Attendance status updated" });
    });
});

// 12. Rating & Review APIs

// Create ratings table
db.run(`
    CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId INTEGER,
        userId TEXT,
        rating INTEGER,
        review TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

// Get all ratings
app.get("/api/ratings", (req, res) => {
    db.all("SELECT * FROM ratings", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add/Update a rating
app.post("/api/ratings", (req, res) => {
    const { eventId, userId, rating, review } = req.body;

    // Use an UPSERT-like logic (Delete existing and insert new for simplicity in SQLite < 3.24)
    db.serialize(() => {
        db.run("DELETE FROM ratings WHERE eventId = ? AND userId = ?", [eventId, userId]);
        const stmt = db.prepare("INSERT INTO ratings (eventId, userId, rating, review) VALUES (?, ?, ?, ?)");
        stmt.run(eventId, userId, rating, review, function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Rating submitted successfully", id: this.lastID });
        });
        stmt.finalize();
    });
});

// 13. Event Reports APIs

// Create reports table
db.run(`
    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        programName TEXT,
        image TEXT, -- Base64 for now as per frontend logic
        description TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

// Get all reports
app.get("/api/reports", (req, res) => {
    db.all("SELECT * FROM reports ORDER BY createdAt DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add a report
app.post("/api/reports", (req, res) => {
    const { programName, image, description } = req.body;
    const stmt = db.prepare("INSERT INTO reports (programName, image, description) VALUES (?, ?, ?)");
    stmt.run(programName, image, description, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Report added successfully", id: this.lastID });
    });
    stmt.finalize();
});

// Delete a report
app.delete("/api/reports/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM reports WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Report deleted successfully" });
    });
});

// 14. Notification Management APIs

// Get all notifications
app.get("/api/notifications", (req, res) => {
    db.all("SELECT * FROM notifications ORDER BY timestamp DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const processed = rows.map(r => ({
            ...r,
            replies: JSON.parse(r.replies || "[]")
        }));
        res.json(processed);
    });
});

// Add a notification
app.post("/api/notifications", (req, res) => {
    const { subject, message, senderRole, recipientType, recipientId } = req.body;

    const stmt = db.prepare(`
        INSERT INTO notifications (
            subject, message, senderRole, recipientType, recipientId, timestamp, replies
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const timestamp = new Date().toISOString();
    stmt.run(
        subject, message, senderRole, recipientType, recipientId, timestamp, JSON.stringify([]),
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Notification sent successfully", id: this.lastID });
        }
    );
    stmt.finalize();
});

// Add a reply to a notification
app.post("/api/notifications/:id/reply", (req, res) => {
    const { id } = req.params;
    const { message, senderId, senderName } = req.body;

    db.get("SELECT replies FROM notifications WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Notification not found" });

        const replies = JSON.parse(row.replies || "[]");
        const newReply = {
            id: Date.now().toString(),
            message,
            sender: { id: senderId, name: senderName },
            timestamp: new Date().toISOString()
        };
        replies.push(newReply);

        const stmt = db.prepare("UPDATE notifications SET replies = ? WHERE id = ?");
        stmt.run(JSON.stringify(replies), id, function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Reply added successfully", reply: newReply });
        });
        stmt.finalize();
    });
});

// Home route
app.get("/", (req, res) => {
    res.send("Backend is running with Authentication");
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
