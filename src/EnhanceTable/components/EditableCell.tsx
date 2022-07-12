/**
 * 单元格设置
 */
import React, { useMemo, useContext, useCallback, useEffect } from 'react';
import { uniqueId } from 'lodash';
import {
  EnDatePicker,
  EnInput,
  EnRangePicker,
  EnSelect,
  EnSwitch,
  EnSelectTree,
  EnCascader,
} from './Field';
import { EnhanceContentContext } from './EnhanceTable';
import { CellProps, FieldsProps, ValueType } from '../interface';
import { Tooltip } from 'antd';

function BaseField(props: FieldsProps) {
  const { fieldType, textData } = props;

  switch (fieldType) {
    case 'SELECT':
      return <EnSelect {...props} />;
    case 'INPUT':
      return <EnInput {...props} />;
    case 'DATE_PICKER':
      return <EnDatePicker {...props} />;
    case 'RANGE_PICKER':
      return <EnRangePicker {...props} />;
    case 'SWITCH':
      return <EnSwitch {...props} />;
    case 'SELECT_TREE':
      return <EnSelectTree {...props} />;
    case 'CASCADER':
      return <EnCascader {...props} />;
    default:
      return textData;
  }
}

function getEditableTableKey(name?: string) {
  return uniqueId(`${name || 'commonT'}_`);
}

function EditableCell(props: CellProps<any>) {
  const {
    children,
    dataIndex,
    type,
    record,
    rowIndex,
    dataList,
    fieldOptions,
    colIndex,
    ellipsis,
    setCellRowValue,
    render,
    ...restProps
  } = props;

  const { tableTag, handleSaveRow } = useContext(EnhanceContentContext);

  const cellData = useMemo(() => (record ? record[dataIndex] : undefined), [
    record,
    dataIndex,
  ]);

  // 每条数据添加「editableTableKey」属性，相当于主键ID
  useEffect(() => {
    // 防止重复生成ID，预防后续操作的数据无法追溯
    if (record && !record.commonTableKey) {
      record.commonTableKey = getEditableTableKey();
    }
  }, [record]);

  /**
   * 下拉框组件的数据
   */
  const cellDataList = useMemo(() => {
    if (typeof dataList === 'function') {
      return dataList(record, rowIndex) ?? [];
    }
    return dataList ?? [];
  }, [dataList, record, rowIndex]);

  /**
   * 组件的属性
   */
  const cellFieldOptions = useMemo(() => {
    if (typeof fieldOptions === 'function') {
      return fieldOptions(record, rowIndex);
    }
    return fieldOptions || {};
  }, [fieldOptions, record, rowIndex]);

  const cellValue = useMemo(() => {
    const val = (fieldOptions as any)?.value;
    if (val) {
      return val;
    } else {
      return cellData;
    }
  }, [(fieldOptions as any)?.value, cellData]);

  /**
   * 单元格类型
   */
  const cellType = useMemo(() => {
    if (typeof type === 'function') {
      return type(record, rowIndex) || 'TEXT';
    }
    return type || 'TEXT';
  }, [type, record, rowIndex]);

  // 单元格组件的样式类
  const fieldCls = useMemo(
    () => `${tableTag}-${cellType}-${rowIndex}-${colIndex}`,
    [tableTag, cellType, rowIndex, colIndex],
  );

  /**
   * 控件的值发生变化时
   */
  const fieldChange = useCallback(
    async (val: ValueType, o?: any) => {
      try {
        // 更新后的本行数据
        let params = {
          ...record,
          [dataIndex]: val,
        };

        if (setCellRowValue && typeof setCellRowValue === 'function') {
          const res = await setCellRowValue(params, o, record);
          params = { ...params, ...res };
        }

        // 如果自定义了回调
        if (cellFieldOptions?.onChange) {
          cellFieldOptions.onChange(params);
        }

        // 单元格字段名对于的数据
        const currentCell = { [dataIndex]: val };
        const currentCellOldData = { [dataIndex]: cellValue };
        // 是否修改过数据
        const oldData = cellValue ? cellValue.toString() : cellValue;
        const newData = val ? val.valueOf() : val;
        const hasEdited = oldData !== newData;

        if (handleSaveRow) {
          requestAnimationFrame(() => {
            handleSaveRow(params, {
              hasEdited,
              currentCell,
              currentCellOldData,
              currentRowOldData: record,
            });
          });
        }
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    },
    [
      record,
      dataIndex,
      setCellRowValue,
      cellFieldOptions,
      cellValue,
      handleSaveRow,
    ],
  );

  let childNode: any = (
    <BaseField
      fieldOptions={cellFieldOptions}
      dataList={cellDataList}
      fieldChange={fieldChange}
      fieldType={cellType}
      fieldValue={cellValue}
      fieldCls={fieldCls}
      textData={children}
    />
  );

  if (render) {
    const data = cellType === 'TEXT' ? cellValue : childNode;
    childNode = render(data, record, rowIndex);
  }

  return (
    <td
      {...(restProps as any)}
      style={
        ellipsis
          ? {
              ...(restProps as any).style,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }
          : (restProps as any).style
      }
    >
      {cellType === 'TEXT' && ellipsis ? (
        <Tooltip placement="topLeft" title={cellValue}>
          {cellValue}
        </Tooltip>
      ) : (
        childNode
      )}
    </td>
  );
}

export default EditableCell;
