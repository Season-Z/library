import React from 'react';
import EnhanceTable from '../index';

const data = Array.from({ length: 60 }, (v, k) => {
  return {
    merchantName: `货主-${k}`,
    categoryList: `品类-${k}`,
    createTime: `创建时间-${k}`,
  };
});

function NoRequest() {
  const columns = [
    {
      title: '货主',
      dataIndex: 'merchantName',
      key: 'merchantName',
      width: 120,
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
      width: 160,
    },
  ];

  return (
    <EnhanceTable columns={columns} dataSource={data} scroll={{ y: 500 }} />
  );
}

export default NoRequest;
