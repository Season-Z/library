export interface LayoutProps {
  xxl: number;
  xl: number;
  lg: number;
  md: number;
  sm: number;
  xs: number;
}

export const defaultFormItemLayout: any = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
// 垂直排布的form布局
export const defaultVerticalLayout: any = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

// 不同 form layout属性下的布局栅格数
export const defaultLayout: any = {
  horizontal: defaultFormItemLayout,
  vertical: defaultVerticalLayout,
  inline: defaultFormItemLayout,
};

export const normalColLayout: LayoutProps = {
  xxl: 6,
  xl: 6,
  lg: 8,
  md: 12,
  sm: 24,
  xs: 24,
};

// 占据一整行
export const fullColLayout: LayoutProps = {
  xxl: 24,
  xl: 24,
  lg: 24,
  md: 24,
  sm: 24,
  xs: 24,
};
