import React, { useEffect, useState } from 'react';

import './timer-wrapper.css';

export default function TimerWrapper(props) {
  const { timeLeft, timerLength } = props;

  const [stageOnePercentage, setStageOnePercentage] = useState();
  const [stageTwoPercentage, setStageTwoPercentage] = useState();
  const [stageThreePercentage, setStageThreePercentage] = useState();

  useEffect(() => {
    setStageOnePercentage(0.5 + Math.random() * 0.2); // 50-70%
    setStageTwoPercentage(0.2 + Math.random() * 0.2); // 20-40%
    setStageThreePercentage(0.05 + Math.random() * 0.1); // 5-15%
  }, [timerLength]);

  let stageClass = '';
  if (timeLeft < 1) {
    stageClass = '';
  } else if (timeLeft < timerLength * stageThreePercentage) {
    stageClass = 'stage-3';
  } else if (timeLeft < timerLength * stageTwoPercentage) {
    stageClass = 'stage-2';
  } else if (timeLeft < timerLength * stageOnePercentage) {
    stageClass = 'stage-1';
  }

  return <div className={`timer-wrapper ${stageClass}`}>{props.children}</div>;
}
