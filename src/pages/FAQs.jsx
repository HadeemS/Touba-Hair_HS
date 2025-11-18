import React, { useState } from 'react'
import './FAQs.css'

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "How far in advance should I book an appointment?",
      answer: "We recommend booking at least 1-2 weeks in advance, especially for popular styles or weekend appointments. However, we often have same-day or next-day availability, so feel free to check our booking calendar."
    },
    {
      question: "How long do braids typically last?",
      answer: "Most braiding styles last 6-8 weeks with proper care. Micro braids can last up to 10 weeks. The longevity depends on your hair type, maintenance routine, and the style you choose. We'll provide care instructions after your appointment."
    },
    {
      question: "What should I bring to my appointment?",
      answer: "Just bring yourself! We provide all hair extensions and products. However, if you have specific hair extensions you'd like to use, feel free to bring them. You may also want to bring a book or headphones for longer appointments."
    },
    {
      question: "How long does a braiding appointment take?",
      answer: "Appointment duration varies by style. Simple styles like cornrows take 2-3 hours, while intricate styles like micro braids can take 6-8 hours. We'll provide an estimated duration when you book."
    },
    {
      question: "Do you offer maintenance or retwist services?",
      answer: "Yes! We offer retwist services to maintain your braids, twists, or locs. This is a great way to keep your style fresh between full installations. Maintenance appointments are typically shorter and more affordable."
    },
    {
      question: "What is your cancellation policy?",
      answer: "We understand that plans change. Please cancel or reschedule at least 24 hours in advance. Late cancellations (less than 24 hours) may be subject to a fee. No-shows may require a deposit for future bookings."
    },
    {
      question: "Do you work with all hair types?",
      answer: "Absolutely! Our expert stylists are experienced with all hair types and textures. We'll work with your natural hair to create the perfect style for you."
    },
    {
      question: "What forms of payment do you accept?",
      answer: "We accept cash, credit cards, and debit cards. We also offer payment plans for larger services. Please contact us for more information about payment options."
    },
    {
      question: "Can I bring my child for an appointment?",
      answer: "Yes! We welcome clients of all ages. For children's appointments, we recommend bringing something to keep them occupied during longer sessions. Please let us know when booking if it's a child's appointment."
    },
    {
      question: "How do I care for my braids after the appointment?",
      answer: "We'll provide detailed care instructions, but generally: keep your scalp moisturized, avoid excessive manipulation, sleep with a satin scarf or bonnet, and avoid heavy products. Schedule a maintenance appointment if needed."
    },
    {
      question: "Do you offer group bookings or events?",
      answer: "Yes! We can accommodate group bookings for special events, parties, or bridal parties. Please contact us in advance to discuss your needs and availability."
    },
    {
      question: "What is your rewards program?",
      answer: "Our loyalty program rewards you with points for every dollar spent. Earn points on completed appointments and redeem them for discounts on future services. The more you visit, the more you save!"
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="faqs-page">
      <div className="container">
        <div className="faqs-header">
          <h1 className="page-title">Frequently Asked Questions</h1>
          <p className="page-subtitle">Everything you need to know about our services</p>
        </div>

        <div className="faqs-content">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="faq-text">{faq.question}</span>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faqs-footer">
          <p>Still have questions?</p>
          <a href="/contact" className="btn btn-primary">Contact Us</a>
        </div>
      </div>
    </div>
  )
}

export default FAQs

