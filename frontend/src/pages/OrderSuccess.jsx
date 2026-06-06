import { useState, useEffect } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OrderSuccess() {
  const { state } = useLocation();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 5000)
    return () => clearTimeout(t)
  }, [])

  if (!state?.orderId) return <Navigate to="/" replace />;

  if (loading) return (
    <>
      <Navbar />
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 56, height: 56, border: '5px solid #f0dfc0', borderTop: '5px solid #8b4513', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e0c9a6",
            borderTop: "4px solid #27ae60",
            padding: "50px 60px",
            textAlign: "center",
            maxWidth: 520,
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2
            style={{
              fontFamily: "Playfair Display,serif",
              color: "#6b3a2a",
              marginBottom: 8,
            }}
          >
            Order Placed!
          </h2>
          <p style={{ color: "#888", marginBottom: 24 }}>
            Thank you for shopping with StyleHub
          </p>
          <div
            style={{
              background: "#fdf6ee",
              borderRadius: 10,
              padding: "16px 24px",
              marginBottom: 28,
            }}
          >
            <p
              style={{
                color: "#8b4513",
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 4,
              }}
            >
              {state.orderId}
            </p>
            <p style={{ color: "#6b3a2a", fontWeight: 700, fontSize: 20 }}>
              Rs. {state.total}
            </p>
          </div>
          <p
            style={{
              color: "#7a5c3a",
              fontSize: 14,
              marginBottom: 32,
              lineHeight: 1.8,
            }}
          >
            Your order has been received and is being processed. You can track
            it in My Orders.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link to="/orders" className="btn-primary">
              View My Orders
            </Link>
            <Link
              to="/products"
              style={{
                background: "transparent",
                border: "2px solid #8b4513",
                color: "#8b4513",
                padding: "13px 32px",
                borderRadius: 10,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
