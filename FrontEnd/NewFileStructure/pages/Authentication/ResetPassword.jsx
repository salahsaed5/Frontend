import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import './authentication.css'; 
import { Lock } from 'react-bootstrap-icons';
import img from '../../assets/images/child1.jpg'; 

function ResetPassword() {
  const location = useLocation(); 
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateOtp = () => {
    const isValid = otp.length === 6; 
    setOtpError(isValid ? "" : "OTP must be 6 digits");
    return isValid;
  };

  const validatePassword = () => {
    const isValid = newPassword.length >= 6;
    setPasswordError(isValid ? "" : "Password must be at least 6 characters");
    return isValid;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    const isOtpValid = validateOtp();
    const isPasswordValid = validatePassword();

    if (isOtpValid && isPasswordValid) {
      try {
        setIsLoading(true);

        const response = await fetch('https://school-backend-eight.vercel.app/api/v1/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: location.state.email, 
            otp,
            newPassword,
          }),
        });

        const data = await response.json();
        setIsLoading(false);

        if (response.ok) {
          setSuccessMessage(data.message || "Password reset successfully.");
          navigate('/login'); 
        } else {
          setApiError(data.message || "Failed to reset password. Please try again.");
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
          <h1>Reset Password</h1>
          <form onSubmit={handleResetPassword}>
            <div className="input-with-icon">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onBlur={validateOtp}
              />
            </div>
            <small style={{ color: 'red' }}>{otpError}</small>

            <div className="input-with-icon">
              <Lock className="input-icon" />
              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={validatePassword}
              />
            </div>
            <small style={{ color: 'red' }}>{passwordError}</small>

            {apiError && <p style={{ color: 'red' }}>{apiError}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {isLoading ? (
              <button disabled>Resetting...</button>
            ) : (
              <button type="submit">Reset Password</button>
            )}
          </form>
        </div>
        <div className="image-containennt"> 
          <img src={img} alt="Reset Password" />
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
