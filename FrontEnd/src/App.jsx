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
import Rents from "./Pages/Users/Rents";
import PaymentSuccess from "./Pages/Users/PaymentSuccess";
import PaymentCancel from "./Pages/Users/PaymentCancel";
import Profile from "./Pages/Profile";
import Roomdetails from "./Pages/Users/Roomdetails";
import UnavailablePage from "./Pages/UnavailablePage";
import ResetPassword from "./Pages/ResetPassword";
import ForgotPassword from "./Pages/ForgotPassword";
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
        <Route path="/rents" element={<Rents />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/roomdetails/:id" element={<Roomdetails />} />
        <Route exact path="/resetPassword" element={<ResetPassword />} />
        <Route exact path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="*" element={<UnavailablePage />} />
      </Routes>
    </>
  );
}

export default App;
