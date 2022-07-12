/**
 * title: 基本用法
 * desc: 最基本的功能
 */
import React, { useCallback, useState } from 'react';
import moment from 'moment';
import EnhanceTable from '../index';
import DropdownMenu from '../../DropdownMenu';
import FormBuilder, { EleProps } from '../../FormBuilder';

export default function() {
  const [searchParams, setSearchParams] = useState<
    { [x: string]: any } | undefined
  >({
    merchantId: null,
    name: null,
    page: 1,
    shelfStatus: '0',
    size: 10,
    stockStatus: '0',
    tenantId: 2,
  });
  const formfields: EleProps[] = [
    {
      label: '货主',
      name: 'merchantName',
      type: 'INPUT', // 展示Input组件
      fieldOptions: {
        placeholder: '请输入 货主',
      },
    },
    {
      label: 'select',
      name: 'select',
      type: 'SELECT',
      dataList: [
        // Select组件下拉框的值
        { value: '3', label: '已失效' },
        { value: '4', label: '已结束' },
      ],
      fieldOptions: {},
    },
    {
      label: 'range',
      name: 'range',
      type: 'RANGE_PICKER',
      columns: 2,
      fieldOptions: {
        // antd组件的原生api配置
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      label: 'inputNumber',
      name: 'inputNumber',
      type: 'INPUT_NUMBER',
    },
    {
      label: 'date',
      name: 'date',
      type: 'DATE_PICKER',
      fieldOptions: {},
      // columns: 4,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    },
  ];

  // 点击查询的回调
  const searchHandler = useCallback(values => {
    console.log(values);
    setSearchParams(values);
  }, []);

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
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      ellipsis: true,
      render: (t: any) => (t ? moment(t).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: 120,
      ellipsis: true,
      render: (_: any, r: any) => {
        const dataList = [
          {
            event: () => {},
            name: '编辑',
          },
          {
            event: () => {},
            name: '删除',
          },
          {
            event: () => {},
            name: '启用',
          },
          {
            event: () => {},
            name: '禁用',
          },
        ];
        return <DropdownMenu dataList={dataList} num={2} />;
      },
    },
  ];

  const rowSelectCallback = useCallback((data: React.Key[], rows: any[]) => {
    console.log(data, rows);
  }, []);
  return (
    <>
      <FormBuilder
        elements={formfields}
        onSearch={searchHandler}
        onReset={searchHandler}
      />
      <EnhanceTable
        columns={columns}
        searchParams={searchParams}
        requestUrl="pms.qgbyMerchantItemService.queryMerchantItemList"
        rowSelectCallback={rowSelectCallback}
        rowKey="name"
        scroll={{ y: 600 }}
      />
    </>
  );
}
