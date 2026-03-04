"use client";

import { useState } from "react";
import { ACCENT } from "./ProjectDetailLayout";

const sectionStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.1)",
  padding: "40px 0 56px",
  boxSizing: "border-box",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 400,
  padding: "12px 16px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  fontSize: 15,
};

export function ProjectDetailFeedback() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:web3privacynow@protonmail.com?subject=Feedback from ${encodeURIComponent(name || "Visitor")}&body=${encodeURIComponent(message)}`;
    window.location.href = mailto;
  };

  return (
    <section style={sectionStyle}>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", color: ACCENT, margin: 0, textTransform: "uppercase" }}>FEEDBACK</h2>
      <p style={{ marginTop: 16, maxWidth: 672, color: "rgba(255,255,255,0.9)" }}>We value your input. Share feedback, suggestions, or report issues.</p>
      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        <div style={{ display: "grid", gap: 16, maxWidth: 480 }}>
          <div className="project-detail-feedback-name" style={{ display: "block" }}>
            <label htmlFor="pd-feedback-name" style={{ display: "block", marginBottom: 6, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>Your Name</label>
            <input id="pd-feedback-name" type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>
          <div className="project-detail-feedback-email" style={{ display: "block" }}>
            <label htmlFor="pd-feedback-email" style={{ display: "block", marginBottom: 6, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>Email Address</label>
            <input id="pd-feedback-email" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="pd-feedback-message" style={{ display: "block", marginBottom: 6, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>Your Message</label>
            <textarea id="pd-feedback-message" placeholder="Your Message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" style={{ padding: "12px 24px", borderRadius: 8, backgroundColor: ACCENT, color: "#000", fontWeight: 600, border: "none", cursor: "pointer" }}>SEND FEEDBACK</button>
          </div>
        </div>
      </form>
    </section>
  );
}
