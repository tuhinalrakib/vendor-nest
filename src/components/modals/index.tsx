import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-300" 
      />

      {/* Modal Box */}
      <div 
        className={`relative w-full ${sizes[size]} rounded-2xl bg-white border border-zinc-200/80 shadow-2xl overflow-hidden z-10 animate-modal-scale text-left`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
          {title ? (
            <h3 className="text-base font-bold text-zinc-900">{title}</h3>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 flex items-center justify-center transition-colors active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer (optional) */}
        {footer && (
          <div className="px-6 py-4.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>

      {/* Embedded Animation Styles */}
      <style>{`
        @keyframes modalScale {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-modal-scale {
          animation: modalScale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
