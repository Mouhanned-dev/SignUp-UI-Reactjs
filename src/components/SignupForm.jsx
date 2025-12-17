import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

export default function SignupForm({ onEmailSubmit }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const emailRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animRef = useRef(null);
  const scanningRef = useRef(false);
  const DetectorRef = useRef(null);

  const stopScan = useCallback(() => {
    scanningRef.current = false;
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const closeScan = useCallback(() => {
    stopScan();
    setScanOpen(false);
  }, [stopScan]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (scanOpen) closeScan();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scanOpen, closeScan]);

  const startScan = async () => {
    setScanResult("");
    setScanOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      if (canvasRef.current && videoRef.current) {
        const w = videoRef.current.videoWidth || 640;
        const h = videoRef.current.videoHeight || 480;
        canvasRef.current.width = w;
        canvasRef.current.height = h;
      }
      scanningRef.current = true;
      const DetectorCtor = window.BarcodeDetector;
      if (DetectorCtor) {
        DetectorRef.current = new DetectorCtor({ formats: ["qr_code", "code_128", "ean_13", "upc_e", "codabar", "data_matrix", "pdf417"] });
      }
      scanLoop();
    } catch {
      setScanResult("Camera access failed");
    }
  };

  const scanLoop = async () => {
    if (!scanningRef.current) return;
    if (!canvasRef.current || !videoRef.current) {
      animRef.current = requestAnimationFrame(scanLoop);
      return;
    }
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      if (DetectorRef.current) {
        try {
          const res = await DetectorRef.current.detect(canvasRef.current);
          if (res && res.length) {
            setScanResult(res[0].rawValue || "");
            stopScan();
            return;
          }
        } catch {}
      } else {
        const imgData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height);
        if (code && code.data) {
          setScanResult(code.data);
          stopScan();
          return;
        }
      }
    }
    animRef.current = requestAnimationFrame(scanLoop);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const v = emailRef.current?.value?.trim() || "";
    onEmailSubmit(v);
  };

  return (
    <>
      <form onSubmit={onSubmit} id="signupForm">
        <div className="form-row">
          <div className="input-group">
            <input type="text" placeholder="First name" required />
          </div>
          <div className="input-group">
            <input type="text" placeholder="Last name" required />
          </div>
        </div>

        <div className="input-group">
          <input type="email" id="email" name="email" placeholder="Email" required ref={emailRef} />
        </div>

        <div className="input-group password-group">
          <input type={passwordVisible ? "text" : "password"} id="password" placeholder="Password" required />
          <button type="button" className="toggle-password" onClick={() => setPasswordVisible((v) => !v)}>👁</button>
        </div>

        <div className="checkbox-group">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">I agree to the <a href="#terms">Terms &amp; Conditions</a></label>
        </div>

        <button type="submit" className="submit-btn">Create account</button>

        <div className="divider">Or register with</div>

        <div className="social-buttons">
          <button type="button" className="social-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
              <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.909-2.258c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9.003 18z" fill="#34A853" />
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
              <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335" />
            </svg>
            Google
          </button>
          <button type="button" className="social-btn">
            <svg width="18" height="18" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
              <path d="M349.13,136.86c-40.32,0-57.36,19.24-85.44,19.24C234.9,156.1,212.94,137,178,137c-34.2,0-70.67,20.88-93.83,56.45-32.52,50.16-27,144.63,25.67,225.11,18.84,28.81,44,61.12,77,61.47h.6c28.68,0,37.2-18.78,76.67-19h.6c38.88,0,46.68,18.89,75.24,18.89h.6c33-.35,59.51-36.15,78.35-64.85,13.56-20.64,18.6-31,29-54.35-76.19-28.92-88.43-136.93-13.08-178.34-23-28.8-55.32-45.48-85.79-45.48Z"></path>
              <path d="M340.25,32c-24,1.63-52,16.91-68.4,36.86-14.88,18.08-27.12,44.9-22.32,70.91h1.92c25.56,0,51.72-15.39,67-35.11C333.17,85.89,344.33,59.29,340.25,32Z"></path>
            </svg>
            Apple
          </button>
        </div>
      </form>

      <div className="scan-section">
        <button type="button" className="submit-btn" onClick={() => setScanOpen(true)}>Open scanner</button>
      </div>

      <div className="modal-overlay" role="dialog" aria-modal="true" hidden={!scanOpen} onClick={(e) => { if (e.target === e.currentTarget) closeScan(); }}>
        <div className="modal">
          <h3 className="modal-title">Scan code</h3>
          <div className="scan-body">
            <video ref={videoRef} className="scan-video" autoPlay playsInline muted />
            <canvas ref={canvasRef} className="scan-canvas" hidden></canvas>
            <div className="scan-result">{scanResult}</div>
          </div>
          <div className="modal-actions">
            <button type="button" className="modal-btn" onClick={closeScan}>Close</button>
            <button type="button" className="modal-btn primary" onClick={startScan}>Start</button>
          </div>
        </div>
      </div>
    </>
  );
}
