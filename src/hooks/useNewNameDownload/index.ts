/**
 * 对服务器返回的excel文件的文件名进行修改
 */
import { message } from 'antd';
import { useCallback } from 'react';

function useNewNameDownload() {
  // 请求文件内容
  const request = useCallback((url: string) => {
    return new Promise(resolve => {
      let xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open('get', url, true);
      xhr.responseType = 'blob';
      xhr.onload = function({ target }: any) {
        if (target.status === 200) {
          resolve(target.response);
        } else {
          message.error('请求失败');
        }
      };
      xhr.send();
    });
  }, []);

  // 下载
  const download = useCallback((data: any, filename: string) => {
    const tempBlob = new Blob([data], {
      type: 'application/msexcel',
    });

    // 兼容不同浏览器的URL对象
    const url = window.URL || window.webkitURL;
    // 创建下载链接
    const downloadHref = url.createObjectURL(tempBlob);
    // 创建a标签并为其添加属性
    let downloadLink = document.createElement('a');
    downloadLink.style.display = 'none';
    downloadLink.href = downloadHref;
    downloadLink.download = `${filename}.xlsx`;
    document.body.appendChild(downloadLink);
    // 触发点击事件执行下载
    downloadLink.click();

    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(downloadHref); // 释放掉blob对象
  }, []);

  return {
    request,
    download,
  };
}

export default useNewNameDownload;
