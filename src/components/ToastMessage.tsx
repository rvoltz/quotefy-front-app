import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const ToastMessage: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); 

    return () => clearTimeout(timer);
  }, [onClose]);

  const baseClasses = "fixed top-5 right-5 z-50 p-4 rounded-lg shadow-2xl flex items-center space-x-3 transition-transform duration-300 ease-out transform";
  
  const typeClasses = type === 'success'
    ? "bg-green-100 border border-green-400 text-green-700 translate-x-0"
    : "bg-red-100 border border-red-400 text-red-700 translate-x-0";

  const IconComponent = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      <IconComponent className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
      <p className="font-medium">{message}</p>
      <button 
        onClick={onClose}
        className="ml-4 -mr-1 p-1 rounded-full text-current hover:bg-opacity-50 transition-colors"
        aria-label="Fechar notificação"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default ToastMessage;