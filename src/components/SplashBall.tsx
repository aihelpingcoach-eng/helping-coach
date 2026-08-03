interface SplashBallProps {
  className?: string;
}

export default function SplashBall({ className = '' }: SplashBallProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full bg-purple-500/40 blur-xl" aria-hidden="true" />
      <svg viewBox="0 0 100 100" className="relative w-full h-full" role="img" aria-label="Balón de fútbol">
        <defs>
          <radialGradient id="splashBallGradient" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="100%" stopColor="#7C3AED" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#splashBallGradient)" stroke="#4C1D95" strokeWidth="1.5" />
        <path d="M50,34 L65.2,45.1 L59.4,62.9 L40.6,62.9 L34.8,45.1 Z" fill="#4C1D95" />
        <g stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round">
          <line x1="50" y1="34" x2="50" y2="6" />
          <line x1="65.2" y1="45.1" x2="91.8" y2="36.4" />
          <line x1="59.4" y1="62.9" x2="75.9" y2="85.6" />
          <line x1="40.6" y1="62.9" x2="24.1" y2="85.6" />
          <line x1="34.8" y1="45.1" x2="8.2" y2="36.4" />
        </g>
      </svg>
    </div>
  );
}
