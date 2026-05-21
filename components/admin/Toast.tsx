'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

/* ── Types ──────────────────────────────────────────── */
type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

/* ── Context ────────────────────────────────────────── */
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

/* ── Provider ───────────────────────────────────────── */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    // Remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, type }]);

      const timer = setTimeout(() => {
        removeToast(id);
        timersRef.current.delete(id);
      }, 3000);

      timersRef.current.set(id, timer);
    },
    [removeToast]
  );

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => {
              const timer = timersRef.current.get(toast.id);
              if (timer) {
                clearTimeout(timer);
                timersRef.current.delete(toast.id);
              }
              removeToast(toast.id);
            }}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ── Single Toast ───────────────────────────────────── */
const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-[#4ade80] shrink-0" />,
  error: <XCircle className="w-5 h-5 text-[#ef4444] shrink-0" />,
  info: <Info className="w-5 h-5 text-[#60a5fa] shrink-0" />,
};

const bgMap: Record<ToastType, string> = {
  success: 'border-[#4ade80]/30',
  error: 'border-[#ef4444]/30',
  info: 'border-[#60a5fa]/30',
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border bg-[#1a1a1a] shadow-xl max-w-sm ${
        bgMap[toast.type]
      } ${toast.exiting ? 'toast-exit' : 'toast-enter'}`}
    >
      {iconMap[toast.type]}
      <span className="text-sm text-[#f5f5f5] flex-1">{toast.message}</span>
      <button
        onClick={onDismiss}
        className="text-[#666] hover:text-[#f5f5f5] transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
