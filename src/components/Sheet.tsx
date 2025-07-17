import React from 'react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Sheet = ({ open, onClose, children }: SheetProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        open ? 'visible' : 'invisible'
      }`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/80 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      {/* Content */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white p-4 shadow-lg transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Sheet;