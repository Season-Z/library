/**
 * 终极奥义·通用列表
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Space } from 'antd';
import { uniqueId } from 'lodash';
import ErrorBoundary from './ErrorBoundary';
import ToolBar from './ToolBar';
import TableRender from './TableRender';
import useVirtualTable from '../hooks/useVirtualTable';
import { EnhanceTableColumnsProps, EnhanceTableProps } from '../interface';
import useResizeColumns from '../hooks/useResizeColumns';
import useFieldFocus from '../hooks/useFieldFocus';
import useScrollLoad from '../hooks/useScrollLoad';
import useTableYSize from '../hooks/useTableYSize';
import useTableStore from '../hooks/useTableStore';
import '../index.less';

interface TableParamsProps {
  total: number;
  current: number;
  pageSize: number;
  isEnd: boolean;
}

export const EnhanceContentContext = React.createContext<{
  handleDeleteRow?: (arg: any) => void;
  handleSaveRow?: (arg1: any, arg2: any) => void;
  columns?: EnhanceTableColumnsProps<any>[];
  tableTag?: string;
  changeColumnsCallback?: (arg: any[]) => void;
}>({});

export function getEditableTableKey(name?: string) {
  return uniqueId(`${name || 'commonT'}_`);
}

function EnhanceTable<T extends Record<string, any>>(
  props: EnhanceTableProps<T>,
) {
  const {
    mode = 'normal',
    columns: propsColumns,
    cacheTable = false, // 默认不缓存
    pageSize: propsPageSize,
    requestUrl,
    useVirtual,
    useTool = true,
    tableRef: propsTableRef,
    tableHeaderBar,
    saveRowCallback,
    dataSourceChangeCallback,
    ...rest
  } = props;

  const tableStoreKey = `${window.location.href}-EnhanceTable`;
  const tableColsStoreKey = `${window.location.href}-Columns`;

  const isScrolled = mode === 'scroll';
  // 纯外部控制表格数据
  const isData = mode === 'data';
  // 新增模式
  const isCreateed = mode === 'create';

  // table的值
  const [dataSource, setDataSource] = useState<T[]>(props.dataSource || []);
  // 表格展示的列
  const [tableColumns, setTableColumns] = useState<
    EnhanceTableColumnsProps<T>[]
  >(propsColumns);
  // table唯一标识
  const tableTag = useRef<string>(getEditableTableKey('tableTag'));
  // 请求参数
  const searchParamsRef = useRef<Record<string, any>>();
  // 列表参数
  const tableParamsRef = useRef<TableParamsProps>({
    total: 0,
    current: 1,
    pageSize: propsPageSize || 30,
    isEnd: false,
  });
  // 是否加载渲染完
  const didMount = useRef<boolean>(false);
  // table dom 对象
  const wrapper = useRef<HTMLDivElement | null>(null);

  const tableRenderRef = useRef(propsTableRef?.current);

  // 创建本地数据库
  const { dbStore } = useTableStore();

  // 表头信息
  const columns = useResizeColumns<T>(tableColumns, useVirtual);

  const getColsRow = () => {
    return columns.reduce(
      (pre, next) => ({ ...pre, [next.dataIndex]: undefined }),
      {},
    );
  };

  /**
   * 鼠标上下左右移动焦距
   */
  useFieldFocus(
    { dataSource, tableTag: tableTag.current, wrapper: wrapper.current },
    [didMount.current],
  );

  /**
   * table内容高度
   */
  const scrollY = useTableYSize(rest?.scroll?.y);

  /**
   * 使用虚拟列表
   */
  const virtualComponents = useVirtualTable({
    height: scrollY,
    useVirtual: useVirtual || isScrolled,
  });

  /**
   * 获取页码与每页条数
   */
  const getPageInfo = useCallback(
    (current: number, pageSize: number, isPaging?: boolean) => {
      if (cacheTable) {
        let tableData: any = window.localStorage.getItem(tableStoreKey) || `{}`;
        try {
          tableData = JSON.parse(tableData);
        } catch (error) {
          console.log(error);
        }

        // 表格不是第一次加载时取入参的页码等，否则拿缓存数据
        const pageNo = didMount.current ? current : tableData?.page;
        const size = didMount.current ? pageSize : tableData?.size;

        // 当前是页码等操作变化取入参
        const usePage = isPaging ? current : pageNo;
        const useSize = isPaging ? pageSize : size;
        return {
          pageNo: usePage || 1,
          size: useSize || propsPageSize || 30,
          storeParams: tableData || {},
          didMount: didMount.current,
        };
      }

      return {
        pageNo: current || 1,
        size: pageSize || propsPageSize || 30,
        storeParams: {},
        didMount: true,
      };
    },
    [cacheTable, propsPageSize, tableStoreKey],
  );

  /**
   * 滚动加载
   */
  useScrollLoad(
    {
      wrapper: wrapper?.current,
      callback: async callback => {
        const { current, pageSize, total } = tableParamsRef.current;
        const maxPageNo = Math.ceil(Number(total) / Number(pageSize));

        if (tableParamsRef.current.isEnd) {
          return;
        }
        const pageNo = current + 1;
        if (pageNo > maxPageNo) {
          return;
        }

        await tableRenderRef?.current?.reload({
          current: pageNo,
          pageSize,
          ...(searchParamsRef.current || {}),
        });
        callback();
      },
    },
    [isScrolled, didMount.current, !!requestUrl],
  );

  // 更新表格数据
  const updateDataSource = useCallback(
    data => {
      const list = dataSource.map((v: T) => {
        if (data && v.commonTableKey === data.commonTableKey) {
          return { ...v, ...data };
        }
        return v;
      });

      setDataSource(list);
    },
    [dataSource],
  );

  // 单元格修改后触发行保存
  const handleSaveRow = useCallback(
    async (data: T, other: any) => {
      try {
        // hasEdited，数据是否变化
        const {
          hasEdited,
          currentCell,
          currentCellOldData,
          currentRowOldData,
        } = other;
        if (!hasEdited) {
          return;
        }

        let result = data;
        // 更新当前修改的数据
        updateDataSource(result);

        // 如果存在异步保存函数
        if (saveRowCallback) {
          const res = await saveRowCallback({
            currentCell,
            currentRow: data,
            currentCellOldData,
            currentRowOldData,
          });

          result = res || result;

          // 更新用户返回的数据
          requestAnimationFrame(() => {
            updateDataSource(result);
          });
        }
      } catch (error) {
        console.error('save row failed：', error);
      }
    },
    [updateDataSource, saveRowCallback],
  );

  // 新增行数据
  const createNewRow = useCallback(() => {
    const colsRow = getColsRow;
    setDataSource(v => ([colsRow].concat(v as any) as unknown) as T[]);
  }, [getColsRow]);

  const changeColumnsCallback = useCallback((data: any[]) => {
    setTableColumns(data);
  }, []);

  useEffect(() => {
    setTableColumns(propsColumns);
  }, [propsColumns]);

  /**
   * 替换当前表格的数据
   */
  useEffect(() => {
    if (props.dataSource) {
      // 纯外部控制表格数据
      if (isData) {
        const dataLength = props.dataSource.length;

        tableParamsRef.current = {
          ...tableParamsRef.current,
          total: dataLength,
        };
      }

      setDataSource(props.dataSource);
    }
  }, [props.dataSource]);

  /**
   * 列表数据变化时触发回调
   */
  useEffect(() => {
    if (dataSourceChangeCallback) {
      dataSourceChangeCallback(dataSource);
    }
  }, [dataSource, dataSourceChangeCallback]);

  useEffect(() => {
    if (propsTableRef) {
      // @ts-ignore
      propsTableRef.current = tableRenderRef.current;
    }
  }, [tableRenderRef.current]);

  // 第一次加载结束后
  useEffect(() => {
    didMount.current = true;
  }, []);

  return (
    <EnhanceContentContext.Provider
      value={{
        tableTag: tableTag?.current,
        columns: tableColumns,
        handleSaveRow,
        changeColumnsCallback,
      }}
    >
      <ErrorBoundary>
        <div className="commonTable" id="tablePart" ref={wrapper}>
          <Space className="tableHeaderBar">
            {useTool && <ToolBar<T> />}
            {isCreateed && (
              <Button type="primary" onClick={createNewRow}>
                新增
              </Button>
            )}
            {tableHeaderBar}
          </Space>
          <div style={{ overflowX: 'auto' }}>
            <TableRender
              {...rest}
              mode={mode}
              tableStoreKey={tableStoreKey}
              columns={columns}
              cacheTable={cacheTable}
              requestUrl={requestUrl}
              tableRef={tableRenderRef}
              dataSource={dataSource}
              setDataSource={setDataSource}
              searchParamsRef={searchParamsRef}
              tableParamsRef={tableParamsRef}
              virtualComponents={virtualComponents}
              getPageInfo={getPageInfo}
            />
          </div>
        </div>
      </ErrorBoundary>
    </EnhanceContentContext.Provider>
  );
}

export default EnhanceTable;
