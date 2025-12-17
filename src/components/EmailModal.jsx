export default function EmailModal({ open, email, onClose }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" hidden={!open}>
      <div className="modal">
        <h3 className="modal-title">Verify your email</h3>
        <p className="modal-text">We sent a verification link to <span>{email || "your email"}</span>. Please check your inbox.</p>
        <div className="modal-actions">
          <button type="button" className="modal-btn primary" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}
