/**
 * title: 完整功能罗列
 * desc: 功能包括：分页查询、页面跳转、筛选排序以及多选回调
 */

import React, { useRef, useCallback } from 'react';
import moment from 'moment';
import EnhanceTable from '../index';
import { EnhanceTableRefProps } from '../index';

export default function() {
  const columns = [
    {
      title: '货主',
      dataIndex: 'merchantName',
      key: 'merchantName',
      width: 120,
      filters: [
        { text: 'Joe', value: 'Joe' },
        { text: 'Jim', value: 'Jim' },
      ],
      // 这些筛选、排序的条件自己根据业务需求配置
      // filteredValue: filteredInfo.merchantName || null,
      onFilter: (value: any, record: { merchantName: string | any[] }) =>
        record.merchantName.includes(value),
      sorter: (
        a: { merchantName: string | any[] },
        b: { merchantName: string | any[] },
      ) => a.merchantName.length - b.merchantName.length,
      // sortOrder: sortedInfo.columnKey === 'merchantName' && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: '品类',
      dataIndex: 'categoryList',
      key: 'categoryList',
      width: 180,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      ellipsis: true,
      render: (t: any) => (t ? moment(t).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
  ];

  const table = useRef<EnhanceTableRefProps>(null);

  // 进行筛选、排序操作的回调函数
  const sortCallback = useCallback((filters, sorters) => {
    console.log(filters, sorters);
    table.current?.reload(); // 重新刷新表格数据
  }, []);
  // 表格选择时的回调
  const rowSelectCallback = useCallback((keys, rows) => {
    console.log(keys, rows);
  }, []);

  return (
    <>
      {/* <FormBuilder elements={formfields} onSearch={searchHandler} /> */}
      <EnhanceTable
        tableRef={table}
        cacheTable
        columns={columns}
        requestUrl="pms.qgbyMerchantItemService.queryMerchantItemList"
        rowSelectCallback={rowSelectCallback}
        searchParams={{
          merchantId: null,
          name: null,
          page: 1,
          shelfStatus: '0',
          size: 10,
          stockStatus: '0',
          tenantId: 2,
        }} // 表格搜索的参数，修改此参数表格重新发送请求更新
        sortCallback={sortCallback}
        tableHeaderBar={<div>是我鸭~</div>}
        scroll={{ y: 600 }}
      />
    </>
  );
}
