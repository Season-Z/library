/**
 * 表格操作区
 */
import React from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Popover, Tooltip } from 'antd';
import ColumnsSettings from './ColumnsSettings';

function ToolBar<T>() {
  return (
    <div>
      <Popover
        content={<ColumnsSettings<T> />}
        title="设置列"
        trigger="click"
        placement="bottom"
      >
        <Tooltip title="设置列">
          <SettingOutlined style={{ fontSize: '18px' }} />
        </Tooltip>
      </Popover>
    </div>
  );
}

export default ToolBar;
