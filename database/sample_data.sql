USE event_portal_db;

-- Insert Users (Password is "password" for all, BCrypt hashed)
-- Admin
INSERT INTO users (id, name, email, password, role) VALUES 
(1, 'System Admin', 'admin@eventportal.com', '$2a$10$Y50UaMky4zo.4Ua2yX2KKeB2eL/Ym2W77/t4FfR388KjR9bL/K0aG', 'ROLE_ADMIN');

-- Standard Users
INSERT INTO users (id, name, email, password, role) VALUES 
(2, 'John Doe', 'john.doe@college.edu', '$2a$10$Y50UaMky4zo.4Ua2yX2KKeB2eL/Ym2W77/t4FfR388KjR9bL/K0aG', 'ROLE_USER'),
(3, 'Jane Smith', 'jane.smith@college.edu', '$2a$10$Y50UaMky4zo.4Ua2yX2KKeB2eL/Ym2W77/t4FfR388KjR9bL/K0aG', 'ROLE_USER'),
(4, 'Bob Johnson', 'bob.johnson@college.edu', '$2a$10$Y50UaMky4zo.4Ua2yX2KKeB2eL/Ym2W77/t4FfR388KjR9bL/K0aG', 'ROLE_USER');

-- Insert Events
INSERT INTO events (id, title, description, date, duration, location, organizer_name, available_seats, image_url) VALUES 
(1, 'AI & Machine Learning Workshop', 'A hands-on workshop covering neural networks, deep learning, and practical applications of machine learning models in modern industry.', '2026-07-15 10:00:00', '4 Hours', 'Seminar Hall A, Tech Block', 'Department of Computer Science', 50, 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=600&auto=format&fit=crop'),
(2, 'Annual Hackathon 2026', 'A 24-hour coding challenge to solve real-world problems. Great prizes, food, and networking opportunities for all registered teams.', '2026-08-01 09:00:00', '24 Hours', 'Main Library & Innovation Lab', 'Coding Club', 100, 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop'),
(3, 'Guest Lecture on Cloud Architecture', 'Learn about distributed systems, microservices, and serverless architectures from an industry expert with 15+ years of AWS and GCP experience.', '2026-06-25 14:00:00', '2 Hours', 'Auditorium 2, Main Block', 'CSI Student Chapter', 120, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop'),
(4, 'UI/UX Design Boot Camp', 'An introductory session on user experience design, wireframing, prototyping with Figma, and conducting user research.', '2026-06-12 11:00:00', '3 Hours', 'Lab 5, CS Block', 'Design & Creative Arts Society', 0, 'https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=600&auto=format&fit=crop');

-- Insert Registrations
INSERT INTO registrations (id, user_id, event_id, full_name, email, phone_number, college_name, department, year, registration_date, status) VALUES 
(1, 2, 1, 'John Doe', 'john.doe@college.edu', '9876543210', 'State Engineering College', 'Computer Science', 3, '2026-06-05 10:30:00', 'REGISTERED'),
(2, 3, 1, 'Jane Smith', 'jane.smith@college.edu', '8765432109', 'State Engineering College', 'Information Technology', 2, '2026-06-06 11:15:00', 'REGISTERED'),
(3, 2, 2, 'John Doe', 'john.doe@college.edu', '9876543210', 'State Engineering College', 'Computer Science', 3, '2026-06-07 14:22:00', 'REGISTERED'),
(4, 4, 3, 'Bob Johnson', 'bob.johnson@college.edu', '7654321098', 'City Tech Institute', 'Electronics & Communication', 4, '2026-06-08 09:05:00', 'REGISTERED');

-- Insert Attendance
INSERT INTO attendance (id, registration_id, attendance_status, check_in_time) VALUES 
(1, 1, 'PRESENT', '2026-07-15 09:55:00'),
(2, 2, 'ABSENT', NULL),
(3, 4, 'PRESENT', '2026-06-25 13:58:00');
