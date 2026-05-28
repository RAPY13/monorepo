import * as React from 'react';

export const Button = ({ children, ...props }) => (
  <button className='px-4 py-2 bg-yellow-400 text-black rounded' {...props}>
    {children}
  </button>
);
