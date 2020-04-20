import React from 'react';

import './button.css';

export default function Button(props) {
  return (
    <button {...props} className="button">
      {props.children}
    </button>
  );
}
