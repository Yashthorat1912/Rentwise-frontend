import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandlordDashboard from "./pages/LandlordDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import CreateRequest from "./pages/CreateRequest";
import Chat from "./pages/Chat";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import MainLayout from "./layout/MainLayout";
import PrivateRoute from "./components/PrivateRoute";
import AddProperty from "./pages/AddProperty";
import CreateLease from "./pages/CreateLease";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔓 PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🔒 PROTECTED ROUTES (WITH LAYOUT) */}
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/landlord" element={<LandlordDashboard />} />
          <Route path="/tenant" element={<TenantDashboard />} />
          <Route path="/create-request" element={<CreateRequest />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/create-lease" element={<CreateLease />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
