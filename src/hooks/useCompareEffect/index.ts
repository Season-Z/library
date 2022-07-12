/**
 * useEffect的依赖是否相同，相同不触发
 */
import { DependencyList, useEffect, useRef } from 'react';
import { isEqual } from 'lodash';

export default function useCompareEffect(
  effect: React.EffectCallback,
  dependencies?: DependencyList,
) {
  function deepCompareDependencies(value?: DependencyList) {
    const ref = useRef<DependencyList>();

    if (!isEqual(value, ref.current)) {
      ref.current = value;
    }

    return ref.current;
  }

  useEffect(effect, deepCompareDependencies(dependencies));
}
