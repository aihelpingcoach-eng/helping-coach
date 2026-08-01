import { ReactNode } from 'react';
import logoImg from '../../assets/logo_new.png';

interface LegalLayoutProps {
  title: string;
  updatedAt: string;
  children: ReactNode;
}

export default function LegalLayout({ title, updatedAt, children }: LegalLayoutProps) {
  return (
    <div
      className="h-screen overflow-y-auto bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-gray-200"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <div className="flex items-center gap-3 mb-8">
          <img src={logoImg} alt="Helping Coach" className="w-10 h-10 object-contain" />
          <span className="text-white font-bold text-lg">Helping Coach</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-8">Última actualización: {updatedAt}</p>

        <div className="space-y-6 text-sm sm:text-base leading-relaxed [&_h2]:text-white [&_h2]:font-bold [&_h2]:text-lg [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-purple-400 [&_a]:underline">
          {children}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10">
          <a href="/" className="text-purple-400 hover:text-purple-300 text-sm">
            ← Volver a Helping Coach
          </a>
        </div>
      </div>
    </div>
  );
}
