<template>
  <div class="ux-pro-max-landing">
    <!-- Floating Glass Navigation -->
    <nav class="floating-nav glass-panel">
      <div class="container">
        <div class="nav-content">
          <div class="nav-left">
            <a href="/#/" @click.prevent="router.push('/')" class="back-button">
              <span class="back-icon">←</span>
              <span>Back to Admin</span>
            </a>
          </div>
          <div class="nav-center">
            <div class="logo">
              <span class="logo-icon">🎨</span>
              <span class="logo-text">UI/UX Pro Max</span>
            </div>
          </div>
          <div class="nav-right">
            <div class="nav-links">
              <a href="javascript:void(0)" class="nav-link" @click="scrollToSection('features')">Features</a>
              <a href="javascript:void(0)" class="nav-link" @click="scrollToSection('services')">Services</a>
              <a href="javascript:void(0)" class="nav-link" @click="scrollToSection('portfolio')">Portfolio</a>
              <a href="javascript:void(0)" class="nav-link" @click="scrollToSection('pricing')">Pricing</a>
              <a href="javascript:void(0)" class="nav-link" @click="scrollToSection('contact')">Contact</a>
            </div>
            <div class="nav-actions">
              <button class="btn-secondary-glass">Sign In</button>
              <button class="btn-primary-glow">Get Started</button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">Elevate Your Digital Experience</h1>
            <p class="hero-subtitle">Professional UI/UX design solutions that transform your vision into stunning digital experiences. We create interfaces that captivate, engage, and convert.</p>
            <div class="hero-buttons">
              <button class="btn-primary-glow">Start Project</button>
              <button class="btn-secondary-glass">View Portfolio</button>
            </div>
            <div class="hero-stats">
              <div class="stat-item">
                <div class="stat-value">500+</div>
                <div class="stat-label">Projects</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">200+</div>
                <div class="stat-label">Clients</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">5+</div>
                <div class="stat-label">Years</div>
              </div>
            </div>
          </div>
          <div class="hero-image">
            <div class="image-container glass-card">
              <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20ui%20ux%20design%20workspace%20with%20multiple%20screens%2C%20dark%20theme%2C%20professional%20interface%20design&image_size=landscape_16_9" alt="UI/UX Design" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Our Core Features</h2>
          <p class="section-subtitle">We offer a comprehensive set of design services to bring your digital vision to life</p>
        </div>
        <div class="features-grid">
          <div class="feature-card glass-card">
            <div class="feature-icon">🎨</div>
            <h3 class="feature-title">UI Design</h3>
            <p class="feature-description">Create visually stunning interfaces that capture attention and enhance user experience</p>
          </div>
          <div class="feature-card glass-card">
            <div class="feature-icon">🧠</div>
            <h3 class="feature-title">UX Research</h3>
            <p class="feature-description">Conduct in-depth user research to understand needs and create user-centered designs</p>
          </div>
          <div class="feature-card glass-card">
            <div class="feature-icon">📱</div>
            <h3 class="feature-title">Responsive Design</h3>
            <p class="feature-description">Ensure seamless experiences across all devices and screen sizes</p>
          </div>
          <div class="feature-card glass-card">
            <div class="feature-icon">⚡</div>
            <h3 class="feature-title">Prototyping</h3>
            <p class="feature-description">Create interactive prototypes to test and refine designs before development</p>
          </div>
          <div class="feature-card glass-card">
            <div class="feature-icon">📊</div>
            <h3 class="feature-title">User Testing</h3>
            <p class="feature-description">Gather valuable feedback through user testing to optimize designs</p>
          </div>
          <div class="feature-card glass-card">
            <div class="feature-icon">🎯</div>
            <h3 class="feature-title">Brand Identity</h3>
            <p class="feature-description">Develop cohesive brand identities that resonate with your target audience</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="services">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Our Services</h2>
          <p class="section-subtitle">Comprehensive design solutions tailored to your specific needs</p>
        </div>
        <div class="services-grid">
          <div class="service-card glass-card">
            <div class="service-icon">🖥️</div>
            <h3 class="service-title">Web Design</h3>
            <p class="service-description">Create stunning websites that deliver exceptional user experiences</p>
            <button class="btn-secondary-glass">Learn More</button>
          </div>
          <div class="service-card glass-card">
            <div class="service-icon">📱</div>
            <h3 class="service-title">Mobile App Design</h3>
            <p class="service-description">Design intuitive mobile applications that users love</p>
            <button class="btn-secondary-glass">Learn More</button>
          </div>
          <div class="service-card glass-card">
            <div class="service-icon">🎨</div>
            <h3 class="service-title">Brand Design</h3>
            <p class="service-description">Develop strong brand identities that stand out in the marketplace</p>
            <button class="btn-secondary-glass">Learn More</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Portfolio Section -->
    <section id="portfolio" class="portfolio">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Our Portfolio</h2>
          <p class="section-subtitle">Showcase of our recent projects and design work</p>
        </div>
        <div class="portfolio-grid">
          <div class="portfolio-item glass-card">
            <div class="portfolio-image">
              <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20website%20design%20mockup%2C%20professional%20layout%2C%20dark%20theme&image_size=landscape_4_3" alt="Portfolio Project" />
            </div>
            <div class="portfolio-info">
              <h3 class="portfolio-title">E-commerce Platform</h3>
              <p class="portfolio-description">Modern e-commerce website with seamless user experience</p>
              <button class="btn-primary-glow">View Project</button>
            </div>
          </div>
          <div class="portfolio-item glass-card">
            <div class="portfolio-image">
              <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mobile%20app%20design%20interface%2C%20professional%20UI%2C%20dark%20theme&image_size=portrait_4_3" alt="Portfolio Project" />
            </div>
            <div class="portfolio-info">
              <h3 class="portfolio-title">Fitness App</h3>
              <p class="portfolio-description">Intuitive fitness tracking application with engaging UI</p>
              <button class="btn-primary-glow">View Project</button>
            </div>
          </div>
          <div class="portfolio-item glass-card">
            <div class="portfolio-image">
              <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=brand%20identity%20design%2C%20logo%20and%20branding%20materials%2C%20professional%20design&image_size=landscape_4_3" alt="Portfolio Project" />
            </div>
            <div class="portfolio-info">
              <h3 class="portfolio-title">Brand Identity</h3>
              <p class="portfolio-description">Comprehensive brand identity for a tech startup</p>
              <button class="btn-primary-glow">View Project</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="pricing">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Pricing Plans</h2>
          <p class="section-subtitle">Choose the perfect plan for your design needs</p>
        </div>
        <div class="pricing-grid">
          <div class="pricing-card glass-card">
            <div class="pricing-header">
              <h3 class="pricing-title">Starter</h3>
              <div class="pricing-price">
                <span class="price-value">$999</span>
                <span class="price-period">/project</span>
              </div>
            </div>
            <div class="pricing-features">
              <div class="feature-item">
                <span class="feature-check">✓</span>
                <span class="feature-text">Up to 5 design concepts</span>
              </div>
              <div class="feature-item">
                <span class="feature-check">✓</span>
                <span class="feature-text">Basic UI design</span>
              </div>
              <div class="feature-item">
                <span class="feature-check">✓</span>
                <span class="feature-text">2 rounds of revisions</span>
              </div>
              <div class="feature-item disabled">
                <span class="feature-check">✗</span>
                <span class="feature-text">UX research</span>
              </div>
              <div class="feature-item disabled">
                <span class="feature-check">✗</span>
                <span class="feature-text">Prototyping</span>
              </div>
            </div>
            <button class="btn-secondary-glass w-full">Choose Plan</button>
          </div>
          <div class="pricing-card glass-card featured">
            <div class="featured-badge">Popular</div>
            <div class="pricing-header">
              <h3 class="pricing-title">Professional</h3>
              <div class="pricing-price">
                <span class="price-value">$2,499</span>
                <span class="price-period">/project</span>
              </div>
            </div>
            <div class="pricing-features">
              <div class="feature-item">
                <span class="feature-check">✓</span>
                <span class="feature-text">Unlimited design concepts</span>
              </div>
              <div class="feature-item">
                <span class="feature-check">✓</span>
                <span class="feature-text">Complete UI/UX design</span>
              </div>
              <div class="feature-item">
                <span class="feature-check">✓</span>
                <span class="feature-text">5 rounds of revisions</span>
              </div>
              <div class="feature-item">
                <span class="feature-check">✓</span>
                <span class="feature-text">UX research</span>
              </div>
              <div class="feature-item">
                <span class="feature-check">✓</span>
                <span class="feature-text">Interactive prototyping</span>
              </div>
            </div>
            <button class="btn-primary-glow w-full">Choose Plan</button>
          </div>
          <div class="pricing-card glass-card">
            <div class="pricing-header">
              <h3 class="pricing-title">Enterprise</h3>
              <div class="pricing-price">
                <span class="price-value">Custom</span>
                <span class="price-period">/quote</span>
              </div>
            </div>
            <div class="pricing-features">
              <div class="feature-item">
                <span class="feature-check">✓</span>
                <span class="feature-text">Unlimited everything</span>
              </div>
              <div class="feature-item">
                <span class="feature-check">✓</span>
                <span class="feature-text">Full-service design</span>
              </div>
              <div class="feature-item">
                <span class="feature-check">✓</span>
                <span class="feature-text">Unlimited revisions</span>
              </div>
              <div class="feature-item">
                <span class="feature-check">✓</span>
                <span class="feature-text">Dedicated design team</span>
              </div>
              <div class="feature-item">
                <span class="feature-check">✓</span>
                <span class="feature-text">24/7 support</span>
              </div>
            </div>
            <button class="btn-secondary-glass w-full">Get Quote</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="testimonials">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Client Testimonials</h2>
          <p class="section-subtitle">What our clients say about our design services</p>
        </div>
        <div class="testimonials-grid">
          <div class="testimonial-card glass-card">
            <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p class="testimonial-text">"UI/UX Pro Max transformed our website into a stunning digital experience. Their attention to detail and user-centered approach resulted in a significant increase in user engagement."</p>
            <div class="testimonial-author">
              <div class="author-avatar">👨‍💼</div>
              <div class="author-info">
                <div class="author-name">John Smith</div>
                <div class="author-role">CEO, Tech Startup</div>
              </div>
            </div>
          </div>
          <div class="testimonial-card glass-card">
            <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p class="testimonial-text">"Working with UI/UX Pro Max was a game-changer for our mobile app. Their design expertise and creative solutions helped us create an app that users love."</p>
            <div class="testimonial-author">
              <div class="author-avatar">👩‍💼</div>
              <div class="author-info">
                <div class="author-name">Sarah Johnson</div>
                <div class="author-role">Product Manager</div>
              </div>
            </div>
          </div>
          <div class="testimonial-card glass-card">
            <div class="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p class="testimonial-text">"The brand identity they created for our company perfectly captures our vision. Their professionalism and creativity exceeded our expectations."</p>
            <div class="testimonial-author">
              <div class="author-avatar">🧑‍🎨</div>
              <div class="author-info">
                <div class="author-name">Michael Chen</div>
                <div class="author-role">Founder, Creative Agency</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
      <div class="container">
        <div class="contact-content">
          <div class="contact-info">
            <h2 class="contact-title">Get In Touch</h2>
            <p class="contact-subtitle">Ready to start your project? Contact us today for a free consultation</p>
            <div class="contact-details">
              <div class="contact-item">
                <span class="contact-icon">📧</span>
                <span class="contact-text">hello@uiuxpromax.com</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📞</span>
                <span class="contact-text">+1 (555) 123-4567</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📍</span>
                <span class="contact-text">123 Design Street, San Francisco, CA</span>
              </div>
            </div>
          </div>
          <div class="contact-form glass-card">
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label class="form-label">Name</label>
                <input v-model="form.name" class="input-glass" placeholder="Your name" />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input v-model="form.email" type="email" class="input-glass" placeholder="Your email" />
              </div>
              <div class="form-group">
                <label class="form-label">Message</label>
                <textarea v-model="form.message" class="input-glass" rows="4" placeholder="Your message"></textarea>
              </div>
              <button type="submit" class="btn-primary-glow w-full">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <div class="logo">
              <span class="logo-icon">🎨</span>
              <span class="logo-text">UI/UX Pro Max</span>
            </div>
            <p class="footer-description">Creating exceptional digital experiences through innovative design</p>
          </div>
          <div class="footer-section">
            <h4 class="footer-section-title">Services</h4>
            <ul class="footer-links">
              <li><a href="javascript:void(0)" @click="scrollToSection('features')">UI Design</a></li>
              <li><a href="javascript:void(0)" @click="scrollToSection('features')">UX Research</a></li>
              <li><a href="javascript:void(0)" @click="scrollToSection('services')">Web Design</a></li>
              <li><a href="javascript:void(0)" @click="scrollToSection('services')">Mobile App Design</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4 class="footer-section-title">Company</h4>
            <ul class="footer-links">
              <li><a href="javascript:void(0)">About Us</a></li>
              <li><a href="javascript:void(0)">Team</a></li>
              <li><a href="javascript:void(0)">Careers</a></li>
              <li><a href="javascript:void(0)" @click="scrollToSection('contact')">Contact</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4 class="footer-section-title">Support</h4>
            <ul class="footer-links">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="footer-copyright">© 2026 UI/UX Pro Max. All rights reserved.</p>
          <div class="footer-social">
            <a href="#" class="social-link">Twitter</a>
            <a href="#" class="social-link">LinkedIn</a>
            <a href="#" class="social-link">Instagram</a>
            <a href="#" class="social-link">Behance</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = () => {
  console.log('Form submitted:', form.value)
  alert('Message sent! We will get back to you soon.')
  form.value = {
    name: '',
    email: '',
    message: ''
  }
}

// 滚动到指定section
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.ux-pro-max-landing {
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.floating-nav {
  position: fixed;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  border-radius: 24px;
  padding: 16px 24px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 90%;
  max-width: 1100px;
}

.floating-nav:hover {
  transform: translateX(-50%) translateY(-4px);
  box-shadow: 0 16px 64px rgba(102, 126, 234, 0.3);
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.nav-left {
  flex: 1;
  display: flex;
  align-items: center;
}

.nav-center {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-right {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.back-icon {
  font-size: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
}

.nav-link:hover {
  color: white;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.hero {
  padding: 200px 0 120px;
  position: relative;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 48px;
}

.hero-stats {
  display: flex;
  gap: 48px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: white;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container {
  width: 100%;
  max-width: 500px;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
  transform: perspective(1000px) rotateY(5deg);
  transition: transform 0.5s ease;
}

.image-container:hover {
  transform: perspective(1000px) rotateY(0);
}

.image-container img {
  width: 100%;
  height: auto;
  display: block;
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-title {
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 16px 0;
}

.section-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.features {
  padding: 120px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.feature-card {
  padding: 32px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(102, 126, 234, 0.2);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 24px;
}

.feature-title {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0 0 12px 0;
}

.feature-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.6;
}

.services {
  padding: 120px 0;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}

.service-card {
  padding: 32px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(102, 126, 234, 0.2);
}

.service-icon {
  font-size: 48px;
  margin-bottom: 24px;
}

.service-title {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0 0 12px 0;
}

.service-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.portfolio {
  padding: 120px 0;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}

.portfolio-item {
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.portfolio-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(102, 126, 234, 0.2);
}

.portfolio-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
}

.portfolio-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.portfolio-item:hover .portfolio-image img {
  transform: scale(1.1);
}

.portfolio-info {
  padding: 24px;
  text-align: center;
}

.portfolio-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
}

.portfolio-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 16px 0;
}

.pricing {
  padding: 120px 0;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  max-width: 960px;
  margin: 0 auto;
}

.pricing-card {
  padding: 32px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.pricing-card.featured {
  transform: scale(1.05);
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
}

.pricing-card:hover {
  transform: translateY(-8px);
}

.pricing-card.featured:hover {
  transform: scale(1.05) translateY(-8px);
}

.featured-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 20px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pricing-header {
  text-align: center;
  margin-bottom: 32px;
}

.pricing-title {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0 0 16px 0;
}

.pricing-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.price-value {
  font-size: 48px;
  font-weight: 800;
  color: white;
}

.price-period {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.pricing-features {
  margin-bottom: 32px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 14px;
}

.feature-check {
  color: #4CAF50;
  font-weight: bold;
}

.feature-item.disabled .feature-check {
  color: rgba(255, 255, 255, 0.3);
}

.feature-item.disabled .feature-text {
  color: rgba(255, 255, 255, 0.3);
}

.feature-text {
  color: rgba(255, 255, 255, 0.8);
}

.testimonials {
  padding: 120px 0;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}

.testimonial-card {
  padding: 32px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.testimonial-card:hover {
  transform: translateY(-8px);
}

.testimonial-rating {
  font-size: 20px;
  margin-bottom: 16px;
}

.testimonial-text {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0 0 24px 0;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 16px;
}

.author-avatar {
  font-size: 48px;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.author-role {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.contact {
  padding: 120px 0;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}

.contact-title {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 16px 0;
}

.contact-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 32px 0;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.contact-icon {
  font-size: 24px;
}

.contact-form {
  padding: 32px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-glass {
  width: 100%;
  padding: 14px 18px;
  font-size: 15px;
  color: white;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  outline: none;
  transition: all 0.3s ease;
  font-family: inherit;
}

.input-glass::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.input-glass:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.footer {
  padding: 80px 0 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 120px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 48px;
  margin-bottom: 48px;
}

.footer-section-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

.footer-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 16px 0 0 0;
  line-height: 1.6;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  flex-wrap: wrap;
  gap: 24px;
}

.footer-copyright {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

.footer-social {
  display: flex;
  gap: 24px;
}

.social-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: white;
}

.glass-panel {
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-card {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
}

.btn-primary-glow {
  position: relative;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  white-space: nowrap;
}

.btn-primary-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
}

.btn-secondary-glass {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  white-space: nowrap;
}

.btn-secondary-glass:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.w-full {
  width: 100%;
}

@media (max-width: 768px) {
  .floating-nav {
    width: 95%;
    padding: 12px 16px;
  }

  .nav-content {
    flex-wrap: wrap;
    gap: 12px;
  }

  .nav-left {
    flex: 0 0 100%;
    justify-content: center;
  }

  .nav-center {
    flex: 1;
    order: -1;
  }

  .nav-right {
    flex: 0 0 100%;
    flex-direction: column;
    gap: 12px;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }

  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 48px;
  }

  .hero-title {
    font-size: 42px;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-stats {
    justify-content: center;
  }

  .contact-content {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>