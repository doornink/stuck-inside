import React, { useEffect, useState } from 'react';

import './timer-wrapper.css';

export default function TimerWrapper(props) {
  const { timeLeft, timerLength, timerPaused } = props;

  const [stageOnePercentage, setStageOnePercentage] = useState();
  const [stageTwoPercentage, setStageTwoPercentage] = useState();
  const [stageThreePercentage, setStageThreePercentage] = useState();
  const [stageFourPercentage, setStageFourPercentage] = useState();

  useEffect(() => {
    setStageOnePercentage(0.5 + Math.random() * 0.2); // 50-70%
    setStageTwoPercentage(0.3 + Math.random() * 0.15); // 30-45%
    setStageThreePercentage(0.15 + Math.random() * 0.1); // 15-25%
    setStageFourPercentage(0.05 + Math.random() * 0.05); // 5-10%
  }, [timerLength]);

  let stageClass = '';
  if (timeLeft < 1 || timerPaused) {
    stageClass = '';
  } else if (timeLeft < timerLength * stageFourPercentage) {
    stageClass = 'stage-4';
  } else if (timeLeft < timerLength * stageThreePercentage) {
    stageClass = 'stage-3';
  } else if (timeLeft < timerLength * stageTwoPercentage) {
    stageClass = 'stage-2';
  } else if (timeLeft < timerLength * stageOnePercentage) {
    stageClass = 'stage-1';
  }

  return <div className={`timer-wrapper ${stageClass}`}>{props.children}</div>;
}
