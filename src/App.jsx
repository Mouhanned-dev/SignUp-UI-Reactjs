import { useState } from "react";
import "./index.css";
import Slider from "./components/Slider.jsx";
import SignupForm from "./components/SignupForm.jsx";
import EmailModal from "./components/EmailModal.jsx";

const slides = [
  { image: "/Images/SlideLogin-1.jpg", text: "Capturing Moments, <br>Creating Memories" },
  { image: "/Images/SlideLogin-2.jpg", text: "Designing Experiences, <br>Inspiring Creativity" },
  { image: "/Images/Slide-Login-3.jpg", text: "Turning Ideas <br>Into Reality" },
];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [emailOpen, setEmailOpen] = useState(false);
  const [modalEmail, setModalEmail] = useState("");

  const onEmailSubmit = (email) => {
    setModalEmail(email);
    setEmailOpen(true);
  };

  

  return (
    <div className="container">
      <div className="left-panel">
        <img src={slides[current].image} alt="Slide" className="slide-image" />
        <div className="panel-header">
          <div className="logo">
            <img src="/Images/profile-pic-mrd.png" alt="Profile photo" className="logo-avatar" />
            <span className="logo-text">mouhanned.dev</span>
          </div>
          <button className="back-btn" onClick={() => window.history.back()}>Back to website →</button>
        </div>

        <Slider slides={slides} current={current} setCurrent={setCurrent} />
      </div>

      <div className="right-panel">
        <h2>Create an account</h2>
        <p className="login-link">Already have an account? <a href="#login">Log in</a></p>

        <SignupForm onEmailSubmit={onEmailSubmit} />
      </div>

      <EmailModal open={emailOpen} email={modalEmail} onClose={() => setEmailOpen(false)} />
    </div>
  );
}
