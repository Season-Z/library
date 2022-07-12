/**
 * title: 可编辑表格
 * desc: 设置`type`可将单元格变为可编辑的组件。如果用户在设置了`type`属性后还需要自定渲染内容，第一个参数将会返回可编辑组件的实例。Input组件的参数默认配置了formatter属性，用于输入控制。
 */
import React, { useRef, useCallback, useMemo } from 'react';
import EnhanceTable from '../index';
import FormBuilder, { EleProps } from '../../FormBuilder';
import {
  EnhanceTableColumnsProps,
  EnhanceTableRefProps,
  SaveRowProps,
} from '../../EnhanceTable/interface';
import { message } from 'antd';

interface TableColumnsType {
  merchantName: string;
  categoryList: number;
  createTime: string;
  brand: string;
  minDefaultPrice: number;
}

// 转成整数
export function exchageToNum1(value: any) {
  if (value.indexOf('.') !== -1) {
    const arr = value.split('.');
    if (arr.length) {
      return arr[0];
    }
  }

  return value.replace(/\D/g, '');
}

export default function() {
  const table = useRef<EnhanceTableRefProps>(null);
  const searchParams = useMemo(
    () => ({
      merchantId: null,
      name: null,
      page: 1,
      shelfStatus: '0',
      size: 10,
      stockStatus: '0',
      tenantId: 2,
    }),
    [],
  );

  const columns: EnhanceTableColumnsProps<TableColumnsType>[] = [
    {
      title: '最大默认值',
      dataIndex: 'minDefaultPrice',
      key: 'minDefaultPrice',
      width: 120,
      type: 'INPUT',
      render: (t, r) => (
        <div style={{ display: 'flex' }}>
          {t}/{r.brand}
        </div>
      ),
      fieldOptions: {
        formatter: exchageToNum1,
      },
    },
    {
      title: '品类',
      dataIndex: 'categoryList',
      key: 'categoryList',
      width: 180,
      type: 'INPUT',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      type: 'DATE_PICKER',
      fieldOptions: {
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];

  const formfields: EleProps[] = [
    {
      label: 'field',
      name: 'test',
      type: 'INPUT',
    },
  ];

  const searchHandler = useCallback(() => {
    table.current?.reload();
    const result = table.current?.getTableData();
    console.log(result);
  }, []);

  // 修改单元格的回调
  const saveRowCallback = useCallback(
    (data: SaveRowProps<TableColumnsType>) => {
      const {
        currentCell,
        currentCellOldData,
        currentRow,
        currentRowOldData,
      } = data;

      console.log(currentCell, currentCellOldData, currentRowOldData);
      // 异步请求
      const res = { success: true };

      // 成功返回新修改的行
      if (res.success) {
        message.success('保存成功');
        return currentRow;
      } else {
        // 失败返回原行数据
        return currentRowOldData;
      }
    },
    [],
  );

  return (
    <>
      <FormBuilder elements={formfields} onSearch={searchHandler} />
      <EnhanceTable<TableColumnsType>
        tableRef={table}
        columns={columns}
        requestUrl="pms.qgbyMerchantItemService.queryMerchantItemList"
        searchParams={searchParams}
        saveRowCallback={saveRowCallback}
        scroll={{ y: 600 }}
      />
    </>
  );
}
