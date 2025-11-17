import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { pricesAPI } from '../utils/api'
import './Services.css'

const Services = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      console.log('Loading services from API...')
      const data = await pricesAPI.getAll()
      console.log('Services data received:', data)
      
      // Check if API returned data and has all 21 services
      if (data && Array.isArray(data) && data.length >= 21) {
        // Transform API data to match the format expected by the component
        const transformedData = data.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description || '',
          price: service.price,
          duration: service.duration || '',
          category: service.category || 'Other',
          icon: getServiceIcon(service.name),
          features: getServiceFeatures(service.name),
          details: getServiceDetails(service.name),
          popular: isPopularService(service.name)
        }))
        setServices(transformedData)
        console.log('Services set successfully:', transformedData.length, 'services')
      } else {
        // API returned less than 21 services (old data), use defaults
        console.log(`API returned only ${data?.length || 0} services. Using default 21 services.`)
        setServices(getDefaultServices())
      }
    } catch (err) {
      console.error('Error loading services:', err)
      console.log('Falling back to default services')
      setServices(getDefaultServices())
    } finally {
      setLoading(false)
    }
  }

  const getServiceIcon = (name) => {
    const iconMap = {
      'Box Braids': '📦',
      'Cornrows': '🌾',
      'Goddess Braids': '👑',
      'Fulani Braids': '✨',
      'Micro Braids': '💫',
      'Knotless Braids': '🔄',
      'Feed-in Braids': '🎯',
      'Senegalese Twists': '🌀',
      'Lemonade Braids': '🍋',
      'Passion Twists': '💃',
      'Ghana Braids': '🇬🇭',
      'Crochet Braids': '🪝',
      'Retwist Service': '🔄',
      'Wig Application': '👑',
      'Eyebrow Shaping': '✨',
      'Hair Washing & Detangling': '💧',
      'Deep Conditioning Treatment': '🌿',
      'Hair Cut & Trim': '✂️',
      'Scalp Treatment': '💆🏾‍♀️',
      'Style Refresh': '💇🏾‍♀️',
      'Color Services': '🎨'
    }
    return iconMap[name] || '✨'
  }

  const getServiceFeatures = (name) => {
    // Return features based on service name - you can expand this
    const defaultFeatures = {
      'Retwist Service': ['Maintains style freshness', 'Quick service', 'Affordable maintenance', 'Extends style life'],
      'Wig Application': ['Secure application', 'Natural hairline', 'Custom fitting', 'Protective styling option'],
      'Eyebrow Shaping': ['Threading available', 'Waxing option', 'Precision shaping', 'Quick service'],
      'Hair Washing & Detangling': ['Gentle cleansing', 'Thorough detangling', 'Deep conditioning included', 'Prepares for styling'],
      'Deep Conditioning Treatment': ['Moisture restoration', 'Steam treatment', 'Repairs damage', 'Strengthens hair'],
      'Hair Cut & Trim': ['Precision cutting', 'Shape maintenance', 'Health-focused', 'Quick service'],
      'Scalp Treatment': ['Promotes growth', 'Relieves irritation', 'Exfoliation included', 'Relaxing massage'],
      'Style Refresh': ['Edge touch-ups', 'Flyaway control', 'Quick refresh', 'Affordable'],
      'Color Services': ['Highlights available', 'Color correction', 'Quality products', 'Hair protection']
    }
    return defaultFeatures[name] || []
  }

  const getServiceDetails = (name) => {
    // Return details based on service name
    const defaultDetails = {
      'Retwist Service': 'Retwisting is essential for maintaining locs, twists, and some braided styles. Our skilled stylists will carefully retwist your hair to keep it looking neat and well-maintained.',
      'Wig Application': 'Our wig application service includes proper cap fitting, natural hairline customization, and secure installation methods. Whether you prefer glueless, tape, or sew-in methods, we\'ve got you covered.',
      'Eyebrow Shaping': 'Well-groomed eyebrows can transform your entire look. Our skilled technicians use threading, waxing, or precision tweezing to create the perfect arch and shape for your face.',
      'Hair Washing & Detangling': 'Proper hair washing and detangling is the foundation of any great style. Our gentle techniques ensure your hair is clean, detangled, and ready for styling without unnecessary breakage.',
      'Deep Conditioning Treatment': 'Deep conditioning treatments penetrate the hair shaft to restore moisture, repair damage, and strengthen your hair. Includes a relaxing steam treatment for maximum product absorption.',
      'Hair Cut & Trim': 'Regular trims are essential for maintaining healthy hair and preventing split ends. Our skilled stylists will trim your hair while preserving your style and promoting healthy growth.',
      'Scalp Treatment': 'A healthy scalp is the foundation of healthy hair. Our scalp treatments include gentle exfoliation, therapeutic massage, and application of nourishing oils to promote optimal hair growth conditions.',
      'Style Refresh': 'Keep your style looking fresh between full installations with our style refresh service. We\'ll touch up edges, control flyaways, and ensure your style looks polished and well-maintained.',
      'Color Services': 'Transform your look with professional hair coloring. Whether you want subtle highlights, bold color, or color correction, our experienced colorists will achieve your desired look while maintaining hair health.'
    }
    return defaultDetails[name] || ''
  }

  const isPopularService = (name) => {
    const popularServices = ['Box Braids', 'Goddess Braids', 'Knotless Braids', 'Lemonade Braids', 'Retwist Service', 'Eyebrow Shaping']
    return popularServices.includes(name)
  }

  const getDefaultServices = () => {
    return [
      {
        id: '1',
        name: 'Box Braids',
        description: 'Classic box braids with premium hair extensions. Perfect for protective styling and long-lasting wear. These versatile braids can be styled in countless ways and protect your natural hair while you grow it out.',
        price: 150,
        duration: '4-6 hours',
        category: 'Protective Styles',
        icon: '📦',
        features: ['Long-lasting (6-8 weeks)', 'Low maintenance', 'Versatile styling options', 'Hair protection'],
        details: 'Box braids are a timeless protective style that involves sectioning hair into square or rectangular parts and braiding synthetic or natural hair extensions into each section. Perfect for all hair types and lengths.',
        popular: true
      },
      {
        id: '2',
        name: 'Cornrows',
        description: 'Traditional cornrow braiding styles. Elegant patterns that showcase your natural hair texture. From simple straight-back styles to intricate geometric designs that celebrate African heritage.',
        price: 80,
        duration: '2-3 hours',
        category: 'Traditional',
        icon: '🌾',
        features: ['Quick installation', 'Versatile patterns', 'Great for all hair types', 'Cultural significance'],
        details: 'Cornrows are a traditional African braiding technique where hair is braided close to the scalp in straight or curved rows. This style has deep cultural roots and can be styled in countless creative patterns.',
        popular: false
      },
      {
        id: '3',
        name: 'Goddess Braids',
        description: 'Elegant goddess braids with decorative elements. A stunning style that combines beauty and sophistication. Perfect for special occasions or everyday elegance that makes you feel like royalty.',
        price: 180,
        duration: '5-7 hours',
        category: 'Specialty',
        icon: '👑',
        features: ['Elegant design', 'Decorative elements included', 'Special occasion ready', 'Long-lasting style'],
        details: 'Goddess braids are larger, thicker braids often styled with decorative accessories like beads, cuffs, or rings. This regal style creates a stunning, eye-catching look perfect for making a statement.',
        popular: true
      },
      {
        id: '4',
        name: 'Fulani Braids',
        description: 'Traditional Fulani braiding style with unique patterns and accessories. A beautiful cultural expression featuring distinctive center parts and decorative elements that honor West African heritage.',
        price: 160,
        duration: '4-6 hours',
        category: 'Traditional',
        icon: '✨',
        features: ['Cultural significance', 'Unique patterns', 'Accessories included', 'Distinctive style'],
        details: 'Fulani braids originate from the Fulani people of West Africa. This style features a center part, braids on the sides, and often includes decorative beads or accessories. A beautiful way to honor cultural heritage.',
        popular: false
      },
      {
        id: '5',
        name: 'Micro Braids',
        description: 'Fine micro braids for a delicate, natural look. Perfect for those who want subtle elegance with maximum hair protection. Ultra-fine braids that blend seamlessly with your natural hair.',
        price: 200,
        duration: '6-8 hours',
        category: 'Protective Styles',
        icon: '💫',
        features: ['Ultra-fine braids', 'Natural appearance', 'Long-lasting (8-10 weeks)', 'Maximum protection'],
        details: 'Micro braids are extremely small, fine braids that create a natural, seamless look. While installation takes longer, they last longer and provide excellent protection for your natural hair underneath.',
        popular: false
      },
      {
        id: '6',
        name: 'Knotless Braids',
        description: 'Gentle knotless braids for maximum hair protection. Reduces tension and promotes healthy hair growth. The modern, comfortable alternative to traditional box braids that your scalp will thank you for.',
        price: 170,
        duration: '5-7 hours',
        category: 'Protective Styles',
        icon: '🔄',
        features: ['Tension-free', 'Hair-friendly', 'Comfortable wear', 'Reduced breakage'],
        details: 'Knotless braids start with your natural hair and gradually incorporate extensions, eliminating the tight knot at the base. This technique reduces tension, prevents breakage, and is much more comfortable to wear.',
        popular: true
      },
      {
        id: '7',
        name: 'Feed-in Braids',
        description: 'Seamless feed-in braids that look natural and blend beautifully with your hair. The extension hair is gradually fed in, creating a smooth, natural appearance that looks like it grew from your scalp.',
        price: 140,
        duration: '4-5 hours',
        category: 'Protective Styles',
        icon: '🎯',
        features: ['Natural look', 'Seamless blend', 'Versatile styling', 'Comfortable'],
        details: 'Feed-in braids use a technique where extension hair is gradually added to your natural hair as you braid, creating a seamless transition. This method creates a more natural look and reduces tension on your scalp.',
        popular: false
      },
      {
        id: '8',
        name: 'Senegalese Twists',
        description: 'Classic Senegalese twists for a sleek, polished look. Perfect for professional settings and everyday wear. Two-strand twists that create a beautiful, uniform appearance with minimal maintenance.',
        price: 130,
        duration: '3-4 hours',
        category: 'Traditional',
        icon: '🌀',
        features: ['Sleek finish', 'Professional look', 'Easy maintenance', 'Quick installation'],
        details: 'Senegalese twists are created by twisting two strands of hair together with extensions. This style creates a sleek, uniform look that\'s perfect for professional environments and easy to maintain.',
        popular: false
      },
      {
        id: '9',
        name: 'Lemonade Braids',
        description: 'Side-swept braids inspired by Beyoncé\'s iconic look. A trendy style featuring braids swept to one side, perfect for making a fashion statement. Bold, beautiful, and absolutely stunning.',
        price: 165,
        duration: '5-6 hours',
        category: 'Specialty',
        icon: '🍋',
        features: ['Trendy style', 'Fashion-forward', 'Versatile', 'Eye-catching'],
        details: 'Lemonade braids are a modern style featuring cornrows or box braids swept to one side, inspired by Beyoncé\'s iconic look. This style is perfect for those who want a trendy, fashion-forward appearance.',
        popular: true
      },
      {
        id: '10',
        name: 'Passion Twists',
        description: 'Soft, bouncy twists with a natural, wavy texture. A modern protective style that combines the look of twists with added volume and movement. Perfect for those who want texture and bounce.',
        price: 155,
        duration: '4-5 hours',
        category: 'Protective Styles',
        icon: '💃',
        features: ['Natural texture', 'Added volume', 'Easy styling', 'Comfortable'],
        details: 'Passion twists use pre-twisted hair extensions to create soft, bouncy twists with natural movement. This style offers the protection of twists with added volume and a more relaxed, natural appearance.',
        popular: false
      },
      {
        id: '11',
        name: 'Ghana Braids',
        description: 'Traditional Ghana braids featuring intricate patterns and designs. A beautiful cultural style that showcases advanced braiding techniques. Perfect for those who appreciate artistry and tradition.',
        price: 145,
        duration: '4-5 hours',
        category: 'Traditional',
        icon: '🇬🇭',
        features: ['Intricate patterns', 'Cultural heritage', 'Unique designs', 'Versatile'],
        details: 'Ghana braids, also known as Ghanaian braids, feature intricate patterns and designs braided close to the scalp. This traditional style showcases advanced braiding techniques and cultural artistry.',
        popular: false
      },
      {
        id: '12',
        name: 'Crochet Braids',
        description: 'Quick installation crochet braids using a crochet hook. A versatile protective style that allows for various textures and styles with minimal tension. Perfect for those who want quick, easy styling.',
        price: 120,
        duration: '2-3 hours',
        category: 'Protective Styles',
        icon: '🪝',
        features: ['Quick installation', 'Minimal tension', 'Various textures', 'Easy removal'],
        details: 'Crochet braids use a crochet hook to attach pre-made braids or twists to cornrow base braids. This method is faster, causes less tension, and allows for easy style changes without redoing the entire head.',
        popular: false
      },
      {
        id: '13',
        name: 'Retwist Service',
        description: 'Professional retwist service to maintain your locs, twists, or braids. Keep your style fresh and neat with our expert retwisting techniques. Perfect for maintaining your protective style between full installations.',
        price: 60,
        duration: '1-2 hours',
        category: 'Maintenance',
        icon: '🔄',
        features: ['Maintains style freshness', 'Quick service', 'Affordable maintenance', 'Extends style life'],
        details: 'Retwisting is essential for maintaining locs, twists, and some braided styles. Our skilled stylists will carefully retwist your hair to keep it looking neat and well-maintained, extending the life of your style.',
        popular: true
      },
      {
        id: '14',
        name: 'Wig Application',
        description: 'Professional wig installation and application services. From glueless wigs to custom installations, we ensure a secure, natural-looking fit. Perfect for protective styling or style versatility.',
        price: 80,
        duration: '2-3 hours',
        category: 'Installation',
        icon: '👑',
        features: ['Secure application', 'Natural hairline', 'Custom fitting', 'Protective styling option'],
        details: 'Our wig application service includes proper cap fitting, natural hairline customization, and secure installation methods. Whether you prefer glueless, tape, or sew-in methods, we\'ve got you covered.',
        popular: false
      },
      {
        id: '15',
        name: 'Eyebrow Shaping',
        description: 'Professional eyebrow shaping and grooming services. Achieve perfectly arched brows that frame your face beautifully. We offer threading, waxing, and precision tweezing.',
        price: 25,
        duration: '30 minutes',
        category: 'Grooming',
        icon: '✨',
        features: ['Threading available', 'Waxing option', 'Precision shaping', 'Quick service'],
        details: 'Well-groomed eyebrows can transform your entire look. Our skilled technicians use threading, waxing, or precision tweezing to create the perfect arch and shape for your face.',
        popular: true
      },
      {
        id: '16',
        name: 'Hair Washing & Detangling',
        description: 'Professional hair washing and detangling service. Gentle cleansing and thorough detangling to prepare your hair for styling. Includes deep conditioning treatment.',
        price: 35,
        duration: '45-60 minutes',
        category: 'Hair Care',
        icon: '💧',
        features: ['Gentle cleansing', 'Thorough detangling', 'Deep conditioning included', 'Prepares for styling'],
        details: 'Proper hair washing and detangling is the foundation of any great style. Our gentle techniques ensure your hair is clean, detangled, and ready for styling without unnecessary breakage.',
        popular: false
      },
      {
        id: '17',
        name: 'Deep Conditioning Treatment',
        description: 'Intensive deep conditioning treatment to restore moisture and strength to your hair. Perfect for dry, damaged, or color-treated hair. Includes steam treatment for maximum penetration.',
        price: 45,
        duration: '1 hour',
        category: 'Hair Care',
        icon: '🌿',
        features: ['Moisture restoration', 'Steam treatment', 'Repairs damage', 'Strengthens hair'],
        details: 'Deep conditioning treatments penetrate the hair shaft to restore moisture, repair damage, and strengthen your hair. Includes a relaxing steam treatment for maximum product absorption.',
        popular: false
      },
      {
        id: '18',
        name: 'Hair Cut & Trim',
        description: 'Professional hair cutting and trimming services. From precision cuts to simple trims, we maintain your hair\'s health and shape. Perfect for maintaining your natural hair or styled looks.',
        price: 40,
        duration: '30-45 minutes',
        category: 'Hair Care',
        icon: '✂️',
        features: ['Precision cutting', 'Shape maintenance', 'Health-focused', 'Quick service'],
        details: 'Regular trims are essential for maintaining healthy hair and preventing split ends. Our skilled stylists will trim your hair while preserving your style and promoting healthy growth.',
        popular: false
      },
      {
        id: '19',
        name: 'Scalp Treatment',
        description: 'Therapeutic scalp treatment to promote healthy hair growth and relieve dryness or irritation. Includes exfoliation, massage, and nourishing oils. Perfect for maintaining a healthy scalp.',
        price: 50,
        duration: '45 minutes',
        category: 'Hair Care',
        icon: '💆🏾‍♀️',
        features: ['Promotes growth', 'Relieves irritation', 'Exfoliation included', 'Relaxing massage'],
        details: 'A healthy scalp is the foundation of healthy hair. Our scalp treatments include gentle exfoliation, therapeutic massage, and application of nourishing oils to promote optimal hair growth conditions.',
        popular: false
      },
      {
        id: '20',
        name: 'Style Refresh',
        description: 'Quick style refresh service to revive your existing braids, twists, or locs. Includes edge touch-ups, flyaway control, and overall style maintenance. Perfect between full installations.',
        price: 40,
        duration: '1 hour',
        category: 'Maintenance',
        icon: '💇🏾‍♀️',
        features: ['Edge touch-ups', 'Flyaway control', 'Quick refresh', 'Affordable'],
        details: 'Keep your style looking fresh between full installations with our style refresh service. We\'ll touch up edges, control flyaways, and ensure your style looks polished and well-maintained.',
        popular: false
      },
      {
        id: '21',
        name: 'Color Services',
        description: 'Professional hair coloring services including highlights, all-over color, and color correction. We use quality products to achieve your desired look while protecting your hair\'s health.',
        price: 120,
        duration: '2-4 hours',
        category: 'Styling',
        icon: '🎨',
        features: ['Highlights available', 'Color correction', 'Quality products', 'Hair protection'],
        details: 'Transform your look with professional hair coloring. Whether you want subtle highlights, bold color, or color correction, our experienced colorists will achieve your desired look while maintaining hair health.',
        popular: false
      }
    ]
  }

  const categories = ['all', ...new Set(services.map(s => s.category).filter(Boolean))]
  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory)

  const popularServices = services.filter(s => s.popular)

  if (loading) {
    return (
      <div className="services-page">
        <div className="container">
          <div className="loading">Loading services...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="services-page">
      <div className="container">
        <div className="services-header">
          <h1 className="page-title">Our Braiding Services</h1>
          <p className="page-subtitle">
            Expert braiding services tailored for your natural hair. 
            From traditional styles to modern protective looks, we've got you covered.
          </p>
        </div>

        {popularServices.length > 0 && (
          <section className="popular-section">
            <h2 className="section-heading">
              <span className="heading-icon">⭐</span>
              Most Popular Styles
            </h2>
            <div className="popular-grid">
              {popularServices.map((service) => (
                <div key={service.id} className="popular-card">
                  <div className="popular-badge">Popular</div>
                  <div className="popular-icon">{service.icon}</div>
                  <h3 className="popular-name">{service.name}</h3>
                  <div className="popular-price">Starting at ${service.price}</div>
                  <button 
                    className="btn btn-primary popular-btn"
                    onClick={() => navigate('/book-appointment')}
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {categories.length > 1 && (
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Services' : category}
              </button>
            ))}
          </div>
        )}

        {filteredServices.length === 0 ? (
          <div className="empty-services">
            <div className="empty-icon">💇🏾‍♀️</div>
            <h2>No services available</h2>
            <p>Please check back later or contact us for more information.</p>
          </div>
        ) : (
          <div className="services-grid">
            {filteredServices.map((service) => (
              <div key={service.id} className={`service-card ${service.popular ? 'popular' : ''}`}>
                {service.popular && <div className="popular-ribbon">⭐ Popular</div>}
                
                <div className="service-card-header">
                  <div className="service-icon">{service.icon || '✨'}</div>
                  <div className="service-header-text">
                    <h3 className="service-name">{service.name}</h3>
                    {service.category && (
                      <span className="service-category">{service.category}</span>
                    )}
                  </div>
                </div>

                <div className="service-card-body">
                  <p className="service-description">{service.description}</p>

                  {service.details && (
                    <div className="service-details-section">
                      <h4 className="details-title">About This Style</h4>
                      <p className="service-details">{service.details}</p>
                    </div>
                  )}

                  {service.features && service.features.length > 0 && (
                    <div className="service-features-section">
                      <h4 className="features-title">Key Features</h4>
                      <ul className="service-features">
                        {service.features.map((feature, index) => (
                          <li key={index} className="feature-item">
                            <span className="feature-check">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="service-info-footer">
                    <div className="service-price-section">
                      <span className="price-label">Starting at</span>
                      <div className="service-price">
                        <span className="price-currency">$</span>
                        <span className="price-amount">{service.price}</span>
                      </div>
                    </div>

                    {service.duration && (
                      <div className="service-duration">
                        <span className="duration-icon">⏱️</span>
                        <span className="duration-text">{service.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="service-card-footer">
                  <button 
                    className="btn btn-primary service-btn"
                    onClick={() => navigate('/book-appointment')}
                  >
                    Book This Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Services
