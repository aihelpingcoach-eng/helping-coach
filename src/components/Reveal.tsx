import { ReactNode, useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

// Anima la entrada de una sección la primera vez que aparece en pantalla
// al hacer scroll. Se queda visible una vez animada (no vuelve a ocultarse).
export default function Reveal({ children, className = '', delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={visible ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
