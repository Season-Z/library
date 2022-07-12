---
title: EnhanceTable - 通用表格
nav:
  path: /components
---

# EnhanceTable 通用表格

### EnhanceTable 基本功能

1. 集成了异步请求，只需要传入请求的`url`地址就行
2. 拥有`antd`的`Table`组件所有功能，并对各项表单的操作都有函数回调(包括筛选和排序)
3. 对表格的可编辑功能进行了拓展
4. 支持可编辑的 input 框上下左右光标移动

#### 注意

1. 设置 `useToolbar` 属性时，要确保当前页面路由下只有一个 `EnhanceTable` 设置了 `useToolbar`
2.

## 基本用法

<code src="./demo/Base.tsx" />

## 完整功能

<code src="./demo/Whole.tsx" title="完整功能罗列" desc="功能包括：分页查询、页面跳转、筛选排序以及多选回调" />

## 可编辑表格

<code src="./demo/Edit.tsx" />

## 虚拟列表功能

<code src="./demo/Virtual.tsx" title="虚拟列表功能" desc="设置为虚拟列表之后，每个单元格都会自动加上`ellipsis`。如果设置`render`方法自定义渲染单元格，则返回的必须得是行内元素，否则`ellipsis`会失效" />

## 滚动加载

<code src="./demo/Loaded.tsx" title="滚动加载" desc="没有翻页的功能，向下滚动自动加载下一页" />

## 不需要请求

<code src="./demo/NoRequest.tsx" title="不需要请求" desc="外部给table赋值">

## 可编辑表格

<code src="./demo/Edit.tsx" />

## 虚拟列表功能

<code src="./demo/Virtual.tsx" title="虚拟列表功能" desc="设置为虚拟列表之后，每个单元格都会自动加上`ellipsis`。如果设置`render`方法自定义渲染单元格，则返回的必须得是行内元素，否则`ellipsis`会失效" />

## 滚动加载

<code src="./demo/Loaded.tsx" title="滚动加载" desc="没有翻页的功能，向下滚动自动加载下一页" />

## 不需要请求

<code src="./demo/NoRequest.tsx" title="不需要请求" desc="外部给table赋值">

## API

#### `EnhanceTable<T>`

| 参数                     | 说明                                                           | 类型                                                           | 默认值 |
| :----------------------- | :------------------------------------------------------------- | :------------------------------------------------------------- | :----- |
| columns                  | 列表的表头项                                                   | `EnhanceTableColumnsProps<T>[]`                                | -      |
| requestUrl               | 请求的 url                                                     | `string?`                                                      | -      |
| sortCallback             | 筛选排序的回调函数；第一个参数是筛选的数据，第二个是排序的数据 | `(arg0: any, arg1: any) => Record<string, any> \| undefined` ? | -      |
| rowSelectCallback        | 列表选择的回调                                                 | `(arg0: any[], arg1: any[]) => void`?                          | -      |
| searchParams             | 表格搜索的参数                                                 | `object`?                                                      | -      |
| afterRequest             | 获取列表数据成功后，该方法返回的数据将用于表格渲染             | `(arg: T[]) => T[] \| Promise<T[]> \| Promise<void>`?          | -      |
| cancelRequest            | 页面加载时，是否发送请求获取列表数据                           | `boolean`?                                                     | -      |
| saveRowCallback          | 表格编辑保存的回调                                             | `Promise<T \| undefined> \| Promise<void> \| T \| undefined`?  | -      |
| dataSource               | 格式化返回数据                                                 | `T[]`?                                                         | -      |
| pageSize                 | 默认每页条数                                                   | `number`?                                                      | -      |
| useVirtual               | 是否使用虚拟列表                                               | `boolean`?                                                     | false  |
| cacheTable               | 是否缓存表格分页等数据                                         | `boolean`?                                                     | false  |
| tableRef                 | 表格的方法                                                     | `RefObject<EnhanceTableRefProps>`?                             | -      |
| clickRowCallback         | 点击表格的回调                                                 | `(arg0: Event, arg1: T, arg2?: number) => any`?                | -      |
| dataSourceChangeCallback | 表格数据变化后的回调                                           | `(arg: T[]) => any`?                                           | -      |
| tableHeaderBar           | 表格操作栏                                                     | `ReactNode \| string`?                                         | -      |

#### `EnhanceTableColumnsProps<T>[]`

继承了 Antd 的 ColumnProps，只列举新增加的字段

> SWITCH 类型的值必须得是布尔类型

```ts
type FieldsType =
  | 'SELECT'
  | 'INPUT'
  | 'RANGE_PICKER'
  | 'DATE_PICKER'
  | 'SWITCH';
```

| 参数            | 说明                             | 类型                                                                  | 默认值 |
| :-------------- | :------------------------------- | :-------------------------------------------------------------------- | :----- |
| title           | 标题                             | `string`                                                              | -      |
| dataIndex       | 字段名                           | `string`                                                              | -      |
| width           | 宽度                             | `number`?                                                             | -      |
| type            | 单元格组件类型                   | `((arg1: T, arg2: number) => FieldsType \| undefined) \| FieldsType`? | -      |
| hide            | 是否展示该列                     | `boolean`                                                             | false  |
| dataList        | 下拉框的值                       | `DataListType[] \| ((arg1: T, arg2: number) => DataListType[])`       | -      |
| fieldOptions    | 单元格的组件配置信息             | `((arg1: T, arg2: number) => unknown) \| unknown`                     | -      |
| setCellRowValue | 单元格值变化后设置单元格或行数据 | `(arg0: T, arg1: SelectOptionType, arg2: T) => Promise<T> \| T`       | -      |

#### `SaveRowProps<T>[]`

保存的回调

| 参数               | 说明                                     | 类型     | 默认值 |
| :----------------- | :--------------------------------------- | :------- | :----- |
| currentCell        | 当前修改的单元格 {字段名:值}             | `object` | -      |
| currentCellOldData | 当前编辑的单元格老数据                   | `object` | -      |
| currentRow         | 当前修改的单元格对应的行数据，对象的格式 | `T`      | -      |
| currentRowOldData  | 当前行老数据                             | `T`      | -      |

#### 手动触发表格刷新或者手动获取表格所有信息

```tsx | pure
interface EnhanceTableRefProps {
  // 入参：页码、每页条数和查询参数
  reload: (arg?: {
    current?: number;
    pageSize?: number;
    [x: string]: any;
  }) => void;
  getTableData: () => void;
}

const table = useRef<EnhanceTableRefProps>();

// 两秒刷新一次表格
useEffect(() => {
  setInterval(() => {
    table.current?.reload();
  }, 2000);
  // 入参刷新列表
  table.current?.reload({ a: xxx });
}, []);

useEffect(() => {
  table.current?.getTableData();
}, []);

// hooks 绑定
<EnhanceTable tableRef={table} />;
```
