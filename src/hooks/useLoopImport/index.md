---
title: useLoopImport - 轮训导入
nav:
  title: hooks
  path: /hooks
---

# `useLoopImport` 轮训导入

基于 `useTimer` 实现的轮训导入

## 使用

```tsx | pure
const { loading, loadingModal, startLoop, stopLoop } = useLoopImport({
  request: {
    url: ...,
    params: {
      ...
    }
  },
  shouldLoopCallback: useCallback((response) => {
    ...
  }, [...])
})

useEffect(() => {
  if (...) {
    startLoop()
  } else {
    stopLoop()
  }

  return stopLoop
}, [startLoop, stopLoop])

// Element
(
  <Button loading={loading} onClick={() => startLoop()}>开始</Button>
  {loadingModal}
)
```

## API

接收的入参

| 参数               | 说明               | 类型                         | 默认值 |
| :----------------- | :----------------- | :--------------------------- | :----- |
| request            | 请求的内容         | `{url:string;params:object}` | -      |
| shouldLoopCallback | 轮训请求返回的回调 | `(arg: response) => boolean` | -      |

返回的参数

| 参数         | 说明         | 类型         | 默认值 |
| :----------- | :----------- | :----------- | :----- |
| loading      | loading      | `boolean`    | -      |
| loadingModal | loading 浮层 | `ReactNode`  | -      |
| startLoop    | 开始轮训     | `() => void` | -      |
| stopLoop     | 结束轮训     | `() => void` | -      |
