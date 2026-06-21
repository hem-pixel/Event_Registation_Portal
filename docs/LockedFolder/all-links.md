# Event Registration Portal - Important Links & Credentials

This document contains all the relevant URLs, endpoints, and credentials for the Event Registration Portal.

## 🌐 Application URLs
* **Frontend Application:** [http://localhost:5173](http://localhost:5173)
* **Backend API Server:** [http://localhost:8080](http://localhost:8080)

## 🔐 Default Credentials
* **Admin Email:** `admin@eventportal.com`
* **Admin Password:** `password`
*(Note: You can use these to access the Admin Dashboard, view all registrations, scan QR codes, and review feedback).*

## 🗺️ Frontend Pages (Routes)
* **Event Catalog (Home):** [http://localhost:5173/events](http://localhost:5173/events)
* **Login:** [http://localhost:5173/login](http://localhost:5173/login)
* **Register:** [http://localhost:5173/register](http://localhost:5173/register)
* **Dashboard (Admin/Student):** [http://localhost:5173/dashboard](http://localhost:5173/dashboard)
* **My Profile:** [http://localhost:5173/profile](http://localhost:5173/profile)
* **My Feedback History:** [http://localhost:5173/feedback/history](http://localhost:5173/feedback/history)
* **Admin Feedback Dashboard:** [http://localhost:5173/admin/feedback](http://localhost:5173/admin/feedback)

## 🔌 Backend API Endpoints (Core)
* **Auth:** `POST /api/auth/login`, `POST /api/auth/register`
* **Events:** `GET /api/events`, `POST /api/events` (Admin)
* **Registrations:** `POST /api/registrations/register`, `GET /api/registrations/all` (Admin)
* **Attendance:** `POST /api/attendance/check-in/{id}` (Admin), `GET /api/attendance/all` (Admin)
* **Feedback:** `POST /api/feedback`, `GET /api/feedback/event/{id}`

## 🗄️ Database
* **Type:** PostgreSQL (Hosted on Supabase)
* **Connection URL:** `jdbc:postgresql://db.zzxkpeegvmbbnxbfehnx.supabase.co:5432/postgres`
