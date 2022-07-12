import { Button } from 'antd';
import React, { useCallback, useState } from 'react';
import useTimer from '..';

function Base() {
  const [time, setTime] = useState(0);

  const fn = useCallback(() => {
    setTime(v => v + 1);
  }, []);

  const timer = useTimer(fn);

  const handleStart = useCallback(() => {
    timer.start();
  }, [timer.start]);

  const handleEnd = useCallback(() => {
    timer.stop();
  }, [timer.stop]);

  return (
    <div>
      <Button type="primary" onClick={handleStart}>
        开始
      </Button>
      <Button
        danger
        onClick={handleEnd}
        style={{ marginLeft: '10px', marginBottom: '16px' }}
      >
        结束
      </Button>
      <div>{time}</div>
    </div>
  );
}

export default Base;
