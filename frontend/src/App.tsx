import React, { useState } from "react";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";

const App: React.FC = () => {
  const [view, setView] = useState<"signin" | "signup" | "forgot" | "passenger" | "operator" | "admin">("signin");

  const renderView = () => {
    switch (view) {
      case "signup":
        return <SignUp onNavigate={setView} />;
      case "forgot":
        return <ForgotPassword onNavigate={setView} />;
      case "passenger":
        return <div className="text-white text-center mt-20">Welcome, Passenger!</div>;
      case "operator":
        return <div className="text-white text-center mt-20">Welcome, Operator!</div>;
      case "admin":
        return <div className="text-white text-center mt-20">Welcome, Admin!</div>;
      default:
        return <SignIn onNavigate={setView} onLoginSuccess={setView} />;
    }
  };

  return <div className="min-h-screen bg-gray-950 text-white">{renderView()}</div>;
};

export default App;
