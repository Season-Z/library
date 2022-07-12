import { throttle } from 'lodash';
import { useEffect } from 'react';

interface UseScrollLoadProps {
  wrapper: HTMLDivElement | null;
  callback: (arg2: () => void) => void | Promise<void>;
}

/**
 * 滑动加载
 */
export default function useScrollLoad(
  props: UseScrollLoadProps,
  deps: boolean[],
) {
  const { wrapper, callback } = props;

  useEffect(() => {
    if (!deps.every(Boolean) || !wrapper) {
      return;
    }

    const tableBody = wrapper.getElementsByClassName('ant-table-body')[0];

    const tableBodyDivScroll = throttle((ev: any) => {
      const bodyDivRect = ev.target.getBoundingClientRect();
      const tableRect = ev.target
        .querySelector('.virtuallist')
        .getBoundingClientRect();
      const scrollBarHeight = 7; // global.less 中设置的滚动条厚度 7px
      const THRESHOLD = 20; // 触发阈值 (row高度)

      const bottom =
        tableRect.bottom + scrollBarHeight - bodyDivRect.bottom < THRESHOLD;

      // 记录本次滚动的高度
      const scrollHeight = tableBody.scrollHeight;
      if (bottom) {
        callback(() => {
          tableBody?.scrollTo(0, scrollHeight);
        });
      }
    }, 900);

    tableBody?.addEventListener('scroll', tableBodyDivScroll);

    return () => {
      tableBody?.removeEventListener('scroll', tableBodyDivScroll);
    };
  }, [callback, deps, wrapper]);
}
