---
title: 关于hooks
group:
  path: /
nav:
  title: hooks
  path: /hooks
---

# 关于 hooks

### 注意点

1. 不是所有公共方法都适用于用 hook 实现
2. 回调方法里最好不要访问外部的变量，适用 hook 常常会遇到闭包陷阱
3. 返回 jsx 内容不太适用于 hook，hook 定位不是创建公共组件

### 一些方案

1. 遇到闭包陷阱可用 ref 来打穿
2. 外部对 hook 方法本身的一些操作最好是让该 hook 暴露出实例方法
