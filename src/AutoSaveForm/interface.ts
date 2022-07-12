import { FormBuilderProps } from '../FormBuilder';
import { FormInstance } from 'antd/lib/form';
import { RefObject } from 'react';

export interface AutoFormRefProps extends FormInstance {
  handleSaveData: (arg: Record<string, any>) => Promise<void> | void;
  handleReviewData: (arg: Record<string, any>) => Promise<void> | void;
}

export interface AutoSaveFormProps<T> extends FormBuilderProps<T> {
  autoFormRef?: RefObject<AutoFormRefProps>;
  saveFormCallback?: (
    arg: T,
  ) => boolean | Promise<boolean | undefined> | undefined; // 返回是否保存成功
  dataChangeCallback?: (arg: T) => void | Promise<void>;
}
