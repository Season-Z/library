---
title: useTimer - 轮训
nav:
  title: hooks
  path: /hooks
---

# useTimer 轮训

1. 该 `hook` 使用了 `requestAnimationFrame` 来实现的轮训功能。替代`setTimeout`的方案
2. `useTimer` 可以实现倒计时功能
3. 更多实践可查看 `useLoopImport` ，轮训导入

## 基本用法

<code src="./demo/Base.tsx" title="基本功能" desc="`useTimer` 接收两个参数：轮训的函数和间隔时长（默认1000ms），然后返回 `start` 和 `stop` 的方法，可以控制是否开始轮训。" />

## API

```ts | pure
const { start, stop, result, setResult } = useTimer<boolean, () => boolean>(
  fn,
  time,
);
```

接收的入参

| 参数 | 说明         | 类型        | 默认值 |
| :--- | :----------- | :---------- | :----- |
| fn   | 要轮训的方法 | `() => any` | -      |
| time | 轮训的间隔   | `number`    | 1000ms |

返回的参数

| 参数      | 说明                   | 类型                          | 默认值 |
| :-------- | :--------------------- | :---------------------------- | :----- |
| start     | 开始轮训               | `() => any`                   | -      |
| stop      | 结束轮训               | `() => any`                   | -      |
| result    | 轮训函数的返回结果     | `any`                         | -      |
| setResult | 设置轮训函数的返回结果 | `Dispatch<SetStateAction<T>>` | -      |
