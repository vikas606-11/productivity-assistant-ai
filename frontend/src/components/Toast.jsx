import React, { createContext, useContext, useState, useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm w-full sm:w-auto">
          <div className={`flex items-center gap-3.5 px-5 py-4 rounded-2xl border shadow-2xl backdrop-blur-lg transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/20'
              : 'bg-rose-950/80 text-rose-200 border-rose-500/20'
          }`}>
            {toast.type === 'success' ? (
              <FiCheckCircle className="h-5 w-5 text-emerald-400 shrink-0 animate-pulse" />
            ) : (
              <FiAlertCircle className="h-5 w-5 text-rose-400 shrink-0 animate-pulse" />
            )}
            <p className="text-sm font-semibold tracking-wide flex-1 leading-normal">{toast.message}</p>
            <button
              onClick={hideToast}
              className="text-gray-400 hover:text-gray-200 p-0.5 rounded-lg hover:bg-white/5 transition-all shrink-0 ml-1"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
