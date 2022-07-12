import React, { useCallback, useEffect, useState } from 'react';
import { ResizeCallbackData } from 'react-resizable';
import { EnhanceTableColumnsProps } from '../interface';

function useResizeColumns<T>(
  propsColumns: EnhanceTableColumnsProps<T>[],
  useVirtual?: boolean,
): EnhanceTableColumnsProps<T>[] {
  const [columns, setColumns] = useState(propsColumns);

  const handleResize = useCallback(
    (index: number) => (
      e: React.SyntheticEvent<Element, Event>,
      { size }: ResizeCallbackData,
    ) => {
      setColumns(columns => {
        const nextColumns = [...columns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        };
        return nextColumns;
      });
    },
    [],
  );

  useEffect(() => {
    const { columns: tableCols } = propsColumns.filter(Boolean).reduce(
      (
        pre: { columns: any[]; editIndex: number },
        next: EnhanceTableColumnsProps<T>,
        key: number,
      ) => {
        // 隐藏该列
        if (next.hide) {
          return pre;
        }
        // 如果当前column表头文案不是操作以及没有 type 值，表示当前单元格展示的是文案而不是表单组件
        // if (!next.type && !next.render) {
        //   return {
        //     ...pre,
        //     columns: [...pre.columns, { ...next, ellipsis: !!useVirtual }],
        //   };
        // }
        const index = next.type ? pre.editIndex + 1 : pre.editIndex;
        return {
          columns: [
            ...pre.columns,
            {
              ...next,
              ellipsis: !!useVirtual,
              onCell: (record: T, rowIndex: number) => {
                return {
                  ...next,
                  rowIndex,
                  record,
                  colIndex: index === 0 ? undefined : index, // 可编辑的单元格的序号
                };
              },
              onHeaderCell: (column: any) => ({
                width: column.width,
                onResize: handleResize(key),
              }),
            },
          ],
          editIndex: index,
        };
      },
      { columns: [], editIndex: 0 },
    );

    setColumns(tableCols);
  }, [handleResize, propsColumns, useVirtual]);

  return columns;
}

export default useResizeColumns;
