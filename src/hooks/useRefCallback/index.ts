/**
 * 当 useCallback 和 useEffect 组合使用时，由于 useCallback 的依赖项变化也会导致 useEffect 执行，这种隐式依赖会带来 BUG 或隐患。
 * 一旦某个函数使用了 useCallback ，当这个函数的依赖项变化时所有直接或间接调用这个 useCallback 的都需要回归。
 * 所以这是成本高、有风险的事情。
 */
import { useCallback, useRef } from 'react';

function useRefCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: any[],
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    (...args: any[]) => callbackRef.current(...args),
    deps,
  ) as T;
}

export default useRefCallback;
