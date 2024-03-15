// components/PrivacyPolicyPopup.js
import { useEffect, useState } from 'react';

const PrivacyPolicyPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('privacyPolicyConsent');
    if (!consent) {
      setShowPopup(true);
    }
  }, []);

  const handleContinue = () => {
    localStorage.setItem('privacyPolicyConsent', 'true');
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h1>Privacy Policy Disclaimer</h1>
        <p>We use OpenAI to provide certain features on this website. By continuing, you agree to the use of OpenAI services and acknowledge that your data may be processed in accordance with our privacy policy and OpenAI's privacy policy.</p>
        <div className="popup-actions">
          <button onClick={handleContinue} className="button">Continue</button>
        </div>
      </div>
      <style jsx>{`
        .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.75); /* Darker overlay for better focus on the popup */
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
        .popup-content {
          background: #fff;
          padding: 40px; /* More padding for a better layout */
          border-radius: 10px; /* Rounded corners for a modern look */
          max-width: 600px; /* Adjusted max-width for better readability */
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
          text-align: center;
        }
        .button {
          background-color: #007bff; /* Bootstrap primary blue */
          color: #fff; /* White text color */
          border: none; /* No border */
          border-radius: 5px; /* Rounded corners */
          padding: 12px 24px; /* Larger padding for a better click area */
          font-size: 16px; /* Increased font size */
          cursor: pointer;
          transition: background-color 0.2s; /* Smooth background color transition */
          margin-top: 32px
        }
        .button:hover {
          background-color: #0056b3; /* Darker blue on hover for feedback */
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicyPopup;
