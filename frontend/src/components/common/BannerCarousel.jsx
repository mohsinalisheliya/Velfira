import { useEffect, useState, useCallback, useRef } from "react";

export default function BannerCarousel({ banners, intervalMs = 5000 }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const total = banners.length;

  const goTo = useCallback(
    (i) => {
      setIndex(((i % total) + total) % total); // wraps around both directions
    },
    [total]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-advance
  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [total, intervalMs, index]); // reset timer whenever index changes (manual click resets the clock)

  if (total === 0) return null;

  const current = banners[index];

  return (
    <div className="banner-wrap">
      <a href={current.link_url || "/shop"} className="banner banner-img-link" key={current.id}>
        <img src={current.image} alt={current.title || "Velfira offer"} />
      </a>

      {total > 1 && (
        <>
          <button className="banner-arrow left" onClick={(e) => { e.preventDefault(); prev(); }} aria-label="Previous banner">‹</button>
          <button className="banner-arrow right" onClick={(e) => { e.preventDefault(); next(); }} aria-label="Next banner">›</button>

          <div className="banner-dots">
            {banners.map((b, i) => (
              <button
                key={b.id}
                className={`banner-dot ${i === index ? "active" : ""}`}
                onClick={(e) => { e.preventDefault(); goTo(i); }}
                aria-label={`Go to banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}