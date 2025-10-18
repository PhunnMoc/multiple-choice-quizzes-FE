import React from 'react';

const Input = ({ 
  label,
  error,
  helperText,
  className = '',
  ...props 
}) => {
  const inputClasses = `
    w-full px-4 py-2 border rounded-lg transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent
    ${error 
      ? 'border-red-500 bg-red-50' 
      : 'border-[var(--border-color)] bg-white hover:border-[var(--primary-color)]'
    }
    ${className}
  `;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{helperText}</p>
      )}
    </div>
  );
};

const Textarea = ({ 
  label,
  error,
  helperText,
  className = '',
  rows = 4,
  ...props 
}) => {
  const textareaClasses = `
    w-full px-4 py-2 border rounded-lg transition-colors duration-200 resize-vertical
    focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent
    ${error 
      ? 'border-red-500 bg-red-50' 
      : 'border-[var(--border-color)] bg-white hover:border-[var(--primary-color)]'
    }
    ${className}
  `;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          {label}
        </label>
      )}
      <textarea
        className={textareaClasses}
        rows={rows}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{helperText}</p>
      )}
    </div>
  );
};

const Select = ({ 
  label,
  error,
  helperText,
  options = [],
  className = '',
  ...props 
}) => {
  const selectClasses = `
    w-full px-4 py-2 border rounded-lg transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent
    ${error 
      ? 'border-red-500 bg-red-50' 
      : 'border-[var(--border-color)] bg-white hover:border-[var(--primary-color)]'
    }
    ${className}
  `;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          {label}
        </label>
      )}
      <select
        className={selectClasses}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{helperText}</p>
      )}
    </div>
  );
};

Input.Textarea = Textarea;
Input.Select = Select;

export default Input;
