/**
 * 搜索功能的Form表单 「收起展开」 功能
 */
import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { EleProps } from '../interface';

function useSliderBtn(
  formfields: EleProps[],
  notSearchForm: boolean | undefined,
  defaultExpand = false,
  formfieldsLength = 3,
): [EleProps[], ReactNode, EleProps[]] {
  // 整理出将可视的不可视的表单项
  const { visibleFields, hiddenFields, dateFields } = useMemo(() => {
    return formfields.reduce(
      (
        pre: {
          visibleFields: EleProps[];
          hiddenFields: EleProps[];
          dateFields: EleProps[];
        },
        next: EleProps,
      ) => {
        if (next.hide) {
          pre.hiddenFields = pre.hiddenFields.concat(next);
        } else {
          pre.visibleFields = pre.visibleFields.concat(next);
        }

        // 将日期表单项的字段名记录下来
        if (
          next.type &&
          ['RANGE_PICKER', 'DATE_PICKER', 'RANGE_PICKER_SHORT'].includes(
            next.type,
          )
        ) {
          pre.dateFields = pre.dateFields.concat(next);
        }

        return pre;
      },
      { visibleFields: [], hiddenFields: [], dateFields: [] },
    );
  }, [formfields]);

  // 将可视的不可视的表单项拼接
  const usefulFields = useMemo(() => visibleFields.concat(hiddenFields), [
    visibleFields,
    hiddenFields,
  ]);

  // 默认收起
  const [slideForm, setSlideForm] = useState(!defaultExpand);
  const [fields, setFields] = useState(usefulFields);

  const toggleForm = () => {
    setSlideForm(v => !v);
  };
  useEffect(() => {
    if (slideForm && !notSearchForm) {
      const { list } = usefulFields.reduce(
        (
          pre: { cols: number; list: EleProps[] },
          next: EleProps,
          index: number,
        ) => {
          const { hide, columns = 1 } = next;

          if (hide) {
            pre.list = pre.list.concat(next);
          } else if (index < formfieldsLength) {
            pre.cols += columns;

            pre.list = pre.list.concat({
              ...next,
              hide: pre.cols > formfieldsLength,
            });
          } else {
            pre.list = pre.list.concat({ ...next, hide: true });
          }

          return pre;
        },
        { cols: 0, list: [] },
      );

      setFields(list);
    } else {
      setFields(usefulFields);
    }
  }, [slideForm, usefulFields, notSearchForm, formfieldsLength]);

  // 如果表单项比较小设置默认值
  const btnElement =
    usefulFields.length <= formfieldsLength ? null : (
      <a key="btn" style={{ minWidth: '30px' }} onClick={toggleForm}>
        {slideForm ? '展开' : '收起'}
      </a>
    );

  return [fields, btnElement, dateFields];
}

export default useSliderBtn;
