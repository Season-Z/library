import { useRef } from 'react';

export interface CreateStoreProps {
  name: string;
  key: string;
  cursorIndex: { name: string; unique?: boolean; multiEntry?: boolean }[];
}

export interface UpdateProps {
  table: string;
  cursorKey: string;
  cursorValue: any;
  data: any;
}

function promisify(request: any, type?: string) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    request.onsuccess = (event: any) => {
      const returnMap: any = {
        event: event.target.result,
        request: request.result,
        msg: '操作成功',
      };
      resolve(returnMap[type || 'msg']);
    };
    request.onerror = (event: any) => reject(event.target.error || '操作失败');
  });
}

function useIndexDB<T>(name: string, version?: number) {
  // 数据库的名称
  const storeName = useRef(name);
  // 数据的版本
  const storeVersion = useRef(version || 1);

  // 打开数据库
  const openStore = () => {
    const request = window.indexedDB.open(
      storeName.current,
      storeVersion.current,
    );

    return promisify(request, 'event');
  };

  // 注册初始化创建数据库对象
  const createTable = (store: CreateStoreProps[]) => {
    const request = window.indexedDB.open(
      storeName.current,
      storeVersion.current,
    );

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      for (let t = 0; t < store.length; t++) {
        if (db.objectStoreNames.contains(store[t].name)) {
          continue;
        }

        const objectStore = db.createObjectStore(store[t].name, {
          keyPath: store[t].key,
        });
        for (let i = 0; i < store[t].cursorIndex.length; i++) {
          const element = store[t].cursorIndex[i];
          objectStore.createIndex(element.name, element.name, {
            unique: element.unique || false,
            multiEntry: element.multiEntry || false,
          });
        }
      }
    };
    request.onerror = () => Promise.reject('初始化数据库失败');
    request.onsuccess = () => Promise.resolve('初始化数据库成功');
  };

  const getObjectStore = async (
    table: string,
    type?: IDBTransactionMode,
  ): Promise<IDBObjectStore> => {
    try {
      const db = await openStore();
      const existTable = db.objectStoreNames.contains(table);
      if (!existTable) {
        throw new Error('不存在该表');
      }

      return db.transaction(table, type).objectStore(table);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 插入数据
  const insertData = async (table: string, data: T | T[]) => {
    try {
      const db = await openStore();
      const transaction = db.transaction(table, 'readwrite');
      const objectStore = transaction.objectStore(table);

      // 如果添加的数据不是数组
      if (!Array.isArray(data)) {
        const request = objectStore.add(data);
        return promisify(request);
      }

      data.forEach(function(item: T) {
        objectStore.put(item);
      });

      return new Promise((resolve, reject) => {
        transaction.oncomplete = function() {
          resolve('所有数据插入成功');
        };

        transaction.onerror = function(event) {
          reject(event);
        };
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * 获取数据库的值，返回查询到的第一项
   */
  const getData = async (
    table: string,
    cursorKey: string,
    cursorValue?: any,
  ) => {
    try {
      const objectStore = await getObjectStore(table);

      const request = cursorValue
        ? objectStore.index(cursorKey).get(cursorValue)
        : objectStore.get(cursorKey);
      return promisify(request, 'request');
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 获取当前表下所有数据
  const getAllData = async (table: string): Promise<T | any> => {
    try {
      const objectStore = await getObjectStore(table);
      const request = objectStore.getAll();
      const result = await promisify(request, 'request');
      return result ? result : [];
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 清空数据库
  const clearDB = async (table: string) => {
    try {
      const objectStore = await getObjectStore(table, 'readwrite');

      const request = objectStore.clear();
      return promisify(request);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 创建游标索引
  const createCursorIndex = async (
    table: string,
    cursorIndex: string,
    unique: boolean,
  ) => {
    const objectStore = await getObjectStore(table, 'readwrite');
    objectStore.createIndex(cursorIndex, cursorIndex, {
      unique: unique,
    });
    return Promise.resolve();
  };

  // 更新数据
  const updateData = async (props: UpdateProps) => {
    try {
      const { table, data, cursorKey, cursorValue } = props;
      const oldData = await getData(table, cursorKey, cursorValue);
      const objectStore = await getObjectStore(table, 'readwrite');

      if (!oldData) {
        // throw Error('更新数据失败，无法找到该数据' + cursorValue);
        return insertData(table, data);
      }

      const newData = { ...oldData, ...data };
      // 把更新过的对象放回数据库
      const requestUpdate = objectStore.put(newData);
      return promisify(requestUpdate);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * 通过游标来获取表的数据,性能较好
   * @param keyRange 查询的范围；IDBKeyRange对象，内容传 表主键的值
   */
  const getDataByCursor = async (
    table: string,
    keyRange?: IDBKeyRange,
    direction?: IDBCursorDirection,
  ) => {
    try {
      const objectStore = await getObjectStore(table);
      const cursorRequest = objectStore.openCursor(keyRange, direction);

      return new Promise((resolve, reject) => {
        let results: any[] = [];

        cursorRequest.onerror = reject;
        cursorRequest.onsuccess = (e: any) => {
          const cursor = e.target.result;

          if (cursor) {
            // cursor.key 是一个 name, 就像 "Bill", 然后 cursor.value 是整个对象
            results.push(cursor.source);
            cursor.continue();
          } else {
            // 遍历之后的 object 数据列表的结果
            resolve(results);
          }
        };
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getSSNByCursor = async (
    table: string,
    keyRange?: string | undefined,
  ) => {
    try {
      const objectStore = await getObjectStore(table);
      const cursorRequest = objectStore.openKeyCursor(keyRange);

      return new Promise((resolve, reject) => {
        let results: any[] = [];

        cursorRequest.onerror = reject;
        cursorRequest.onsuccess = (e: any) => {
          const cursor = e.target.result;
          if (cursor) {
            results.push(cursor.source);
            cursor.continue();
          } else {
            // 遍历之后的 object 数据列表的结果
            resolve(results);
          }
        };
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const deleteData = async (table: string, keyValue: any) => {
    try {
      const objectStore = await getObjectStore(table, 'readwrite');
      const request = objectStore.delete(keyValue);

      return promisify(request);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    createTable,
    insertData,
    getAllData,
    getData,
    clearDB,
    updateData,
    getDataByCursor,
    getSSNByCursor,
    deleteData,
    createCursorIndex,
  };
}

export default useIndexDB;
