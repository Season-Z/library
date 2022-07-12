import React from 'react';
import EnhanceTable from '..';

function Loaded() {
  const columns = [
    {
      title: '货主',
      dataIndex: 'merchantName',
      key: 'merchantName',
      width: 120,
      ellipsis: true,
    },
    {
      title: '品类',
      dataIndex: 'categoryList',
      key: 'categoryList',
      width: 180,
      ellipsis: true,
    },
  ];

  return (
    <div>
      <EnhanceTable
        mode="scroll"
        columns={columns}
        searchParams={{
          merchantId: null,
          name: null,
          page: 1,
          shelfStatus: '0',
          size: 10,
          stockStatus: '0',
          tenantId: 2,
        }}
        requestUrl="pms.qgbyMerchantItemService.queryMerchantItemList"
        rowKey="name"
        scroll={{ y: 600 }}
      />
    </div>
  );
}

export default Loaded;
