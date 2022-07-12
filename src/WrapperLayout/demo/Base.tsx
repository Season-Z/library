import React, { useCallback, useState } from 'react';
import FormBuilder, { EleProps } from '../../FormBuilder';
import EnhanceTable from '../../EnhanceTable';
import WrapperLayout from '../index';

function Base() {
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

  // 点击查询的回调
  const searchHandler = useCallback(values => {
    console.log(values);
    setSearchParams(values);
  }, []);

  const formfields: EleProps[] = [
    {
      label: <div>sadadad</div>,
      name: 'input',
      type: 'INPUT', // 展示Input组件
      fieldOptions: {
        placeholder: 'sadadad',
      },
      required: true,
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
      columns: 3,
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
    <WrapperLayout.WrapperLayout>
      <WrapperLayout.WrapperForm>
        <FormBuilder elements={formfields} onSearch={searchHandler} />
      </WrapperLayout.WrapperForm>
      <WrapperLayout.WrapperContent>
        <EnhanceTable
          columns={columns}
          searchParams={searchParams}
          requestUrl="pms.qgbyMerchantItemService.queryMerchantItemList"
          rowKey="name"
        />
      </WrapperLayout.WrapperContent>
    </WrapperLayout.WrapperLayout>
  );
}

export default Base;
