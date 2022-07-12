/**
 * 深比较依赖
 */
import { isEqual } from 'lodash';
import { DependencyList, useMemo, useRef } from 'react';

function useCompareMemo<T>(callback: () => T, deps?: DependencyList) {
  const ref = useRef<DependencyList>();

  function deepCompareDeps(value?: DependencyList) {
    if (!isEqual(value, ref.current)) {
      ref.current = value;
    }

    return ref.current;
  }

  return useMemo(callback, deepCompareDeps(deps));
}

export default useCompareMemo;
