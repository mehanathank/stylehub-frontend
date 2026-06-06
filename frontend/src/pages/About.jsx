import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const emailPattern = /^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;

  function handleSubscribe(e) {
    e.preventDefault();
    if (!emailPattern.test(email)) {
      setMsg({ text: "Please enter a valid email address", type: "error" });
      return;
    }
    localStorage.setItem("newsletterEmail", email);
    setMsg({ text: "Thank you for subscribing!", type: "success" });
    setEmail("");
  }

  return (
    <>
      <Navbar />

      <div className="hero about-hero">
        <div className="hero-content">
          <p className="section-title" style={{ color: "#8b4513" }}>
            WHO WE ARE
          </p>
          <h1 className="hero-title">
            About <br />
            StyleHub
          </h1>
          <p className="hero-sub">
            Fashion is not just clothing — it's a statement.
            <br />
            We help you make yours.
          </p>
        </div>
      </div>

      <div className="section-pad bg-white">
        <p className="section-title">OUR STORY</p>
        <h2 className="section-heading">Born from a Passion for Style</h2>
        <div className="two-col">
          <img
            src="/image/about.png"
            alt="Our Story"
            className="two-col-img"
          />
          <div>
            <p className="body-text">
              StyleHub was founded with a simple belief — everyone deserves to
              look and feel their best. What started as a small boutique has
              grown into a destination for fashion lovers across the country.
            </p>
            <p className="body-text">
              We curate timeless pieces and modern trends for men, women, kids,
              and babies — all under one roof. Quality, comfort, and style are
              at the heart of everything we do.
            </p>
          </div>
        </div>
      </div>

      <div className="section-pad">
        <p className="section-title">WHAT DRIVES US</p>
        <h2 className="section-heading">Our Core Values</h2>
        <div className="grid-4">
          {[
            [
              "🎨 Curated Style",
              "Every piece is hand-picked by our fashion experts to ensure it meets our standards of style and quality.",
            ],
            [
              "♻️ Sustainability",
              "We are committed to ethical sourcing and reducing our environmental footprint with every collection.",
            ],
            [
              "💎 Premium Quality",
              "From fabric to finish, we never compromise on quality. Every stitch is made to last.",
            ],
            [
              "🤝 Customer First",
              "Your satisfaction is our priority. Easy returns, fast shipping, and support — always.",
            ],
          ].map(([title, text]) => (
            <div key={title} className="value-card">
              <h5 className="value-title">{title}</h5>
              <p className="value-text">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section-pad bg-white" style={{ textAlign: "center" }}>
        <p className="section-title">STAY UPDATED</p>
        <h2 className="section-heading">Subscribe to Our Newsletter</h2>
        <form onSubmit={handleSubscribe} className="newsletter-form">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="newsletter-input"
          />
          {msg.text && (
            <p className={msg.type === "success" ? "success-msg" : "error-msg"}>
              {msg.text}
            </p>
          )}
          <button type="submit" className="btn-primary">
            Subscribe
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}
