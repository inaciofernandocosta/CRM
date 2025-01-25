import React from 'react';
import clsx from 'clsx';

export function Button({ className, children, variant = 'primary', ...props }) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm',
        {
          'bg-primary text-white hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary': variant === 'primary',
          'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50': variant === 'secondary',
          'text-gray-900 hover:text-gray-700': variant === 'link',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}