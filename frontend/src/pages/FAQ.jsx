import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const faqs = [
  {
    question: 'How do I place an order?',
    answer: 'Browse our products, select your size and colour, then click "Add to Cart". Once ready, go to Cart and proceed to Checkout to complete your order.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards, UPI, net banking, and cash on delivery for eligible orders.'
  },
  {
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 3–5 business days. Express delivery (1–2 business days) is available at checkout for select locations.'
  },
  {
    question: 'Is free shipping available?',
    answer: 'Yes! We offer free shipping on all orders above Rs. 999.'
  },
  {
    question: 'Can I return or exchange a product?',
    answer: 'Yes, we have a 30-day easy return and exchange policy. Products must be unused, unwashed, and in original packaging with tags intact.'
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order is shipped, you will receive a tracking link via email. You can also check your order status under My Orders in your account.'
  },
  {
    question: 'Are the products authentic?',
    answer: 'Absolutely. StyleHub guarantees 100% authentic products sourced directly from verified manufacturers and brands.'
  },
  {
    question: 'How do I find my correct size?',
    answer: 'Each product page includes a size guide. We recommend measuring yourself and comparing with the size chart before ordering.'
  },
  {
    question: 'Can I cancel my order?',
    answer: 'Orders can be cancelled within 24 hours of placing them. After that, the order may already be processed for shipping.'
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can reach us through the Contact page or email us at support@stylehub.com. We typically respond within 24 hours.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  function toggle(i) {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <>
      <Navbar />

      <div className="section-pad bg-white" style={{ paddingBottom: 20 }}>
        <p className="section-title">HELP CENTER</p>
        <h2 className="section-heading" style={{ marginBottom: 0 }}>Frequently Asked Questions</h2>
      </div>

      <div className="section-pad" style={{ maxWidth: 760, margin: '0 auto', paddingTop: 32 }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            border: '1px solid #e0c9a6',
            borderRadius: 12,
            marginBottom: 12,
            overflow: 'hidden',
            background: '#fff'
          }}>
            <button
              onClick={() => toggle(i)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                background: openIndex === i ? '#8b4513' : '#fff',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'Poppins,sans-serif',
                fontSize: 15,
                fontWeight: 600,
                color: openIndex === i ? '#fff' : '#6b3a2a',
                transition: 'background 0.2s'
              }}>
              {faq.question}
              <span style={{ fontSize: 20, lineHeight: 1, marginLeft: 12 }}>{openIndex === i ? '−' : '+'}</span>
            </button>
            {openIndex === i && (
              <div style={{
                padding: '14px 20px',
                fontFamily: 'Poppins,sans-serif',
                fontSize: 14,
                color: '#5a3a1a',
                lineHeight: 1.7,
                borderTop: '1px solid #e0c9a6',
                background: '#fdf6ee'
              }}>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </>
  )
}
