import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      console.log(response.data); // This will log the token and userId
      // You can store token in localStorage and redirect user to dashboard
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <h1 className="big-heading">Welcome<br/>back</h1>
        <p className="animated-text">Keep your finances organized and easy!</p>
      </div>

      <div className="right-section">
        <div className="top-link">
          <p>
            Don't have an account?{" "}
            <span className="register-link" onClick={() => navigate("/")}>
              Register
            </span>
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
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

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
