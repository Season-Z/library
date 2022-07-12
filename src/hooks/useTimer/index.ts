/**
 * 倒计时
 */
import { useCallback, useRef, useState } from 'react';

/**
 * 使用requestAnimationFrame执行倒计时
 * @param time 执行回调的时间间隔
 * @param func 回调函数
 * @returns void
 */
function useTimer<G, T extends () => any>(func: T, time: number = 1000) {
  const frameId = useRef<number>();
  const timeTag = useRef(performance.now());
  const funcRef = useRef(func);

  const [result, setResult] = useState<G>();

  funcRef.current = func;

  const countdown = useCallback(async () => {
    const currentTime = performance.now();
    if (currentTime - timeTag.current >= time) {
      timeTag.current = currentTime;

      const res = await funcRef.current();
      setResult(res);
    }
    frameId.current = window.requestAnimationFrame(countdown);
  }, [time]);

  /**
   * 开启倒计时
   */
  const start = useCallback(() => {
    frameId.current = window.requestAnimationFrame(countdown);
  }, [countdown]);

  const stop = useCallback(() => {
    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
    }
  }, []);

  return {
    start,
    stop,
    result,
    setResult,
  };
}

export default useTimer;
