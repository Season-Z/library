import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Tree } from 'antd';
import { EnhanceTableColumnsProps } from '../interface';
import { EnhanceContentContext } from './EnhanceTable';

interface TreeDataProps {
  key: string;
  title: string;
  hide?: boolean;
  children: TreeDataProps[];
}

function ColumnsSettings<T>() {
  const { columns, changeColumnsCallback } = useContext(EnhanceContentContext);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [treeData, setTreeData] = useState<TreeDataProps[]>([]);

  const onDrop = useCallback(
    ({ node, dragNode }) => {
      if (!columns) {
        return;
      }
      const { first, second } = columns.reduce(
        (
          pre: { first: number; second: number },
          next: EnhanceTableColumnsProps<T>,
          index: number,
        ) => {
          if (next.dataIndex === node.key) {
            return {
              ...pre,
              first: index,
            };
          } else if (next.dataIndex === dragNode.key) {
            return {
              ...pre,
              second: index,
            };
          } else {
            return pre;
          }
        },
        { first: 0, second: 0 },
      );

      // 交换位置
      const firstItem = columns[first];
      columns[first] = columns[second];
      columns[second] = firstItem;

      const newStoreList = columns.map((v: EnhanceTableColumnsProps<T>) => v);

      // 回调，设置列
      if (changeColumnsCallback) {
        changeColumnsCallback(newStoreList);
      }
    },
    [changeColumnsCallback, columns],
  );

  const handleStoreKeys = useCallback(
    (keys, e) => {
      if (!columns) {
        return;
      }
      const { checked, key } = e.node;

      const newStoreList = columns?.map(
        (v: EnhanceTableColumnsProps<T>, k) => ({
          ...v,
          hide: v.dataIndex === key ? checked : v.hide,
        }),
      );

      setCheckedKeys(v => (checked ? v.filter(i => i !== key) : v.concat(key)));

      // 回调，设置列
      if (changeColumnsCallback) {
        changeColumnsCallback(newStoreList);
      }
    },
    [changeColumnsCallback, columns],
  );

  // 根据传入的columns生成列和选中项
  useEffect(() => {
    const { data, checkedList } = columns?.reduce(
      (
        pre: { data: TreeDataProps[]; checkedList: string[] },
        next: EnhanceTableColumnsProps<T>,
      ) => {
        return {
          data: pre.data.concat({
            key: next.dataIndex,
            title: next.title,
            hide: next.hide,
            children: [],
          }),
          checkedList: !next.hide
            ? pre.checkedList.concat(next.dataIndex)
            : pre.checkedList,
        };
      },
      { data: [], checkedList: [] },
    ) || { data: [], checkedList: [] };

    setTreeData(data);
    setCheckedKeys(checkedList);
  }, [columns]);

  return (
    <Tree
      className="draggable-tree"
      checkable
      draggable
      blockNode
      checkedKeys={checkedKeys}
      selectedKeys={[]}
      onCheck={handleStoreKeys}
      onDrop={onDrop}
      treeData={treeData}
      onSelect={handleStoreKeys}
    />
  );
}

export default ColumnsSettings;
