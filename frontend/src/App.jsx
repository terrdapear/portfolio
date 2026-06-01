import { useEffect, useRef } from 'react'
import './App.css'

const CircularSlider = ({ images, altText }) => { // this allows the images to 
  const sliderRef = useRef(null);
  const isResetting = useRef(false);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    
    setTimeout(() => {
      slider.style.scrollBehavior = 'auto';
      slider.scrollLeft = slider.clientWidth;
      setTimeout(() => {
        slider.style.scrollBehavior = 'smooth';
      }, 50);
    }, 100);
  }, []);

  const handleScroll = (e) => {
    if (isResetting.current) return;
    
    const slider = e.target;
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    if (slider.scrollLeft <= 0) {
      isResetting.current = true;
      slider.style.scrollBehavior = 'auto'; 
      slider.scrollLeft = maxScroll - slider.clientWidth; 
      
      setTimeout(() => {
        slider.style.scrollBehavior = 'smooth'; 
        isResetting.current = false;
      }, 50);
    } 
    else if (slider.scrollLeft >= maxScroll - 5) {
      isResetting.current = true;
      slider.style.scrollBehavior = 'auto';
      slider.scrollLeft = slider.clientWidth;
      
      setTimeout(() => {
        slider.style.scrollBehavior = 'smooth';
        isResetting.current = false;
      }, 50);
    }
  };

  const extendedImages = [images[images.length - 1], ...images, images[0]];

  return (
    <div className="card-image-container">
      <div 
        className="card-image-slider" 
        ref={sliderRef}
        onScroll={handleScroll}
      >
        {extendedImages.map((src, index) => (
          <img key={index} src={src} alt={`${altText} ${index}`} />
        ))}
      </div>
      <div className="image-overlay"></div>
      <span className="scroll-hint">Swipe / Scroll ↔</span>
    </div>
  );
};


function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          } else {
            entry.target.classList.remove('active');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="portfolio-dark">
      <nav className="navbar-dark">
        <div className="nav-profile">
          <img src="https://i.ibb.co/XZ0hSnDp/AAA-7533.jpg" alt="Terrence" className="avatar" />
          <span className="logo-text">TERRENCE</span>
        </div>
        <div className="nav-links">
          <a href="#projects">Workspace</a>
          <a href="#about">About</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-github">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
            GitHub
          </a>
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-badge reveal">
          <span className="badge-glow"></span>
          <span className="badge-text">sup</span>
        </div>
        <h1 className="hero-title reveal">
          hi, I'm <span className="text-gradient">Terrence</span>.
        </h1>
        <p className="hero-subtitle reveal">
          “Give up on your dreams and die.” <span className="text-muted">— Levi Ackerman</span>
        </p>
        <div className="hero-actions reveal">
          <a href="#projects" className="btn-primary">Get started</a>
          <button className="btn-secondary">View capabilities</button>
        </div>
      </header>

      {/* grid */}
      <main id="projects" className="workspace-grid reveal">
        <div className="grid-header">
          <h2>Who I am</h2>
        </div>

        <div className="cards-container">
          
          {/*competitions */}
          <section className="tech-card reveal">
            <CircularSlider 
              images={[
                "https://i.ibb.co/ksgMgnmT/FB-IMG-1777480610376.jpg",
                "https://i.ibb.co/fz32PzBB/FB-IMG-1778745895988.jpg",
                "https://i.ibb.co/5hXNVFzN/FB-IMG-1780318592108.jpg",
                "https://i.ibb.co/vxRFj35c/FB-IMG-1778503958225.jpg",
                "https://i.ibb.co/KpFJZj5z/received-1223464819503978.jpg",
                "https://i.ibb.co/FkmHsmT7/received-1308574417499815.jpg",
              ]} 
              altText="Competitions" 
            />
            <div className="card-content">
              <div className="card-badge badge-blue">ACHIEVEMENTS</div>
              <h3>Competitions</h3>
              <p>Loren Ipcum.</p>
              <button className="btn-card-action">Press</button>
            </div>
          </section>

          {/*teaching */}
          <section className="tech-card reveal">
            <CircularSlider 
              images={[
                "https://i.ibb.co/RTqDv2fz/FB-IMG-1780318544436.jpg",
                "https://i.ibb.co/RTqDv2fz/FB-IMG-1780318544436.jpg"
              ]} 
              altText="Teaching" 
            />
            <div className="card-content">
              <div className="card-badge badge-pink">PASSION</div>
              <h3>Teaching</h3>
              <p>Description.</p>
              <button className="btn-card-action">Launch Module →</button>
            </div>
          </section>

          {/*organization */}
          <section className="tech-card reveal">
            <CircularSlider 
              images={[
                "https://i.ibb.co/jcDFyjm/630435438-1283413927171218-8897090017129508737-n.jpg",
                "https://i.ibb.co/jcDFyjm/630435438-1283413927171218-8897090017129508737-n.jpg"
              ]} 
              altText="Organization" 
            />
            <div className="card-content">
              <div className="card-badge badge-olive">FAMILY</div>
              <h3>Organization</h3>
              <p>Description.</p>
              <button className="btn-card-action">Launch Module →</button>
            </div>
          </section>
          
        </div>
      </main>

      <footer className="footer-dark reveal">
        <span className="tech-tag-accent">CRAZY YEARNER</span>
        <p className="footer-statement">
          My dream is to reach beyond what people think is possible.
        </p>
        <button className="btn-primary space-btn">Press to do something cool</button>
        
        <div className="footer-links-grid">
          <a href="t3rrenceissocool@gmail.com" className="link-item">Email</a>
          <a href="https://behance.net" target="_blank" rel="noreferrer" className="link-item text-pink">Behance</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="link-item text-cyan">LinkedIn</a>
        </div>
        
        <div className="footer-bottom">
          <p>© Terrence de Real 2026 // System Active</p>
        </div>
      </footer>
    </div>
  )
}

export default App