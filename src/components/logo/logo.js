import React from 'react';

import './logo.css';

export default function Logo({ title }) {
  return <div className="logo">{title || 'VideoChat Games!'}</div>;
}
