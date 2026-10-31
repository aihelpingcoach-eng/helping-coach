import { ReactNode, useEffect } from 'react';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  /** 'center' para diálogos normales, 'bottom' para hojas tipo bottom-sheet */
  align?: 'center' | 'bottom';
  /** Clase completa del fondo (color + blur). Por defecto bg-black/70 backdrop-blur-sm */
  backdropClassName?: string;
  /** Clase de la tarjeta de contenido (fondo, borde, ancho máximo, etc.) */
  contentClassName: string;
  'aria-label'?: string;
}

// Diálogo accesible compartido: cierra con click en el fondo y con la tecla
// Escape (antes cada modal solo tenía el click en el fondo, sin equivalente
// de teclado), y bloquea el scroll del body mientras está abierto.
export default function Modal({
  onClose,
  children,
  align = 'center',
  backdropClassName = 'bg-black/70 backdrop-blur-sm',
  contentClassName,
  'aria-label': ariaLabel,
}: ModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex ${align === 'bottom' ? 'items-end' : 'items-center'} justify-center ${
        align === 'center' ? 'p-4' : ''
      } ${backdropClassName}`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(e) => e.stopPropagation()}
        className={contentClassName}
      >
        {children}
      </div>
    </div>
  );
}
