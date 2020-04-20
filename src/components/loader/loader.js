import React from 'react';

import './loader.css';

export default function Loader(props) {
  return (
    <div className="loader-container">
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
