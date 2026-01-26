import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Force redirect to login page where the maintenance notice is displayed
    navigate("/login");
  }, [navigate]);

  return null;
}
