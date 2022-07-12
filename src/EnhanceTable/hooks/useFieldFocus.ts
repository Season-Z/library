/**
 * 输入框光标移动
 */
/* eslint-disable no-unused-expressions */
import { useCallback, useEffect } from 'react';

interface UseFieldFocusProps<T> {
  dataSource: T[];
  tableTag: string;
  wrapper: HTMLDivElement | null;
}

function useFieldFocus<T>(props: UseFieldFocusProps<T>, deps: boolean[]) {
  const { dataSource, tableTag, wrapper } = props;

  const changePointer = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();

      if (!['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'].includes(e.code))
        return;
      const ele: EventTarget | (null & any) = e.target;

      const cls = (Array.from(ele.classList) as string[]).find(
        (v: string) => v.includes('INPUT') && v.includes(tableTag),
      );
      // 当前节点不是input输入框
      if (ele.tagName !== 'INPUT' || !cls) {
        return;
      }

      /**
       * fieldType：组件类型
       * colIndex：可编辑的列序号
       * rowIndex：行序号
       */
      const [, fieldType, rowIndex, colIndex] = cls.split('-');

      const currentRowKey = Number(rowIndex);
      const currentColKey = Number(colIndex);

      let nextRowIndex: number = currentRowKey;
      let nextColIndex: number = currentColKey;

      if (e.code === 'ArrowUp') {
        if (currentRowKey === 0) {
          return;
        }
        nextRowIndex = currentRowKey - 1;
      } else if (e.code === 'ArrowDown') {
        const maxKey = dataSource.length - 1;

        nextRowIndex = currentRowKey + 1;
        if (maxKey < nextRowIndex) {
          return;
        }
      } else if (e.code === 'ArrowRight') {
        nextColIndex = currentColKey + 1;
      } else {
        if (nextColIndex === 1) {
          return;
        }
        nextColIndex = currentColKey - 1;
      }

      // 未处于编辑状态的
      const newCls = `${tableTag}-${fieldType}-${nextRowIndex}-${nextColIndex}`;
      const newElement = document.querySelector(`input.${newCls}`);

      if (newElement) {
        (newElement as HTMLInputElement).focus();
      }
    },
    [dataSource?.length, tableTag],
  );

  useEffect(() => {
    if (!wrapper || !dataSource?.length || deps.some(v => !v)) return;

    wrapper?.addEventListener('keyup', changePointer);
    return () => {
      wrapper?.removeEventListener('keyup', changePointer);
    };
  }, [changePointer, dataSource, deps, wrapper]);
}

export default useFieldFocus;
