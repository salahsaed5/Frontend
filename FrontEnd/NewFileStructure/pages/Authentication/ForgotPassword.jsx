import { useState } from "react";
import './authentication.css'; // استخدام نفس ملف CSS الخاص بـ Login
import { useNavigate } from 'react-router-dom';
import { Envelope } from 'react-bootstrap-icons';
import img from '../../assets/images/child1.jpg';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [apiError, setApiError] = useState(""); // Error from API
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const navigate = useNavigate();

  const validateEmail = () => {
    const isValid = /\S+@\S+\.\S+/.test(email);
    setEmailError(isValid ? "" : "Invalid email address");
    return isValid;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setApiError(""); 
    setSuccessMessage(""); 

    const isEmailValid = validateEmail();

    if (isEmailValid) {
      try {
        setIsLoading(true); 

      
        const response = await fetch('https://school-backend-eight.vercel.app/api/v1/auth/send-otp', {   method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        setIsLoading(false); 

        if (response.ok) {
          
          navigate('/reset-password', { state: { email } }); 
        } else {
          setApiError(data.message || "Failed to send OTP. Please try again.");
        }
      } catch (error) {
        setIsLoading(false);
        setApiError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="conainer"> 
      <div className="mixed"> 
        <div className="form-conainer">
          <h1>Forgot Password</h1>
          <form onSubmit={handleForgotPassword}>
            <div className="input-with-icon"> 
              <Envelope className="input-icon" /> 
              <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
              />
            </div>
            <small style={{ color: 'red' }}>{emailError}</small>

            {apiError && <p style={{ color: 'red' }}>{apiError}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {isLoading ? (
              <button disabled>Sending...</button>
            ) : (
              <button type="submit">Send Reset Link</button>
            )}

            <a href="/login" className="forgot-password-link">Back to Login</a> 
          </form>
        </div>
        <div className="image-containennt"> 
          <img src={img} alt="Student" />
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
