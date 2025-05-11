import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import PassengerLanding from "./components/PassengerLanding";
import OperatorLanding from "./components/OperatorLanding";
import AdminLanding from "./components/AdminLandling";

const App: React.FC = () => {
  const [view, setView] = useState<"signin" | "signup" | "forgot" | "passenger" | "operator" | "admin">("signin");

  useEffect(() => {
    const storedRole = localStorage.getItem("role") as "passenger" | "operator" | "admin" | null;
    if (storedRole && ["passenger", "operator", "admin"].includes(storedRole)) {
      setView(storedRole);
    }
  }, []);

  const handleLoginSuccess = (role: "passenger" | "operator" | "admin") => {
    localStorage.setItem("role", role);
    setView(role);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setView("signin");
  };

  const renderView = () => {
    switch (view) {
      case "signup":
        return <SignUp onNavigate={setView} />;
      case "forgot":
        return <ForgotPassword onNavigate={setView} />;
      case "passenger":
        return <PassengerLanding onLogout={handleLogout} />;
      case "operator":
        return <OperatorLanding onLogout={handleLogout} />;
      case "admin":
        return <AdminLanding onLogout={handleLogout} />;
      default:
        return <SignIn onNavigate={setView} onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white">
        {renderView()}
      </div>
    </Router>
  );
};

export default App;
