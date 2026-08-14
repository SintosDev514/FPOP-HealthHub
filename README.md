FPOP HealthHub — Clinic Appointment & Management System
A full-stack web application built for FPOP (Family Planning Organization of the Philippines) Clinic to digitize patient appointments, staff operations, inventory, and clinic records. The system serves three roles — Patient, Staff, and Admin — through a single unified platform with a public-facing website.
🛠 Tech Stack
Layer
Frontend
Backend
Database
Auth
File Uploads
Email
Reporting
Deployment
👥 User Roles
- Patient / User — self-registration, book and manage appointments, dashboard, profile management, notifications.
- Staff — appointment scheduling, client assessments (FP & HIV forms), inventory tracking, report generation, profile management.
- Admin — full user management, staff management with schedules, appointments, analytics, notifications, inventory oversight, and a fully customizable clinic settings panel that updates the public website footer in real time.
 Key Features
Authentication & Security
- Register / login / logout with JWT stored in HTTP-only cookies
- Email OTP verification for account activation
- Forgot / reset password flow via OTP
- Role-based access control (protected routes for patient, staff, admin)
- Account suspension / unsuspension by admin
Public Website
- Landing page, Services, About, Contact, and Location (embedded Google Map)
- Dynamic footer that pulls clinic name, email, phone, and address from admin settings
Patient Portal
- Online appointment booking with available slot detection
- View / cancel upcoming appointments
- Personal dashboard and profile editing with avatar upload
Staff Portal
- Daily appointment schedule view with status updates
- Assessment forms: Family Planning (FP) and HIV screening forms with client records
- Inventory management: categorized stock tables by quarter/year (beginning, receipts, issuances, ending stock)
- Generate printable reports (PDF/Excel) for assessments and inventory
Admin Portal
- Client Management — add, edit role, suspend, delete users
- Staff Management — manage staff profiles and schedules
- Appointments — oversee and update all appointment statuses
- Analytics Dashboard — overview stats, trends, and reports
- Notifications — system-wide alert management
- System Settings — customizable clinic information (name, email, phone, address) reflected across the public site
Data Models
- User — multi-role accounts with OTP, schedule, and suspension fields
- Appointment — scheduled visits with unique slot constraints (no double-booking)
- InventoryTable — nested categories/items for quarterly stock reports
- Assessment — FP & HIV client assessment records
- Notification — system notifications per user
- Settings — persisted clinic configuration
   Getting Started
# Client
cd client
npm install
npm run dev          # http://localhost:5173

# Server
cd server
npm install
npm run server       # http://localhost:5000
Create a .env in server/ with your MongoDB URI, JWT_SECRET, CLIENT_URL, and EmailJS keys.
