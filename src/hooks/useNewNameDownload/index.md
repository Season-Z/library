---
title: useNewNameDownload - 修改excel的文件名
nav:
  title: hooks
  path: /hooks
---

# `useNewNameDownload` 修改 excel 的文件名

```tsx | pure
const nwNameDownload = useNewNameDownload()

const fileAddress = await request(...)

// 请求文件内容
const result = await nwNameDownload.request(fileAddress)
// 修改文件名并下载
nwNameDownload.download(result, 新文件名)
```

## API

返回参数

| 参数     | 说明                 | 类型                                     | 默认值 |
| :------- | :------------------- | :--------------------------------------- | :----- |
| request  | 请求文件内容的方法   | `(arg:string) => Promise<void>`          | -      |
| download | 修改文件名并下载方法 | `(arg1: response, arg2: string) => void` | -      |
