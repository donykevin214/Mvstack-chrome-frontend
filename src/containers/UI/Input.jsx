import React from 'react';
import { forwardRef } from 'react';

export const Input = forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`text-base rounded-3xl px-5 bg-black/30 py-4 text-white ${className}`}
      {...props}
    />
  );
});
