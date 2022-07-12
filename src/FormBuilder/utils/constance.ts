// 要去除前后空格的组件
export const trimWhitespaceFields = ['INPUT', 'INPUT_NUMBER', 'TEXT_AREA'];
// 失去焦点才获取值的控件
export const getValueInBlur = ['INPUT', 'INPUT_NUMBER', 'TEXT_AREA'];

// 不同大小的表单项对应的文本表单控件占据的空间大小
export const formItemLayoutType: { [x: number]: any } = {
  1: {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  },
  2: {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  },
  3: {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 2 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 22 },
    },
  },
  4: {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 2 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 22 },
    },
  },
};
