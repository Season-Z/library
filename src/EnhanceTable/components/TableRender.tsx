/**
 * 终极奥义·通用列表
 */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
  SetStateAction,
  Dispatch,
  MutableRefObject,
} from 'react';
import { Table, Tag } from 'antd';
import { uniqueId } from 'lodash';
import EditableCell from './EditableCell';
import ypRider, { ResponstResult } from '../../YpRequest';
import ResizableTitle from './ResizableTitle';
import { EnhanceTableProps, EnhanceTableRefProps } from '../interface';
import { TableRowSelection } from 'antd/es/table/interface';
import useRefCallback from '../../hooks/useRefCallback';
import useTableYSize from '../hooks/useTableYSize';
import '../index.less';

export function getEditableTableKey(name?: string) {
  return uniqueId(`${name || 'commonT'}_`);
}

type ExcludeType =
  | 'useToolBar'
  | 'useVirtual'
  | 'tableHeaderBar'
  | 'saveRowCallback'
  | 'dataSourceChangeCallback'
  | 'tableRef';

interface TableRenderProps<T> extends Omit<EnhanceTableProps<T>, ExcludeType> {
  tableStoreKey: string;
  virtualComponents: {
    body: {
      wrapper: ReactNode;
      row: ReactNode;
    };
    table: ReactNode;
  } | null;
  setDataSource: Dispatch<SetStateAction<T[]>>;
  dataSource: T[];
  searchParamsRef: MutableRefObject<Record<string, any> | undefined>;
  tableParamsRef: MutableRefObject<{
    total: number;
    current: number;
    pageSize: number;
    isEnd: boolean;
  }>;
  tableRef?: MutableRefObject<EnhanceTableRefProps | null | undefined>;
  getPageInfo: (
    arg0: number,
    arg1: number,
    arg2?: boolean,
  ) => { pageNo: number; size: number; storeParams: any; didMount: boolean };
}

function TableRender<T extends Record<string, any>>(
  props: TableRenderProps<T>,
) {
  const {
    mode = 'normal',
    columns,
    searchParams,
    cacheTable = false, // 默认不缓存
    pageSize: propsPageSize,
    tableStoreKey,
    requestUrl,
    cancelRequest = false,
    tableRef: propsTableRef,
    virtualComponents,
    searchParamsRef,
    tableParamsRef,
    dataSource,
    disableRowClick,
    setDataSource,
    getPageInfo,
    rowSelectCallback,
    sortCallback,
    afterRequest,
    clickRowCallback,
    ...rest
  } = props;

  const isScrolled = mode === 'scroll';
  // 纯外部控制表格数据
  const isData = mode === 'data';

  const showPagination = isScrolled
    ? false
    : rest?.pagination === false
    ? false
    : true;

  // 保存函数
  const afterRequestRef = useRef(afterRequest);
  afterRequestRef.current = afterRequest;

  // 多选内容
  const [selectedRowKeys, setSelectedRowKeys] = useState<
    Array<number | string>
  >([]);
  // table loading
  const [loading, setLoading] = useState(false);
  // 手动刷新组件
  const [_, updateComponent] = useState<boolean>(false);
  /**
   * table内容高度
   */
  const scrollY = useTableYSize(rest?.scroll?.y);

  /**
   * table 滚动条
   */
  const scrollProps = useMemo(
    () => ({
      ...rest?.scroll,
      y: scrollY,
      scrollToFirstRowOnChange: !isScrolled,
    }),
    [scrollY, rest?.scroll, isScrolled],
  );

  /**
   * 获取CommonTable的selection配置
   * 缓存 rowselect 配置
   */
  const selection = useMemo(() => {
    // 如果没有自定义配置「rowSelection」以及没有「rowSelectCallback」表示不需要列表多选
    if (!rest?.rowSelection && !props.rowSelectCallback) {
      return undefined;
    }

    return {
      ...rest?.rowSelection,
      selectedRowKeys: selectedRowKeys,
      onChange: (keys: string[], selectedRows: T[]) => {
        setSelectedRowKeys(keys);

        if (rowSelectCallback) {
          rowSelectCallback(keys, selectedRows);
        }
      },
    };
  }, [
    props.rowSelectCallback,
    rest?.rowSelection,
    rowSelectCallback,
    selectedRowKeys,
  ]);

  /**
   * values 外部查询调用传参
   * pageParams 分页等查询参数
   */
  const sendRequest = useRefCallback(
    async (reqProps: {
      current: number;
      pageSize: number;
      isPaging?: boolean;
      searchParams?: Record<string, any>;
    }) => {
      if (!requestUrl || isData) {
        return;
      }

      setLoading(true);

      const { current, pageSize, isPaging = false, searchParams } = reqProps;
      const { pageNo, size, storeParams, didMount } = getPageInfo(
        current,
        pageSize,
        isPaging,
      );
      // 如果是刚进页面请求，优先使用缓存数据，否则则传入参数覆盖
      const params = didMount
        ? {
            ...storeParams,
            ...searchParams,
            page: pageNo,
            size,
          }
        : {
            ...searchParams,
            page: pageNo,
            size,
            ...storeParams,
          };

      try {
        if (!isScrolled) {
          setDataSource([]);
        }
        const result: ResponstResult = await ypRider(requestUrl, params);

        let { list, total = 0, isEnd = false } = result.result;
        if (afterRequestRef.current) {
          // const res = await afterRequest(list);
          const res = await afterRequestRef.current(list);

          list = res ?? list;
        }

        tableParamsRef.current = {
          total,
          current: pageNo,
          pageSize: size,
          isEnd,
        };

        // const finalList = list.map((v: T) => ({
        //   ...v,
        //   commonTableKey: getEditableTableKey(),
        // }));

        if (isScrolled) {
          // 滚动加载的话  就将数据拼接
          setDataSource(v => (pageNo === 1 ? list : v.concat(list)));
        } else {
          setDataSource(list);
        }

        setSelectedRowKeys([]);

        // 缓存则派发
        if (cacheTable) {
          window.localStorage.setItem(tableStoreKey, JSON.stringify(params));
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    },
    [requestUrl, cacheTable, isScrolled, isData, getPageInfo],
  );

  /**
   * 表格事件操作
   */
  const changeTable = useCallback(
    (pagination: any, filters: any, sorters: any) => {
      const { current, pageSize } = pagination;
      const { column } = sorters;
      // 防止没有排序的列发生请求
      if (sorters.column && !column.sorter) {
        return;
      }

      // 排序的回调
      if (sortCallback) {
        const res = sortCallback(filters, sorters);
        searchParamsRef.current = {
          ...searchParamsRef.current,
          ...(res || {}),
        };
      }

      if (!requestUrl) {
        tableParamsRef.current = {
          ...tableParamsRef.current,
          current,
          pageSize,
        };
        updateComponent(v => !v);
        return;
      }

      return sendRequest({
        current,
        pageSize,
        isPaging: true,
        searchParams: searchParamsRef.current || {},
      });
    },
    [sortCallback, sendRequest, requestUrl],
  );

  /**
   * 点击列表行
   * @param ev 点击的事件
   * @param record 当前行的数据
   */
  const onRowClick = useCallback(
    (ev, record: T, index?: number) => {
      // 点击行的回调
      if (clickRowCallback) {
        clickRowCallback(ev, record, index);
      }
      if (!selection) return;

      // 行的键
      const rowKey = rest?.rowKey
        ? rest?.rowKey
        : record.id
        ? 'id'
        : 'commonTableKey';
      // 获取键对应的值
      const tableRowVal = record[rowKey as string];

      const isSingle = selection.type ? selection.type === 'radio' : false;
      const exited = selectedRowKeys.includes(tableRowVal);

      const selectedKeys = exited
        ? selectedRowKeys.filter((v: number | string) => v !== tableRowVal)
        : isSingle
        ? [tableRowVal]
        : selectedRowKeys.concat(tableRowVal);

      const selectedRows = dataSource.filter((v: T) => {
        return selectedKeys.includes(v[rowKey as string]);
      });

      setSelectedRowKeys(selectedKeys);
      if (rowSelectCallback) {
        rowSelectCallback(selectedKeys, selectedRows);
      }
    },
    [
      selection,
      rest?.rowKey,
      selectedRowKeys,
      dataSource,
      rowSelectCallback,
      clickRowCallback,
    ],
  );

  /**
   * 设置表格行信息
   */
  const tableRowOption = useCallback(
    (record: T, index?: number) => {
      let rowsData = {};
      if (rest?.onRow && typeof rest?.onRow === 'function') {
        rowsData = rest?.onRow(record, index);
      }

      // 不允许点击行勾选行
      if (disableRowClick) {
        return rowsData;
      }
      return {
        ...rowsData,
        onClick: (ev: Event) => onRowClick(ev, record, index),
      };
    },
    [onRowClick, rest, disableRowClick],
  );

  /**
   * 通过该 hook 定义父组件 ref 拿到子组件的实例的内容
   * 父组件使用 reflashTable 来调用子组件 sendRequest 这个方法
   */
  useEffect(() => {
    if (propsTableRef) {
      // @ts-ignore
      propsTableRef.current = {
        reload: async params => {
          if (!requestUrl) {
            return;
          }
          const { current, pageSize, ...rest } = params || {};
          await sendRequest({
            current: params?.current || tableParamsRef.current.current,
            pageSize: params?.pageSize || tableParamsRef.current.pageSize,
            searchParams: rest || {},
          });
        },
        getTableData: () => ({ ...tableParamsRef.current, dataSource }),
      };
    }
  }, [propsTableRef, dataSource, sendRequest]);

  // 初始化及查询参数变化后请求
  useEffect(() => {
    if (cancelRequest || !requestUrl) {
      return;
    }

    searchParamsRef.current = searchParams;
    sendRequest({
      current: 1,
      pageSize: tableParamsRef.current.pageSize,
      searchParams,
    });
  }, [cancelRequest, searchParams, sendRequest]);

  return (
    <Table
      size="small"
      rowKey={(r: T) => (r.id ? r.id : r.commonTableKey)}
      {...rest}
      scroll={scrollProps}
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      onChange={changeTable}
      onRow={tableRowOption as any}
      rowSelection={selection as TableRowSelection<T>}
      components={
        {
          header: {
            cell: ResizableTitle,
          },
          body: {
            cell: EditableCell,
            wrapper: virtualComponents?.body.wrapper,
            row: virtualComponents?.body.row,
          },
          table: virtualComponents?.table,
        } as any
      }
      pagination={
        showPagination && {
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['30', '100', '300', '500'],
          pageSize: tableParamsRef.current.pageSize,
          total: tableParamsRef.current.total,
          current: tableParamsRef.current.current,
          showTotal: (total: number) => (
            <div>
              {rowSelectCallback && (
                <span className="mRight16">
                  已选择：
                  <Tag color="volcano">{selectedRowKeys.length}</Tag>条
                </span>
              )}
              共 {total} 条
            </div>
          ),
        }
      }
    />
  );
}

export default TableRender;
