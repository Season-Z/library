import { useEffect, useState } from 'react';

function useTableYSize(scrollYSize?: number) {
  // table内容高度
  const [scrollY, setScrollY] = useState(500);
  // 高度
  useEffect(() => {
    if (scrollYSize) {
      setScrollY(scrollYSize);
    } else {
      requestAnimationFrame(() => {
        const ele = document.getElementById('tablePart');
        if (ele) {
          const top = ele.getBoundingClientRect().top;
          const clientHeight = document.body.clientHeight;
          const TOP_DIST = 60; // 上边距
          const BOTTOM_DIST = 100; // 下边距
          const scrollY = clientHeight - top - TOP_DIST - BOTTOM_DIST;

          setScrollY(scrollY);
        }
      });
    }
  }, [scrollYSize]);

  return scrollY;
}

export default useTableYSize;
