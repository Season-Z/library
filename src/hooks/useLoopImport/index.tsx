import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { Modal, Progress } from 'antd';
import ypRider, { ResponstResult } from '../../YpRequest';
import useTimer from '../useTimer';
import useRefCallback from '../useRefCallback';

interface IProps {
  shouldLoopCallback: (arg: ResponstResult) => boolean;
  request: {
    url: string;
    params: Record<string, any>;
  };
}

function useLoopImportResult(
  props: IProps,
): {
  loading: boolean;
  startLoop: () => void;
  stopLoop: () => void;
  loadingModal: ReactNode | null;
} {
  const { shouldLoopCallback, request } = props;

  const [btnLoading, setBtnLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  // 轮训导入请求
  const importRequest = useCallback(async () => {
    setBtnLoading(true);

    const result: ResponstResult = await ypRider(request.url, request.params);

    // 失败不继续
    if (!result.success) {
      return false;
    }

    // 根据返回的状态 判断是否需要继续轮训
    const should = await shouldLoopCallback(result);

    return should;
  }, [request.url, request.params, shouldLoopCallback]);

  const timer = useTimer(importRequest, 1000);

  // 开始轮训
  const startLoop = useRefCallback(() => {
    setBtnLoading(true);
    setVisible(true);

    // 导入失败后的再次导入，重置状态
    timer.setResult(true);

    timer.start();
  }, [timer.start]);

  // 结束轮训
  const stopLoop = useRefCallback(() => {
    setBtnLoading(false);
    setVisible(false);

    timer.stop();
  }, [timer.stop]);

  // 是否继续轮训
  useEffect(() => {
    if (timer.result === false) {
      stopLoop();
    } else if (timer.result) {
      startLoop();
    }

    return stopLoop;
  }, [stopLoop, startLoop, timer.result]);

  const loadingModal = (
    <Modal
      width={540}
      visible
      centered
      destroyOnClose
      maskClosable={false}
      closable={false}
      footer={null}
    >
      <h3 className="mTop16 mBottom16 alignCenter">正在导入数据</h3>
      <div style={{ paddingBottom: '20px' }}>
        <Progress
          strokeColor={{
            from: '#108ee9',
            to: '#87d068',
          }}
          percent={100}
          showInfo={false}
          status="active"
        />
      </div>
    </Modal>
  );

  const dom = visible ? loadingModal : null;

  return {
    loading: btnLoading,
    startLoop,
    stopLoop,
    loadingModal: dom,
  };
}

export default useLoopImportResult;
