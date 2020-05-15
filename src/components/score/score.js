import React, { useEffect, useState } from 'react';

import './score.css';

export default function Score({ score, color }) {
  const [animatingScore, setAnimatingScore] = useState(false);
  const [prevScore, setPrevScore] = useState(score);

  useEffect(() => {
    if (prevScore < score) {
      setAnimatingScore(true);

      setTimeout(() => {
        setAnimatingScore(false);
      }, 1000);
    }

    setPrevScore(score);
  }, [prevScore, score]);

  return (
    <div
      className={`team-score ${animatingScore ? 'animating' : ''} ${
        color ? `-${color}` : ''
      }`}
    >
      <div className="main-score">{score}</div>
      {animatingScore && (
        <React.Fragment>
          <div className="old-score">{score - 1}</div>
          {/* <div className="exploding-score">{score}</div> */}
        </React.Fragment>
      )}
    </div>
  );
}
