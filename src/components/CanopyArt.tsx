/**
 * Generated canopy-light artwork used as the hero backdrop.
 * Evokes warm sunlight seeping through leaves with layered gradients,
 * soft foliage shapes, and a very restrained survey-grid overlay.
 * without relying on stock photography. Swap for real canopy
 * photography later by replacing this component's contents.
 */
export function CanopyArt({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="sunlight" cx="68%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#e8c98a" />
            <stop offset="32%" stopColor="#a99356" />
            <stop offset="62%" stopColor="#4e5c38" />
            <stop offset="100%" stopColor="#16241a" />
          </radialGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f4dfae" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f4dfae" stopOpacity="0" />
          </radialGradient>
          <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="42" />
          </filter>
          <filter id="softer" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="70" />
          </filter>
        </defs>

        {/* warm light field */}
        <rect width="1440" height="900" fill="url(#sunlight)" />
        <circle cx="980" cy="250" r="340" fill="url(#glow)" />

        {/* foliage masses, blurred soft */}
        <g filter="url(#softer)" opacity="0.85">
          <ellipse cx="160" cy="120" rx="420" ry="300" fill="#1c2e1f" />
          <ellipse cx="1320" cy="780" rx="460" ry="320" fill="#1a2b1d" />
          <ellipse cx="540" cy="840" rx="520" ry="260" fill="#22361f" />
        </g>
        <g filter="url(#soft)" opacity="0.7">
          <ellipse cx="380" cy="240" rx="260" ry="170" fill="#2c4226" />
          <ellipse cx="1180" cy="120" rx="300" ry="180" fill="#33491f" />
          <ellipse cx="820" cy="760" rx="280" ry="160" fill="#2a3e22" />
          <ellipse cx="90" cy="620" rx="240" ry="200" fill="#243823" />
        </g>

        {/* drifting leaf shadows */}
        <g filter="url(#soft)" opacity="0.35">
          <ellipse
            cx="700"
            cy="380"
            rx="150"
            ry="60"
            fill="#1b2c1c"
            transform="rotate(-18 700 380)"
          />
          <ellipse
            cx="1040"
            cy="520"
            rx="180"
            ry="56"
            fill="#1b2c1c"
            transform="rotate(12 1040 520)"
          />
          <ellipse
            cx="430"
            cy="560"
            rx="140"
            ry="48"
            fill="#1b2c1c"
            transform="rotate(-8 430 560)"
          />
        </g>

        {/* restrained survey grid */}
        <g stroke="#f5f2e9" strokeWidth="0.5" opacity="0.10">
          {Array.from({ length: 7 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={180 + i * 180}
              y1="0"
              x2={180 + i * 180}
              y2="900"
            />
          ))}
          {Array.from({ length: 4 }, (_, i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={180 + i * 180}
              x2="1440"
              y2={180 + i * 180}
            />
          ))}
        </g>

        {/* coordinate markings */}
        <g
          fill="#f5f2e9"
          opacity="0.28"
          fontSize="11"
          fontFamily="ui-monospace, monospace"
          letterSpacing="2"
        >
          <text x="1230" y="868">
            19.1197° N
          </text>
          <text x="1230" y="886">
            72.8464° E
          </text>
          <text x="64" y="868">
            SENTINEL-2 · NDVI
          </text>
        </g>
        <g stroke="#f5f2e9" opacity="0.25" strokeWidth="1">
          <line x1="1200" y1="862" x2="1200" y2="884" />
        </g>
      </svg>

      {/* darken for type legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/72 via-forest-deep/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/60 via-transparent to-transparent" />
    </div>
  );
}
