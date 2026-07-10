'use client';

export function CircuitLayer() {
  return (
    <div className="cinema-circuit-layer" aria-hidden>
      <svg className="cinema-circuit-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="cinema-flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0)" />
            <stop offset="50%" stopColor="rgba(56, 189, 248, 0.9)" />
            <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
          </linearGradient>
        </defs>
        <path
          id="cinema-path-a"
          className="cinema-circuit-path"
          d="M0 120 H420 V280 H920 V420 H1440"
        />
        <path
          id="cinema-path-b"
          className="cinema-circuit-path cinema-circuit-path--dim"
          d="M0 680 H260 V520 H760 V360 H1440"
        />
        <circle className="cinema-energy-node" cx="420" cy="280" r="4" />
        <circle className="cinema-energy-node" cx="920" cy="420" r="4" />
      </svg>
      <div className="cinema-energy-pulse" data-cinema-pulse />
      <div className="cinema-particle-field">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} className="cinema-particle" style={{ '--i': index } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}
