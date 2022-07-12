/**
 * 自动保存form表单
 *
 * 自动保存表单必填项
 * 当填完所有的必填项的表单后，触发回调函数。供父组件触发自动保存
 */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, FormInstance } from 'antd';
import FormBuilder from '../FormBuilder';
import moment from 'moment';
import { pick } from 'lodash';
import useDebounceFn from '../hooks/useDebounceFn';
import { FormStatusMap } from './constance';
import { AutoSaveFormProps } from './interface';

function isNull(params: string | null | undefined) {
  return params === undefined || params === null || params === '';
}

function AutoSaveForm<T extends Record<string, any>>(
  props: AutoSaveFormProps<T>,
) {
  const form = useRef<FormInstance>();
  const {
    elements,
    autoFormRef,
    dataChangeCallback,
    onValuesChange,
    saveFormCallback,
    ...rest
  } = props;

  // 表单项是否保存
  const [hasSaved, setHasSaved] = useState<boolean | undefined>(undefined);
  // 提示的类型和提示内容
  const [savedStatus, statusMessage] = useMemo<any>(
    () => FormStatusMap.get(hasSaved),
    [hasSaved],
  );

  // 过滤无效表单项
  const usefulFields = elements.filter(Boolean);

  // 获取所有必填的表单项
  const requiredFields = useMemo(() => {
    return usefulFields.filter(v => v?.required).map(v => v.name);
  }, [usefulFields]);

  // 日期表单项的数据
  const dateFields = useMemo(() => {
    return usefulFields.reduce((pre: any, next: any) => {
      if (next.type === 'RANGE_PICKER' || next.type === 'DATE_PICKER') {
        const format =
          next.fieldOptions && next.fieldOptions.format
            ? next.fieldOptions.format
            : 'YYYY-MM-DD';
        pre[next.name] = format;
      }
      return pre;
    }, {});
  }, [usefulFields]);

  /**
   * 将日期类型转成moment对象
   */
  const formatToMoment = useCallback(
    (fields: T) => {
      // 获取 日期 类型的表单项的 字段名
      const dateKeys = Object.keys(dateFields);

      // 类型转化
      dateKeys.forEach((val: string) => {
        (fields as any)[val] = fields[val]
          ? moment(fields[val], dateFields[val])
          : fields[val];
      });

      return fields;
    },
    [dateFields],
  );

  /**
   * 检查表单必填项是否填写
   * @param params 外部传入的，要补充的参数
   */
  const checkReuqiredFields = useCallback(
    (params: Record<string, any>): boolean => {
      // 所有必填项都被操作过后，判断是否存在没有填的必填项
      const values = form.current?.getFieldsValue(requiredFields);

      // 获取传入参数里的表单必填项的数据
      const otherReqParams = pick(params, requiredFields);
      const requiredParams = { ...values, ...otherReqParams };

      // 所有的必填项是否都有数据
      const isEmpty = Object.values(requiredParams).some((v: any) => {
        if (Array.isArray(v)) return !v.length;
        // 类型是 Moment 时，表示存在值
        if (moment.isMoment(v)) return false;
        return isNull(v);
      });

      return !isEmpty;
    },
    [requiredFields],
  );

  /**
   * 触发组件的保存的回调
   */
  const toggleSaveCallback = useDebounceFn(
    useCallback(
      async (allFields: any) => {
        if (saveFormCallback) {
          const boolean: boolean | undefined = await saveFormCallback(
            allFields,
          );
          // 是否保存成功
          setHasSaved(boolean);
        }
      },
      [saveFormCallback],
    ),
    800,
  );

  /**
   * 表单项的值改变时触发
   * @param field 当前修改的表单项
   * @param allFields 所有表单项的值
   */
  const changeForm = useDebounceFn(
    useCallback(
      (field: any, allFields: any) => {
        const currentValues = {
          ...allFields,
          ...form.current?.getFieldsValue(),
        };
        if (onValuesChange) {
          onValuesChange(field, currentValues);
        }

        setHasSaved(undefined);

        const hasSaved = checkReuqiredFields(currentValues);

        if (hasSaved) {
          // 所有必填项都填完，有值的情况下。可发送请求
          toggleSaveCallback(currentValues);
        }
        // 数据变化回调
        if (dataChangeCallback) {
          dataChangeCallback(currentValues);
        }
      },
      [
        onValuesChange,
        checkReuqiredFields,
        toggleSaveCallback,
        dataChangeCallback,
      ],
    ),
    800,
  );

  /**
   * 保存表单数据
   */
  const handleSaveData = useCallback(
    (data: Record<string, any>) => {
      const formData = formatToMoment({
        ...form.current?.getFieldsValue(),
        ...data,
      });

      const hasSaved = checkReuqiredFields(formData);

      form.current?.setFieldsValue(formData);

      setHasSaved(undefined);
      if (hasSaved) {
        // 所有必填项都填完，有值的情况下。可发送请求
        toggleSaveCallback(formData);
      }
      // 数据变化回调
      if (dataChangeCallback) {
        dataChangeCallback(formData);
      }
    },
    [
      checkReuqiredFields,
      toggleSaveCallback,
      dataChangeCallback,
      formatToMoment,
    ],
  );

  /**
   * 回显数据
   */
  const handleReviewData = useCallback(
    (data: Record<string, any>) => {
      const formData = formatToMoment({
        ...form.current?.getFieldsValue(),
        ...data,
      });
      const hasSaved = checkReuqiredFields(formData);

      form.current?.setFieldsValue(formData);

      if (hasSaved) {
        setHasSaved(true);
      }
      // 数据变化回调
      if (dataChangeCallback) {
        dataChangeCallback(formData);
      }
    },
    [checkReuqiredFields, dataChangeCallback, formatToMoment],
  );

  useEffect(() => {
    if (autoFormRef) {
      // @ts-ignore
      autoFormRef.current = {
        ...form?.current,
        handleSaveData,
        handleReviewData,
      };
    }
  }, [autoFormRef, form, handleSaveData, handleReviewData]);

  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <Alert message={statusMessage} type={savedStatus} banner showIcon />
      </div>
      <FormBuilder
        {...rest}
        formRef={form}
        elements={elements}
        notSearchForm={true}
        responsed={true}
        onValuesChange={changeForm}
        layout="vertical"
      />
    </>
  );
}

export default AutoSaveForm;
