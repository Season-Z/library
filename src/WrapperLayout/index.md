---
title: WrapperLayout - 结构布局
nav:
  path: /components
---

# WrapperLayout 结构布局

总共提供了`WrapperLayout`、`WrapperForm`和`WrapperContent`组件，可以分开独立使用。

## 基本用法

<code src="./demo/Base.tsx"  title="使用三个组件布局" desc="例子为常规的列表查询页。如果是详情页可以只使用`WrapperContent`组件" />

## API

三个组件入参一致

| 参数      | 说明 | 类型                                         | 默认值 |
| :-------- | :--- | :------------------------------------------- | :----- |
| children  | 内容 | `ReactNode \| string \| JSX.Element \| null` | -      |
| className | 样式 | `string`                                     | -      |

```ts |pure
interface Props {
  children: ReactNode | string | JSX.Element | null;
  className?: string;
  [x: string]: any;
}
```
