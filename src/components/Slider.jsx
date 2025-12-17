import { useEffect } from "react";

export default function Slider({ slides, current, setCurrent }) {
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, [slides.length, setCurrent]);

  return (
    <>
      <button className="slider-arrow prev" aria-label="Previous slide" onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button className="slider-arrow next" aria-label="Next slide" onClick={() => setCurrent((current + 1) % slides.length)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="hero-content">
        <div id="sliderCaption" className="slider-caption" dangerouslySetInnerHTML={{ __html: slides[current].text }} />
        <div className="carousel-dots">
          {slides.map((_, i) => (
            <div key={i} className={`dot ${i === current ? "active" : ""}`} onClick={() => setCurrent(i)} />
          ))}
        </div>
      </div>
    </>
  );
}
