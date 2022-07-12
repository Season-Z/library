---
title: useRefCallback - 回调缓存
nav:
  title: hooks
  path: /hooks
---

# `useRefCallback` 回调缓存

当 `useCallback` 和 `useEffect` 组合使用时，由于 `useCallback` 的依赖项变化也会导致 `useEffect` 执行，这种隐式依赖会带来 BUG 或隐患。一旦某个函数使用了 `useCallback` ，当这个函数的依赖项变化时所有直接或间接调用这个 `useCallback` 的都需要回归。所以这是成本高、有风险的事情。

```tsx | pure

const handleRequest = useRefCallback<() => boolean>(() => {
  ...
  return true
}, [...])

useEffect(() => {
  handleRequest()
}, [handleRequest])
```

## API

与`useCallback`用法一致

| 参数 | 说明               | 类型       | 默认值 |
| :--- | :----------------- | :--------- | :----- |
| fn   | 回调函数           | `function` | -      |
| deps | 轮训请求返回的回调 | `any[]`    | -      |
