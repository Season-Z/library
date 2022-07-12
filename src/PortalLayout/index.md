---
title: PortalLayout - 中台子系统包裹组件
group:
  path: /
nav:
  path: /components
---

# Portal-Layout web 中台子系统包裹组件

## 代码演示

### 基本用法

<code src="./demo/1-demo-basic.tsx" title="基本用法" desc="中台portal包裹组件使用" />

## API

| 属性               | 说明                                            | 类型   | 默认值 |
| :----------------- | :---------------------------------------------- | :----- | :----- |
| topMenuCode        | 头部那个子系统是激活显示 ，不传跟 menuCode 一致 | 非必填 | 无     |
| menuCode           | 获取哪个左侧菜单                                | 必填   | 无     |
| children           | 容器内容                                        | 必填   | 无     |
| portalId           | Portal 的自定义 ID                              | 非必填 | 无     |
| portalLayoutId     | PortalLayout 的自定义 ID                        | 非必填 | 无     |
| showCityCode       | 右上角显示城市                                  | 非必填 | 无     |
| showOperationGroup | 右上角显示运营组                                | 非必填 | 无     |
| includeQuanguo     | 运营组是否要包含全国的运营组                    | 非必填 | 无     |
| menuItemClick      | Function;左侧菜单点击后的回调                   | 非必填 | 无     |
| localMenu          | 左侧菜单自定义传入的数据                        | 非必填 | 无     |

```javascript
export interface PortalProps {
  topMenuCode: string; // 非必填，不传跟menuCode一致
  menuCode: any; //'string'; //获取哪个左侧菜单
  children: any;
  portalId?: 'string'; // Portal的自定义ID
  portalLayoutId?: 'string'; // PortalLayout的自定义ID
  showCityCode?: boolean; // 右上角显示城市
  showOperationGroup?: boolean; // 右上角显示运营组
  includeQuanguo?: boolean; // 运营组是否要包含全国的运营组，全国包邮运营组 999999999
  menuItemClick?: Function; // 左侧菜单点击后的回调
  localMenu?: Array<any>; // 左侧菜单自定义传入的数据
}
```
