import { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import Dashboard from "./Pages/Admin/Dashboard";
import Rooms from "./Pages/Admin/Rooms";
import Tenants from "./Pages/Admin/Tenants";
import RoomList from "./Pages/Admin/RoomList";
import Billing from "./Pages/Admin/Billing";
import AvailableRooms from "./Pages/Users/AvailableRooms";
import MyRoom from "./Pages/Users/MyRoom";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:roomId" element={<RoomList />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/available-rooms" element={<AvailableRooms />} />
        <Route path="/my-room" element={<MyRoom />} />
      </Routes>
    </>
  );
}

export default App;
