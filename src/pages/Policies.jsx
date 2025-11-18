import React from 'react'
import './Policies.css'

const Policies = () => {
  return (
    <div className="policies-page">
      <div className="container">
        <div className="policies-header">
          <h1 className="page-title">Policies & Terms</h1>
          <p className="page-subtitle">Important information about our services</p>
        </div>

        <div className="policies-content">
          <section className="policy-section">
            <h2>📅 Cancellation Policy</h2>
            <p>
              We understand that plans can change. To help us serve all our clients effectively, 
              please observe the following cancellation guidelines:
            </p>
            <ul>
              <li><strong>24+ hours notice:</strong> Free cancellation or rescheduling</li>
              <li><strong>Less than 24 hours:</strong> 50% cancellation fee applies</li>
              <li><strong>No-show:</strong> Full service fee may be charged</li>
              <li><strong>Late arrivals:</strong> Service time may be reduced to stay on schedule</li>
            </ul>
            <p>
              To cancel or reschedule, please use your "My Bookings" page or contact us directly.
            </p>
          </section>

          <section className="policy-section">
            <h2>💳 Payment Policy</h2>
            <p>
              Payment is due at the time of service. We accept:
            </p>
            <ul>
              <li>Cash</li>
              <li>Credit cards (Visa, Mastercard, American Express)</li>
              <li>Debit cards</li>
              <li>Digital payment methods</li>
            </ul>
            <p>
              For services over $200, we may require a deposit at booking. Deposits are 
              non-refundable but can be applied to rescheduled appointments.
            </p>
          </section>

          <section className="policy-section">
            <h2>🔒 Privacy Policy</h2>
            <p>
              Your privacy is important to us. We collect and use your information only to:
            </p>
            <ul>
              <li>Process and manage your appointments</li>
              <li>Send appointment confirmations and reminders</li>
              <li>Improve our services</li>
              <li>Manage our rewards/loyalty program</li>
            </ul>
            <p>
              We do not sell or share your personal information with third parties. Your data 
              is stored securely and used only for the purposes stated above.
            </p>
            <p>
              You can update or delete your account information at any time through your Profile page.
            </p>
          </section>

          <section className="policy-section">
            <h2>✨ Service Guarantee</h2>
            <p>
              We stand behind our work. If you're not satisfied with your service, please contact 
              us within 48 hours of your appointment. We'll work with you to make it right.
            </p>
            <p>
              Please note: Adjustments for style preferences (if different from what was discussed) 
              may incur additional charges. We'll always discuss any changes with you first.
            </p>
          </section>

          <section className="policy-section">
            <h2>🎁 Rewards Program Terms</h2>
            <p>
              Our loyalty rewards program allows you to earn points on completed appointments:
            </p>
            <ul>
              <li><strong>1 point = $1 spent</strong> on completed services</li>
              <li>Points are awarded after appointment completion</li>
              <li>Points can be redeemed for discounts on future services</li>
              <li>Points do not expire</li>
              <li>Rewards cannot be combined with other promotions</li>
            </ul>
            <p>
              Reward tiers:
            </p>
            <ul>
              <li><strong>Bronze:</strong> 0-199 points</li>
              <li><strong>Silver:</strong> 200-499 points</li>
              <li><strong>Gold:</strong> 500-999 points</li>
              <li><strong>Platinum:</strong> 1000+ points</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>📞 Contact for Questions</h2>
            <p>
              If you have questions about any of these policies, please don't hesitate to contact us:
            </p>
            <ul>
              <li>Phone: <a href="tel:8392013566">(839) 201-3566</a></li>
              <li>Email: <a href="mailto:info@toubahair.com">info@toubahair.com</a></li>
              <li>Visit our <a href="/contact">Contact page</a> for more ways to reach us</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>📝 Terms of Service</h2>
            <p>
              By booking an appointment with Touba Hair Salon, you agree to:
            </p>
            <ul>
              <li>Provide accurate information when booking</li>
              <li>Arrive on time for your appointment</li>
              <li>Respect our cancellation policy</li>
              <li>Follow care instructions provided after service</li>
              <li>Treat our staff and other clients with respect</li>
            </ul>
            <p>
              We reserve the right to refuse service to anyone who is disruptive, disrespectful, 
              or violates salon policies.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Policies

