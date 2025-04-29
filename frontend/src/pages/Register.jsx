import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Import axios for HTTP requests
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      console.log(response.data); // Logs success message or registered user info
      alert("Registration successful! Please login."); // Optional success message
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration failed. Please try again."); // Show error message
    }
  };

  return (
    <div className="register-container">
      <div className="left-section">
        <h1 className="big-heading">Manage Expenses<br/>with TallyMate</h1>
        <p className="animated-text">Split bills, share happiness!</p>
      </div>

      <div className="right-section">
        <div className="top-link">
          <p>
            Already have an account?{" "}
            <span className="login-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
