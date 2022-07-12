---
title: FormBuilder - 强化表单
group:
  path: /
nav:
  path: /components
---

# FormBuilder 构建表单

## 简介

##### 将表单项内容数据和组件本身区分开来，通过此方式将其各司其职

1. `Form` 表单的响应式布局，支持`Antd`的`Form`所有`API`
2. 传入 `json` 数组字符串可生成对应的表单项，目前支持：`Select`、`Input`、`TextArea`、`RangePicker`、`DatePicker`、`InputNumber`、`Checkbox_Group`和 `Radio` 等 `Antd` 组件，可传入 `Antd` 组件的原生 `API`
3. 可以自定义单个组件的栅格布局，自定义 `FormItem` 展示的组件内容
4. 涵盖大部分的业务场景

## 基本用法(查询功能)

##### 查询功能。

<code src="./demo/Base.tsx" title="查询功能" desc="查询功能。包含了：表单数据初始化、支持的各类控件、以及各种默认配置" />

## 非查询的表单

<code src="./demo/NotSearch.tsx" />

## 业务里基本的联动操作

<code src="./demo/Linkage.tsx" title="业务里基本的联动操作" desc="显示隐藏某个表单项，给某个表单项控件赋值" />

## 自定义渲染表单项

<code src="./demo/CustomRender.tsx" title="自定义渲染表单项" desc="自定义渲染表单控件、设置表单项的布局、设置表单项的样式" />

## 自定义表单项占据几格位置

<code src="./demo/Columns.tsx" title="自定义表单项占据几格位置" desc="`elements`添加属性`columns`，可设置表单项占据的位置数。目前支持：1、2、3、4" />

## API

#### 注意

```tsx | pure
`Formbuilder`不是查询表单时，尽量不要给`elements`里添加`initialValue`属性，会存在表单值不变的情况。
属于`antd`的问题(在新版本里开始不建议使用这个属性了)。
使用`FormBuilderProps`类里的`initialValues`可实现。
```

#### Antd 的 FormItem 一些属性

```tsx | pure
interface FormItemProps {
  dependencies?: string | number | (string | number)[];
  extra?: string | ReactNode; // 额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个。
  getValueFromEvent?: (args: any[]) => any; // 设置如何将 event 的值转换成字段值
  getValueProps?: (value: any) => any; // 为子元素添加额外的属性
  hasFeedback?: boolean; // 配合 validateStatus 属性使用，展示校验状态图标，建议只配合 Input 组件使用
  help?: string | ReactNode; // 提示信息，如不设置，则会根据校验规则自动生成
  htmlFor?: string; // 设置子元素 label htmlFor 属性
  noStyle?: boolean; // 为 true 时不带样式，作为纯字段控件使用
  labelAlign?: 'left' | 'right'; // 标签文本对齐方式
  labelCol?: object; //标签布局
  wrapperCol?: object;
  preserve?: boolean; // 当字段被删除时保留字段值
  normalize?: (arg0: any, arg1: any, arg2: any) => any; // 组件获取值后进行转换，再放入 Form 中
  shouldUpdate?: (arg0: any, arg1: any) => boolean | boolean;
  trigger?: string; // 设置收集字段值变更的时机
  validateFirst?: boolean | 'parallel'; // 当某一规则校验不通过时，是否停止剩下的规则的校验。设置 parallel 时会并行校验
  validateStatus?: string; // 校验状态，如不设置，则会根据校验规则自动生成，可选：'success' 'warning' 'error' 'validating'
  validateTrigger?: string | string[]; //设置字段校验的时机
  valuePropName?: string; // 子节点的值的属性，如 Switch 的是 'checked'。该属性为 getValueProps 的封装，自定义 getValueProps 后会失效
}
```

#### FormBuilder

| 参数             | 说明                                                  | 类型                          | 默认值 |
| :--------------- | :---------------------------------------------------- | :---------------------------- | :----- |
| elements         | 展示的表单项 list                                     | `EleProps[]`                  | -      |
| leftElement      | 搜索按钮左侧的内容                                    | `ReactNode、string?`          | -      |
| onSearch         | 点击查询时所有表单项值的回调                          | `(any) => void?`              | -      |
| notSearchForm    | 是否为查询表单(样式会存在区别)                        | `boolean?`                    | true   |
| responsed        | 是否为响应式的表单(用于 notSearchForm 为 true 的情况) | `boolean?`                    | false  |
| onReset          | 重置表单的回调                                        | `() => void?`                 | -      |
| defaultExpand    | 是否展示所有表单查询项                                | `boolean?`                    | -      |
| formfieldsLength | 默认展示的表单项数量                                  | `number?`                     | 3      |
| formRef          | formbuilder 实例，继承了 Form 的所有方法              | `RefObject<FormInstance<T>>?` | -      |
| useCache         | 是否缓存表单数据                                      | `boolean?`                    | -      |

#### EleProps[](传入的表单项参数)

| 参数         | 说明                                                                                                                                                                                              | 类型                                                                                                          | 默认值 |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------ | :----- |
| name         | 控件的字段名                                                                                                                                                                                      | `string`                                                                                                      | -      |
| label        | 控件名                                                                                                                                                                                            | `string?`                                                                                                     | -      |
| rules        | 控件的校验规则                                                                                                                                                                                    | `[]?`                                                                                                         | -      |
| required     | 控件是否必填                                                                                                                                                                                      | `boolean?`                                                                                                    | false  |
| reset        | 控件 可否被重置                                                                                                                                                                                   | `boolean?`                                                                                                    | true   |
| widget       | 自定义渲染表单项                                                                                                                                                                                  | `any?`                                                                                                        | -      |
| type         | 组件类型                                                                                                                                                                                          | `SELECT\| INPUT\| RANGE_PICKER\| DATE_PICKER\| TEXTAREA\| INPUT_NUMBER\| TEXTAREA\| CHECKBOX_GROUP\|CASCADER` |
| dataList     | Select、 Radio 和 Checkbox_Group 的数据 list                                                                                                                                                      | `{ value: number\| string; label: string }[]?`                                                                | -      |
| hide         | 隐藏该表单项，但是查询或表单提交时该表单项的值会带上                                                                                                                                              | `boolean?`                                                                                                    | false  |
| fieldOptions | Antd 的控件(Input、Select 等等)原生配置。[Input](https://ant.design/components/input-cn/)。[Select](https://ant.design/components/select-cn/)。[Radio](https://ant.design/components/radio-cn/)。 | `object?`                                                                                                     |
| columns      | 当前表单项占据几个栅格                                                                                                                                                                            | `1 \| 2 \| 3 \| 4?`                                                                                           | -      |
