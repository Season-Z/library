import { ColumnProps, TableProps } from 'antd/es/table';
import { ReactNode, RefObject } from 'react';

/**
 * 可编辑单元格的组件类型
 */
export type FieldsType =
  | 'SELECT'
  | 'INPUT'
  | 'RANGE_PICKER'
  | 'DATE_PICKER'
  | 'SWITCH'
  | 'SELECT_TREE'
  | 'CASCADER';

export type ValueType = string | number | boolean | undefined;

export interface FieldsProps {
  fieldChange: (arg0: any, arg1?: any) => void;
  fieldValue: string | number | any;
  dataList: DataListType[];
  fieldCls?: string;
  fieldType: FieldsType | 'TEXT';
  textData: any;
  fieldOptions?: {
    formatter: (arg?: string | number) => string; // 入参进行格式化，目前用于input\inputnumber
    [propName: string]: any;
  };
}

export interface DataListType {
  value: string | number;
  label: any;
  [x: string]: any;
}

export interface TableParamsProps {
  dataSource: any[];
  total: number;
  current: number;
  pageSize: number;
}

export interface SaveRowProps<T extends Record<string, any>> {
  currentCell: { [x: string]: any }; // 当前修改的单元格 {字段名:值}
  currentCellOldData: { [x: string]: any }; // 当前编辑的单元格老数据
  currentRow: T; // 当前修改的单元格对应的行数据，对象的格式
  currentRowOldData: T; // 当前行老数据
}

export interface SelectOptionType {
  children: string;
  key: string | number;
  value: string | number | boolean;
  rows: any;
  [x: string]: any;
}

export interface EnhanceTableColumnsProps<T> extends ColumnProps<T> {
  title: string | any;
  key?: string | number;
  dataIndex: string;
  width?: string | number;
  type?: ((arg1: T, arg2: number) => FieldsType | undefined) | FieldsType;
  hide?: boolean; // 是否展示列
  dataList?: DataListType[] | ((arg1: T, arg2: number) => DataListType[]);
  fieldOptions?: ((arg1: T, arg2: number) => unknown) | unknown; // 单元格的antd组件配置信息，返回一个函数
  render?: (arg0: any, arg1: T, arg2: number) => any;
  setCellRowValue?: (
    arg0: T,
    arg1: SelectOptionType,
    arg2: T,
  ) => Promise<T> | T; // 单元格值变化后设置单元格或行数据
}

export interface CellProps<T> extends EnhanceTableColumnsProps<T> {
  record: T;
  rowIndex: number;
  colIndex: number;
  dataIndex: string;
}

/**
 * table的入参
 */
export interface EnhanceTableProps<T> extends Omit<TableProps<T>, 'scroll'> {
  mode?: 'normal' | 'scroll' | 'data' | 'create'; // 表格分页模式
  columns: EnhanceTableColumnsProps<T>[]; // 列表的表头项
  requestUrl?: string; // 请求的url
  sortCallback?: (
    arg0: any,
    arg1: any,
  ) => Record<string, any> | undefined | void; // 筛选的回调
  rowSelectCallback?: (arg0: string[], arg1: T[]) => void; // 列表选择的回调
  searchParams?: Record<string, any>; // 表格搜索的参数
  cancelRequest?: boolean; // 页面加载时，是否发送请求获取列表数据
  dataSource?: T[]; // 外部传入的数据，替换当前页数据，主要用于查询
  pageSize?: number; // 页
  cacheTable?: boolean; // 是否缓存表格分页等数据
  useVirtual?: boolean; // 是否使用虚拟列表
  useTool?: boolean;
  tableRef?: RefObject<EnhanceTableRefProps>;
  disableRowClick?: boolean;
  afterRequest?: (arg: T[]) => T[] | Promise<T[]> | Promise<void>;
  saveRowCallback?: (
    arg: SaveRowProps<T>,
  ) =>
    | Promise<T | undefined>
    | Promise<void>
    | Promise<undefined>
    | T
    | undefined;
  clickRowCallback?: (arg0: Event, arg1: T, arg2?: number) => any;
  dataSourceChangeCallback?: (arg: T[]) => any;
  tableHeaderBar?: ReactNode | string;
  scroll?: { x?: number; y?: number; scrollToFirstRowOnChange?: boolean };
}

export interface EnhanceTableRefProps {
  reload: (arg?: {
    current?: number;
    pageSize?: number;
    [x: string]: any;
  }) => void;
  getTableData: () => TableParamsProps;
}
