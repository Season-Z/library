---
title: AutoSaveForm - 自动保存表单
group:
  path: /
nav:
  path: /components
---

# AutoSaveForm 自动保存表单

#### 基本功能

当填完所有的必填项的表单后，触发回调函数。供父组件触发自动保存

## 基本用法

<code src="./demo/Base.tsx" />

## 手动赋值触发保存

<code src="./demo/HandleSave.tsx" />

#### 实际场景补充

从接口拿到表单数据回显时，可以通过 autoFormRef 上的 setFieldsValue 方法赋值。

## API

`AutoSaveForm` 的属性继承至 `FormBuilder`，`FormBuilder`的属性在 `AutoSaveForm` 都可以用

| 参数             | 说明                                                           | 类型                                   | 默认值 |
| :--------------- | :------------------------------------------------------------- | :------------------------------------- | :----- |
| saveFormCallback | 所有表单必填项输完后的回调，可在此回调触发保存                 | `(arg: object): boolean \| undefined?` | -      |
| autoFormRef      | 本组件的实例方法，包含了 Form 实例的方法，以及自定义的保存方法 | `RefObject<AutoFormRefProps>?`         | -      |

#### AutoFormRefProps

```ts | pure
interface AutoFormRefProps extends FormInstance {
  // 手动保存表单数据
  handleSaveData: (arg: Record<string, any>) => Promise<void> | void;
  // 编辑时  手动回显表单数据
  handleReviewData: (arg: Record<string, any>) => Promise<void> | void;
}
```
