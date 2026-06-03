import { useEffect, useRef, useState } from 'react'
import './App.css'

const GameOfLifeBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let lastTime = 0;
    
    const fps = 12; 
    const interval = 1000 / fps;

    let cols, rows;
    const cellSize = 18;
    let grid = [];

    const createGrid = (c, r) => {
      return new Array(c).fill(null).map(() => 
        new Array(r).fill(0).map(() => (Math.random() > 0.85 ? 1 : 0))
      );
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / cellSize) + 1;
      rows = Math.floor(canvas.height / cellSize) + 1;
      grid = createGrid(cols, rows);
    };

    window.addEventListener('resize', resize);
    resize();

    const nextGeneration = () => {
      const nextGrid = grid.map(arr => [...arr]);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let state = grid[i][j];
          let neighbors = 0;

          for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
              if (x === 0 && y === 0) continue;
              const col = (i + x + cols) % cols;
              const row = (j + y + rows) % rows;
              neighbors += grid[col][row];
            }
          }

          if (state === 0 && neighbors === 3) {
            nextGrid[i][j] = 1;
          } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
            nextGrid[i][j] = 0;
          }
        }
      }

      if (Math.random() > 0.90) { // to keep it alive
        const rx = Math.floor(Math.random() * cols);
        const ry = Math.floor(Math.random() * rows);
        nextGrid[rx][ry] = 1;
      }

      grid = nextGrid;
    };

    const draw = (currentTime) => {
      animationFrameId = requestAnimationFrame(draw);
      
      const deltaTime = currentTime - lastTime;
      if (deltaTime > interval) {
        lastTime = currentTime - (deltaTime % interval);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(0, 243, 255, 0.15)'; 
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 5;

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            if (grid[i][j] === 1) {
              ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
            }
          }
        }
        
        nextGeneration();
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
  <canvas 
    ref={canvasRef} 
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: -1,
    }}
  />
);
};

const CircularSlider = ({ images, altText }) => { 
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
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [rotation, setRotation] = useState(0);

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

  useEffect(() => {
    const handlePageScroll = () => {
      const scrollY = window.scrollY;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = scrollY / scrollableHeight;
      const currentRotation = scrollPercentage * 360;
      
      setRotation(currentRotation);
    };

    window.addEventListener('scroll', handlePageScroll);
    return () => window.removeEventListener('scroll', handlePageScroll);
  }, []);

  return (
    <div className="portfolio-dark">
      <nav className="navbar-dark">
        <div className="nav-profile">
          <img 
            src="https://i.ibb.co/XZ0hSnDp/AAA-7533.jpg" 
            alt="Terrence" 
            className="avatar" 
            style={{ transform: `rotate(${rotation}deg)` }}
          />
          <span className="logo-text">TERRENCE</span>
        </div>
        <div className="nav-links">
          <a href="#projects">Workspace</a>
          <a href="#about">About</a>
          <a href="https://github.com/terrdapear" target="_blank" rel="noreferrer" className="btn-github">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
            GitHub
          </a>
        </div>
      </nav>

      <header className="hero-section" style={{ position: 'relative' }}>
        <GameOfLifeBackground />
        
        <div className="hero-badge reveal">
          <span className="badge-glow"></span>
          <span className="badge-text">sup</span>
        </div>
        <h1 className="hero-title reveal">
          hi, I'm Terrence
        </h1>
        <p className="hero-subtitle reveal">
          “Give up on your dreams and die.” <span className="text-muted">— Levi Ackerman</span>
        </p>
        <div className="hero-actions reveal">
          <a href="#projects" className="btn-primary">Get started</a>
          <button className="btn-secondary" onClick={() => setIsContactOpen(true)}>Contact me</button>
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
              <p>I love competing, but I'm relatively new to the scene. I only began during my sophomore year, but in that same year, I qualified and I thrived in 5 out of the 5 national-level math or programming competitions I joined, earning distinctions and high placing finishes.</p>
              <button className="btn-card-action">Learn more</button>
            </div>
          </section>

          {/*teaching */}
          <section className="tech-card reveal">
            <CircularSlider 
              images={[
                "https://i.ibb.co/RTqDv2fz/FB-IMG-1780318544436.jpg",
                "https://i.ibb.co/WNGbfnrh/7da3fd96-3bb1-4a8f-b691-41827587bd04.jpg"
              ]} 
              altText="Teaching" 
            />
            <div className="card-content">
              <div className="card-badge badge-pink">PASSION</div>
              <h3>Teaching</h3>
              <p>I love to teach. I spent two years as an online tutor on Fiverr, teaching chess and math. Ever since I step foot on UP, I've taught many student-led lectures, face-to-face and online, as well as tutored spanning several subjects for several hundred hours.</p>
              <button className="btn-card-action">Learn more</button>
            </div>
          </section>

          {/*organization */}
          <section className="tech-card reveal">
            <CircularSlider 
              images={[
                "https://i.ibb.co/Gvw7TbVK/558938556-1189407953238483-3248254681896504410-n.jpg",
                "https://i.ibb.co/jcDFyjm/630435438-1283413927171218-8897090017129508737-n.jpg"
              ]} 
              altText="Organization" 
            />
            <div className="card-content">
              <div className="card-badge badge-olive">FAMILY</div>
              <h3>Organization</h3>
              <p>Much of my success is thanks to my organization, UPLB Mathematical Sciences Society. They have supported me and generously funded my endeavors. I could not be more grateful to them.</p>
              <button className="btn-card-action">Learn more</button>
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
          <button className="link-item contact-trigger" onClick={() => setIsContactOpen(true)}>Contact Me</button>
          <a target="_blank" rel="noreferrer" className="link-item text-cyan">LinkedIn</a>
        </div>
        
        <div className="footer-bottom">
          <p>© Terrence de Real 2026 // System Active</p>
        </div>
      </footer>

      <div 
        className={`contact-overlay ${isContactOpen ? 'open' : ''}`} 
        onClick={() => setIsContactOpen(false)}
      ></div>
      
      <div className={`contact-drawer ${isContactOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>Let's Talk</h2>
          <button className="close-btn" onClick={() => setIsContactOpen(false)}>&times;</button>
        </div>
        
        <div className="drawer-content">
          <p>Hi, if you want to collaborate with me or you need someone to train you or your kid, feel free to contact me using my details below.</p>
          
          <div className="contact-detail-item">
            <span className="detail-label">Email</span>
            <a href="mailto:t3rrenceissocool@gmail.com" className="detail-value text-cyan">
              t3rrenceissocool@gmail.com
            </a>
          </div>

          <div className="contact-detail-item">
            <span className="detail-label">Phone</span>
            <a className="detail-value text-cyan">
              (+63) 991 682 9492
            </a>
          </div>
          
          <div className="contact-detail-item">
            <span className="detail-label">Socials</span>
            <a href="https://www.facebook.com/terrence.de.real/" className="detail-value">
              Facebook
            </a>
            <a className="detail-value">
              LinkedIn
            </a>
            <a href="https://github.com/terrdapear" target="_blank" rel="noreferrer" className="detail-value">
              GitHub
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}

export default App