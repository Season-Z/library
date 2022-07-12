import React from 'react';
import moment from 'moment';
import CommonTable from '../index';
import { Tooltip } from 'antd';
import { EnhanceTableColumnsProps } from '../interface';

export default function() {
  const columns: EnhanceTableColumnsProps<{
    merchantName: string;
    categoryList: string;
    createTime: string;
  }>[] = [
    {
      title: '货主',
      dataIndex: 'merchantName',
      key: 'merchantName',
      width: 50,
      render: t => {
        return <Tooltip title={t}>{t}</Tooltip>;
      },
    },
    {
      title: '品类',
      dataIndex: 'categoryList',
      key: 'categoryList',
      width: 180,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 10,
      render: t => (t ? moment(t).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
  ];
  return (
    <CommonTable
      columns={columns}
      searchParams={{
        merchantId: null,
        name: null,
        page: 1,
        shelfStatus: '0',
        stockStatus: '0',
        tenantId: 2,
      }}
      pageSize={100}
      requestUrl="pms.qgbyMerchantItemService.queryMerchantItemList"
      useVirtual
      scroll={{ y: 600 }}
    />
  );
}
