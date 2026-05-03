// ==========================================
// NEHA MEHNDI ART — main.js (No Three.js)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initTrailEffect();
  initUI();
  initChatbot();
  initGallery();
  initTestimonials();
  initMenuToggle();
  initBookingForm();
});

// ==========================================
// 0. BOOKING FORM SUBMISSION (GAS)
// ==========================================
function initBookingForm() {
  // 1. Home Page Modal Form
  const homeForm = document.getElementById('inquiryForm');
  if (homeForm) handleFormSubmit(homeForm, document.getElementById('formSuccess'), 'Home Page Modal');

  // 2. Dedicated Booking Page Form
  const bookingPageForm = document.getElementById('bookingPageForm');
  if (bookingPageForm) handleFormSubmit(bookingPageForm, document.getElementById('bookingResult'), 'Booking Page');
}

async function handleFormSubmit(form, resultEl, sourceName) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const originalText = btn.innerHTML;
    
    // UI Feedback
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    if (resultEl) {
      // ONLY clear innerHTML if it's a dynamic message container (like on booking page)
      // DO NOT clear it if it's the pre-styled formSuccess div
      if (resultEl.id !== 'formSuccess') {
        resultEl.innerHTML = '';
      }
      resultEl.style.display = 'none';
    }

    const formData = new FormData(form);
    const params = new URLSearchParams();
    
    // Determine action based on form ID or source
    const isBooking = form.id === 'bookingPageForm' || sourceName === 'Home Page Modal'; 
    // Actually, Home Page Modal should be Inquiry, Booking Page should be Booking.
    const action = (form.id === 'bookingPageForm') ? 'submitBooking' : 'submitInquiry';
    
    params.append('action', action);
    params.append('name', formData.get('name'));
    params.append('phone', formData.get('phone'));
    params.append('date', formData.get('date'));
    params.append('type', formData.get('type'));
    params.append('message', formData.get('message'));
    params.append('address', formData.get('address') || 'N/A');
    
    if (action === 'submitBooking') {
      params.append('package', formData.get('package') || 'Custom Package');
    } else {
      params.append('source', sourceName);
    }

    try {
      await fetch(CONFIG.GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      // Success UI Feedback
      if (resultEl) {
        resultEl.style.display = 'block';
        if (resultEl.id === 'formSuccess') {
          form.style.display = 'none';
        } else {
          // Dedicated Booking Page: Show modern modal
          const userName = formData.get('name') || 'Beautiful';
          const successModal = document.getElementById('bookingSuccessModal');
          const successGreeting = document.getElementById('successGreeting');
          
          if (successModal) {
            if (successGreeting) successGreeting.innerText = `Hi ${userName}!`;
            successModal.style.display = 'flex';
            setTimeout(() => { successModal.classList.add('active'); }, 10);
          }
          resultEl.innerHTML = '<p style="color:#D4AF37; font-weight:bold; margin-top:1rem;">✨ Success! Request sent.</p>';
        }
      }
      form.reset();
    } catch (err) {
      console.error(err);
      if (resultEl) {
        resultEl.style.display = 'block';
        resultEl.innerHTML = '<p style="color:red; margin-top:1rem;">Error submitting. Please call Neha directly.</p>';
      }
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });
}

// ==========================================
// 1. GOLD MOUSE TRAIL EFFECT (Pure Canvas 2D)
// ==========================================
function initTrailEffect() {
  const canvas = document.getElementById('trailCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];

  window.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: e.clientX + (Math.random() - 0.5) * 10,
        y: e.clientY + (Math.random() - 0.5) * 10,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        life: 1
      });
    }
  });

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  function animateTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${p.life})`;
      ctx.fill();
      p.x += p.speedX;
      p.y += p.speedY;
      p.size *= 0.95;
      p.life -= 0.03;
    });
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
}

// ==========================================
// 2. UI — NAVBAR, SCROLL, VIDEO SHOWCASE
// ==========================================
function initUI() {
  const navbar = document.getElementById('navbar');
  const trailCanvas = document.getElementById('trailCanvas');

  // Navbar glass + fade trail on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    // Fade trail when scrolled past hero (if it exists)
    const hero = document.getElementById('hero');
    if (hero && trailCanvas) {
      const heroH = hero.offsetHeight;
      const opacity = Math.max(0, 1 - (window.scrollY / heroH));
      trailCanvas.style.opacity = opacity;
    }
  });

  // Background Video Playlist
  const bgVideo = document.getElementById('bgVideo');
  if (bgVideo) {
    const playlist = ['3d/1.mp4', '3d/2.mp4', '3d/3.mp4', '3d/4.mp4'];
    let currentVid = Math.floor(Math.random() * playlist.length);
    
    // Set random video on load
    bgVideo.src = playlist[currentVid];
    
    bgVideo.addEventListener('ended', () => {
      currentVid = (currentVid + 1) % playlist.length;
      bgVideo.src = playlist[currentVid];
      bgVideo.play().catch(e => console.log('Autoplay prevented', e));
    });
  }

  // Contact form submission
  const form = document.getElementById('inquiryForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      btn.querySelector('.btn-text').style.display = 'none';
      btn.querySelector('.btn-loader').style.display = 'inline';
      btn.disabled = true;

      // Simulated delay (replace with real fetch() after deploying GAS)
      setTimeout(() => {
        form.style.display = 'none';
        document.querySelector('.modal-header').style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
        speak("Thank you! Your inquiry has been sent. We will contact you soon.");

        setTimeout(() => {
          closeContactModal();
          setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            document.querySelector('.modal-header').style.display = 'block';
            document.getElementById('formSuccess').style.display = 'none';
            btn.querySelector('.btn-text').style.display = 'inline';
            btn.querySelector('.btn-loader').style.display = 'none';
            btn.disabled = false;
          }, 500);
        }, 4000);
      }, 1500);
    });
  }

  // Call Button
  const callBtn = document.getElementById('callBtn');
  const callPanel = document.getElementById('callPanel');
  const closeCall = document.getElementById('closeCallPanel');
  
  if (callBtn) {
    callBtn.addEventListener('click', () => {
      const bubble = document.getElementById('chatbotBubble');
      const visible = callPanel.style.display === 'flex';
      callPanel.style.display = visible ? 'none' : 'flex';
      callPanel.style.flexDirection = 'column';
      
      // Hide Chatbot if opening Call Panel
      if (callPanel.style.display === 'flex') {
        if (bubble) bubble.style.display = 'none';
      } else {
        if (bubble) bubble.style.display = 'flex';
      }
    });
  }
  
  if (closeCall) {
    closeCall.addEventListener('click', () => {
      const bubble = document.getElementById('chatbotBubble');
      callPanel.style.display = 'none';
      if (bubble) bubble.style.display = 'flex';
    });
  }

  // Back to Top
  const btt = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (btt) {
      if (window.scrollY > 400) {
        btt.classList.add('visible');
      } else {
        btt.classList.remove('visible');
      }
    }
  });
  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Close modal on overlay click
  const contactModal = document.getElementById('contactModal');
  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target.id === 'contactModal') closeContactModal();
    });
  }
}

// Mobile Menu
function initMenuToggle() {
  const btn = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if (btn) {
    btn.addEventListener('click', () => {
      links.classList.toggle('active');
      btn.classList.toggle('active');
    });
    // Close menu when a link is clicked
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('active');
        btn.classList.remove('active');
      });
    });
  }
}

// Modal helpers (global scope for onclick attributes)
function openContact() {
  document.getElementById('contactModal').classList.add('active');
}

function openContactWith(type) {
  const sel = document.getElementById('mehndType');
  if (sel) sel.value = type;
  openContact();
}

function closeContactModal() {
  const modal = document.getElementById('contactModal');
  if (modal) modal.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('closeModal');
  if (closeBtn) closeBtn.addEventListener('click', closeContactModal);
});

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// 3. TALKING AI CHATBOT
// ==========================================
let synth = window.speechSynthesis;

function initChatbot() {
  const bubble = document.getElementById('chatbotBubble');
  const panel  = document.getElementById('chatbotPanel');
  const closeBtn = document.getElementById('closeChatbot');
  const input  = document.getElementById('chatInput');

  if (!bubble) return;

  bubble.addEventListener('click', () => {
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    bubble.style.display = 'none';
    
    // Hide Call Button if opening Chatbot
    const callBtn = document.getElementById('callBtn');
    if (callBtn) callBtn.style.display = 'none';
  });

  // Drag-to-Scroll for Desktop
  const quickBtns = document.querySelector('.chatbot-quick-btns');
  if (quickBtns) {
    let isDown = false, startX, scrollLeft;
    quickBtns.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - quickBtns.offsetLeft;
      scrollLeft = quickBtns.scrollLeft;
      quickBtns.style.cursor = 'grabbing';
    });
    quickBtns.addEventListener('mouseleave', () => {
      isDown = false;
      quickBtns.style.cursor = 'grab';
    });
    quickBtns.addEventListener('mouseup', () => {
      isDown = false;
      quickBtns.style.cursor = 'grab';
    });
    quickBtns.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - quickBtns.offsetLeft;
      const walk = (x - startX) * 2;
      quickBtns.scrollLeft = scrollLeft - walk;
    });
    quickBtns.style.cursor = 'grab';
  }

  closeBtn.addEventListener('click', () => {
    panel.style.display = 'none';
    bubble.style.display = 'flex';
    synth.cancel();
    
    // Show Call Button again
    const callBtn = document.getElementById('callBtn');
    if (callBtn) callBtn.style.display = 'flex';
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChat();
  });
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  appendMessage(msg, 'user-msg');
  input.value = '';
  setTimeout(() => processBotResponse(msg.toLowerCase()), 500);
}

function quickReply(type) {
  const map = {
    pricing: 'What is the pricing?',
    book:    'I want to book an appointment.',
    types:   'What types of Mehndi do you offer?',
    contact: 'How can I contact Neha?'
  };
  const msg = map[type] || '';
  appendMessage(msg, 'user-msg');
  setTimeout(() => processBotResponse(msg.toLowerCase()), 500);
}

function processBotResponse(query) {
  let reply = "I'm here to help! Ask me about Pricing, Packages, or Booking.";

  if (query.match(/price|cost|rate|pricing|package/)) {
    reply = "💰 For the Bridal Mehndi, Arabic Mehndi, Custom Design,to cantact with the Neha for the proper details and there Price. Want to contact us now..?";
  } else if (query.match(/book|appointment|schedule/)) {
    reply = "📅 Great! I'll open the booking form for you right now!";
    setTimeout(openContact, 2500);
  } else if (query.match(/type|design|arabic|bridal|custom/)) {
    reply = "🎨 We offer Bridal Mehndi, Arabic Fusion, Floral Patterns, and Custom Mandala designs. Check our Gallery!";
  } else if (query.match(/hi|hello|hey|namaste/)) {
    reply = "🙏 Namaste! How can Neha's team help you today?";
  } else if (query.match(/contact|phone|call|whatsapp/)) {
    reply = "📞 You can call or WhatsApp Neha at +91 9112911729, or use the 📞 button at the bottom-right!";
  } else if (query.match(/locat|address|visit|home/)) {
    reply = "📍 Neha offers both studio and home visits! Share your location when you book.";
  }

  // Show typing indicator first
  const container = document.getElementById('chatMessages');
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.innerHTML = '<span></span><span></span><span></span>';
  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    indicator.remove();
    appendMessage(reply, 'bot-msg', true);
    speak(reply.replace(/[💰📅🎨🙏📞📍]/g, ''));
  }, 1000 + Math.random() * 1000);
}

function appendMessage(text, cls, typeEffect = false) {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = cls;
  container.appendChild(div);

  if (typeEffect) {
    let i = 0;
    div.classList.add('typing-text');
    const timer = setInterval(() => {
      if (i < text.length) {
        div.innerHTML += text.charAt(i);
        i++;
        container.scrollTop = container.scrollHeight;
      } else {
        clearInterval(timer);
        div.classList.remove('typing-text');
      }
    }, 30);
  } else {
    div.innerHTML = text;
  }
  
  container.scrollTop = container.scrollHeight;
}

function speak(text) {
  if (!synth) return;
  if (synth.speaking) synth.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  const voices = synth.getVoices();
  const preferred = voices.find(v => v.lang.includes('en-IN')) || voices[0];
  if (preferred) utt.voice = preferred;
  utt.rate  = 0.95;
  utt.pitch = 1.1;
  synth.speak(utt);
}

window.speechSynthesis.onvoiceschanged = () => synth.getVoices();

// ==========================================
// 4. GALLERY
// ==========================================
const allImages = [
  { src: 'images/m1.jpeg',  type: 'bridal',  label: 'Royal Bridal' },
  { src: 'images/m2.jpeg',  type: 'arabic',  label: 'Arabic Fusion' },
  { src: 'images/m3.jpeg',  type: 'bridal',  label: 'Grand Bridal' },
  { src: 'images/m4.jpeg',  type: 'custom',  label: 'Mandala Art' },
  // { src: 'images/m5.jpeg',  type: 'arabic',  label: 'Floral Arabic' },
  { src: 'images/m6.jpeg',  type: 'bridal',  label: 'Heritage Bridal' },
  { src: 'images/m7.jpeg',  type: 'custom',  label: 'Custom Glitter' },
  { src: 'images/m8.jpeg',  type: 'arabic',  label: 'Bold Arabic' },
  { src: 'images/m9.jpeg',  type: 'bridal',  label: 'Bridal Feet' },
  { src: 'images/m10.jpeg', type: 'custom',  label: 'Geometric Art' },
  { src: 'images/m11.jpeg', type: 'arabic',  label: 'Arabic Leaves' },
  { src: 'images/m12.jpeg', type: 'bridal',  label: 'Bridal Wrist' },
  { src: 'images/m13.jpeg', type: 'arabic',  label: 'Arabic Peacock' },
  { src: 'images/m14.jpeg', type: 'custom',  label: 'Minimal Custom' },
  { src: 'images/m15.jpeg', type: 'bridal',  label: 'Full Hand Bridal' },
  { src: 'images/m16.jpeg', type: 'arabic',  label: 'Arabic Spiral' },
  { src: 'images/m17.jpeg', type: 'custom',  label: 'Floral Custom' },
  { src: 'images/m19.jpeg', type: 'bridal',  label: 'Dulhan Special' },
  { src: 'images/m20.jpeg', type: 'arabic',  label: 'Arabic Rose' },
  { src: 'images/m21.jpeg', type: 'custom',  label: 'Mandala Custom' },
  { src: 'images/m22.jpeg', type: 'bridal',  label: 'Rajasthani Bridal' },
  { src: 'images/m23.jpeg', type: 'bridal',  label: 'Signature Bridal' },
  // { src: 'images/m34.jpeg', type: 'arabic',  label: 'Arabic Elegance' },
  // { src: 'images/last.jpeg', type: 'custom', label: 'Artist Special' },
];

function initGallery() {
  const track1 = document.getElementById('marqueeTrack1');
  const track2 = document.getElementById('marqueeTrack2');
  if (!track1 || !track2) return;

  // Split images into two halves for the two tracks
  const half = Math.ceil(allImages.length / 2);
  const row1 = allImages.slice(0, half);
  const row2 = allImages.slice(half);

  // Function to create marquee HTML for a row
  const renderRow = (row, track) => {
    let html = '';
    // Duplicate the row elements once so the 50% translation matches exactly one row width for seamless looping
    const loopElements = [...row, ...row];
    loopElements.forEach(img => {
      html += `
        <div class="marquee-item" onclick="openLightbox('${img.src}', '${img.label}')">
          <img src="${img.src}" alt="${img.label}" loading="lazy" />
          <div class="gallery-overlay">
            <span class="gallery-icon">🔍</span>
            <p style="color:#D4AF37; font-family:'Playfair Display'; margin:0;">${img.label}</p>
          </div>
        </div>
      `;
    });
    track.innerHTML = html;
  };

  renderRow(row1, track1);
  renderRow(row2, track2);
}

// Lightbox
let lightboxIndex  = 0;

function openLightbox(src, label) {
  lightboxIndex  = allImages.findIndex(i => i.src === src);
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  
  // Restore nav buttons in case they were hidden by openDesignViewer
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  if (lbPrev) lbPrev.style.display = 'block';
  if (lbNext) lbNext.style.display = 'block';
  
  lb.classList.add('active');
  updateLightbox();
}

function updateLightbox() {
  const img = allImages[lightboxIndex];
  document.getElementById('lightboxImg').src     = img.src;
  document.getElementById('lightboxCaption').textContent = img.label;
}

document.addEventListener('DOMContentLoaded', () => {
  const lb      = document.getElementById('lightbox');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev  = document.getElementById('lbPrev');
  const lbNext  = document.getElementById('lbNext');

  if (lbClose) lbClose.addEventListener('click', () => lb.classList.remove('active'));
  if (lb)      lb.addEventListener('click', (e) => { if (e.target === lb) lb.classList.remove('active'); });
  if (lbPrev)  lbPrev.addEventListener('click', () => {
    lightboxIndex = (lightboxIndex - 1 + allImages.length) % allImages.length;
    updateLightbox();
  });
  if (lbNext)  lbNext.addEventListener('click', () => {
    lightboxIndex = (lightboxIndex + 1) % allImages.length;
    updateLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lb?.classList.contains('active')) return;
    if (e.key === 'ArrowLeft')  { lightboxIndex = (lightboxIndex - 1 + allImages.length) % allImages.length; updateLightbox(); }
    if (e.key === 'ArrowRight') { lightboxIndex = (lightboxIndex + 1) % allImages.length; updateLightbox(); }
    if (e.key === 'Escape')     lb.classList.remove('active');
  });
});

// ==========================================
// 5. TESTIMONIALS AUTO-SCROLL
// ==========================================
function initTestimonials() {
  const cards = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('testimonialDots');
  if (!cards.length) return;

  let current = 0;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    if (dotsContainer) dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    cards[current].style.display = 'none';
    current = index;
    cards[current].style.display = 'block';
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  // Show only first card initially
  cards.forEach((c, i) => c.style.display = i === 0 ? 'block' : 'none');

  setInterval(() => goTo((current + 1) % cards.length), 4000);
}

// ==========================================
// 5. DYNAMIC PACKAGES (GAS INTEGRATION)
// ==========================================
const GAS_URL = CONFIG.GAS_URL;

async function fetchDynamicPackages() {
  const container = document.getElementById('packagesContainer');
  if (!container) return;

  try {
    const response = await fetch(`${GAS_URL}?action=getPackages`);
    const packages = await response.json();
    
    if (Array.isArray(packages) && packages.length > 0) {
      renderPackages(packages);
    } else {
      throw new Error("No packages found");
    }

  } catch (error) {
    console.error("Error fetching packages:", error);
    // Fallback to mock data if live fetch fails (optional)
    const fallback = [
      { name: "Bridal Royal", price: "₹5,000 - ₹8,000", features: "Both hands & feet, Traditional motifs, 5 hours", icon: "👰" },
      { name: "Arabic Fusion", price: "₹1,500 - ₹3,000", features: "Bold floral patterns, Both hands, Quick 2 hours", icon: "🌙", featured: true },
      { name: "Minimalist Art", price: "₹800 - ₹1,500", features: "Single hand, Modern patterns, 1 hour session", icon: "✨" }
    ];
    renderPackages(fallback);
  }
}

function renderPackages(packages) {
  const container = document.getElementById('packagesContainer');
  if (!container) return;
  container.innerHTML = '';

  packages.forEach(pkg => {
    // Robust featured check
    const featuredRaw = pkg.featured;
    const isFeatured = featuredRaw === true || String(featuredRaw).toLowerCase() === 'true';

    const card = document.createElement('div');
    card.className = `service-card ${isFeatured ? 'featured' : ''}`;

    // Extract Google Drive link from ANY field (especially features) in case it was pasted there
    let extractedUrl = null;
    
    // Check if features contains a link
    let featuresStr = pkg.features ? String(pkg.features) : '';
    const driveRegex = /(https?:\/\/drive\.google\.com[^\s,]*)/i;
    
    const featureMatch = featuresStr.match(driveRegex);
    if (featureMatch) {
      extractedUrl = featureMatch[1];
      // Remove the link from the features text so it doesn't display as raw text
      featuresStr = featuresStr.replace(driveRegex, '').replace(/,,/g, ',').trim();
      if (featuresStr.endsWith(',')) featuresStr = featuresStr.slice(0, -1);
    }
    
    const featuresList = featuresStr.split(',').filter(f => f.trim() !== '').map(f => `<li>${f.trim()}</li>`).join('');

    // Safely check image
    let safeImage = pkg.image ? String(pkg.image).trim() : '';
    
    // If we extracted a URL from features, use it as the image URL
    if (extractedUrl && !safeImage) {
      safeImage = extractedUrl;
    }
    
    const hasImage = safeImage !== '';

    // Convert to thumbnail URL for display in <img> tag if it's a Drive link
    let displayImage = safeImage;
    if (displayImage.includes('drive.google.com')) {
      const idMatch = displayImage.match(/[?&]id=([^&]+)/) || displayImage.match(/\/file\/d\/([^\/]+)/);
      if (idMatch && idMatch[1]) {
        displayImage = `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w800`;
      }
    }

    // Safely replace single quotes in name
    const safeName = pkg.name ? String(pkg.name).replace(/'/g, "\\'").replace(/"/g, "&quot;") : '';
    
    // Construct actual link URL for the View Design button
    let fullUrl = safeImage;
    if (fullUrl.includes('drive.google.com')) {
      const match = fullUrl.match(/[?&]id=([^&]+)/) || fullUrl.match(/\/file\/d\/([^\/]+)/);
      if (match && match[1]) {
        fullUrl = `https://drive.google.com/file/d/${match[1]}/view`;
      }
    }
    // Final sanitize for HTML attribute safety
    fullUrl = fullUrl.replace(/"/g, "%22").replace(/'/g, "%27");

    // Determine what to show at the top of the card
    const mediaHTML = hasImage
      ? `<div class="service-image-wrapper">
           <img src="${displayImage}" alt="${pkg.name}" class="service-pkg-img" loading="lazy">
         </div>`
      : `<div class="service-image-placeholder"><span style="font-size:2rem;">${pkg.icon || '✨'}</span></div>`;

    card.innerHTML = `
      ${isFeatured ? '<div class="featured-badge">⭐ Most Popular</div>' : ''}
      ${mediaHTML}
      <div class="service-card-body">
        <h3>${pkg.name || 'Custom Package'}</h3>
        <p class="service-price">${pkg.price || 'Contact for price'}</p>
        <ul class="service-features">${featuresList}</ul>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:1rem;">
          <button class="btn-primary" style="flex:1; padding:0.8rem 1rem; font-size:0.9rem;" onclick="openContactWith('${safeName}')">Book Now</button>
          ${hasImage ? `<a href="${fullUrl}" target="_blank" class="btn-outline" style="flex:1; padding:0.8rem 1rem; font-size:0.9rem; display:flex; align-items:center; justify-content:center; gap:5px; text-decoration:none;"><i class="fa-solid fa-expand"></i> View Design</a>` : ''}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Function to open package image in a new tab (Google Drive view)
function openDesignViewer(imgSrc, caption) {
  if (imgSrc.includes('drive.google.com')) {
    const match = imgSrc.match(/[?&]id=([^&]+)/);
    if (match && match[1]) {
      // Open the full Google Drive preview page
      window.open(`https://drive.google.com/file/d/${match[1]}/view`, '_blank');
      return;
    }
  }
  
  // Fallback if not a Drive link
  window.open(imgSrc, '_blank');
}

// ───────────────── REVIEWS LOGIC ─────────────────
function openReviewModal() {
  const modal = document.getElementById('reviewModal');
  modal.classList.add('active');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeReviewModal() {
  const modal = document.getElementById('reviewModal');
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
  document.body.style.overflow = '';
  // Reset form
  document.getElementById('reviewForm').style.display = 'block';
  document.getElementById('reviewSuccess').style.display = 'none';
  document.getElementById('reviewForm').reset();
}

async function fetchReviews() {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;

  try {
    const response = await fetch(`${CONFIG.GAS_URL}?action=getReviews&v=${CONFIG.SITE_VERSION}`);
    const reviews = await response.json();
    renderReviews(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--text-muted);">Could not load reviews at this time.</p>';
  }
}

function renderReviews(reviews) {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;

  if (!reviews || reviews.length === 0) {
    container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--text-muted);">No reviews yet. Be the first to share your experience!</p>';
    return;
  }

  container.innerHTML = reviews.map(rev => {
    const initial = rev.name ? String(rev.name).charAt(0).toUpperCase() : '?';
    return `
      <div class="review-card" data-reveal="bottom">
        <div class="review-quote">“</div>
        <div class="review-content">
          ${rev.feedback}
        </div>
        <div class="review-author">
          <div class="review-avatar">${initial}</div>
          <div class="review-info">
            <h4>${rev.name}</h4>
            <span>Happy Client</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function submitReview(event) {
  event.preventDefault();
  const btn = document.getElementById('revSubmitBtn');
  const originalText = btn.innerHTML;
  
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

  const name = document.getElementById('revName').value;
  const feedback = document.getElementById('revFeedback').value;

  try {
    const response = await fetch(CONFIG.GAS_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'submitReview',
        name,
        feedback
      })
    });

    const result = await response.json();
    if (result.status === 'success') {
      document.getElementById('reviewForm').style.display = 'none';
      document.getElementById('reviewSuccess').style.display = 'block';
      // Refresh reviews after a delay? Or just wait for next load.
      setTimeout(fetchReviews, 2000);
    } else {
      alert("Submission failed. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    alert("An error occurred. Please try again.");
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  fetchDynamicPackages();
  fetchReviews();
});
