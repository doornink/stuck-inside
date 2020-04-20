import React from 'react';

import './loader.css';

export default function Loader(props) {
  return (
    <div className="loader-container">
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
