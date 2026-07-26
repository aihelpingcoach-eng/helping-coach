import { ReactNode } from 'react';

export default function LegalReview({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block bg-yellow-500/20 text-yellow-300 text-[11px] font-semibold px-2 py-0.5 rounded ml-2 align-middle">
      ⚠️ {children}
    </span>
  );
}
