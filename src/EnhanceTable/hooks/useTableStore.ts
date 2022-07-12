import useIndexDB from '../../hooks/useIndexDB';

function useTableStore() {
  const tableParamsStoreKey = `Params-${window.location.href}`;

  // 创建本地数据库
  const dbStore = useIndexDB(`EnhanceTable-${window.location.href}`);

  dbStore.createTable([
    {
      name: tableParamsStoreKey,
      key: 'tableParamsStoreKey',
      cursorIndex: [{ name: 'tableParamsStoreKey', unique: true }],
    },
  ]);

  return { dbStore, tableParamsStoreKey };
}

export default useTableStore;
