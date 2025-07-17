import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name: string; // Para react-hook-form
}

const SearchableDropdown = ({ options, value, onChange, placeholder}: SearchableDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Synchronize internal searchTerm with external value prop
  // This useEffect should only run when the 'value' prop changes,
  // ensuring the input field displays the label of the currently selected item.
  useEffect(() => {
    const selectedOption = options.find(option => option.value === value);
    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    } else {
      // If value is null/undefined or doesn't match any option, clear searchTerm
      setSearchTerm('');
    }
  }, [value, options]); // Depend on 'value' and 'options'

  const filteredOptions = useMemo(() => {
    if (!searchTerm) {
      return options;
    }
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    // When user types, do not immediately call onChange.
    // The actual form value will be updated only when an option is clicked.
  };

  const handleOptionClick = (option: Option) => {
    onChange(option.value); // Update the actual form value
    setSearchTerm(option.label); // Update the displayed text
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    // When focusing, if there's a selected value, set searchTerm to its label
    // to allow immediate re-filtering.
    const selectedOption = options.find(opt => opt.value === value);
    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    }
  };

  const handleInputBlur = () => {
    // Use a timeout to allow click event on options to fire before blur
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        // After blurring, if the current searchTerm doesn't match the selected value's label,
        // revert searchTerm to the selected value's label or clear it if no value.
        const selectedOption = options.find(opt => opt.value === value);
        if (selectedOption) {
          setSearchTerm(selectedOption.label);
        } else {
          setSearchTerm('');
        }
      }
    }, 100);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm} // Controlled by internal state
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 pr-10"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <div
                key={option.value}
                className="p-2 cursor-pointer hover:bg-orange-100 text-gray-700"
                onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">Nenhuma opção encontrada.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;