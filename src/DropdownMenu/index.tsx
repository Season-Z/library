/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactNode, memo } from 'react';
import { Dropdown, Menu, Divider } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { DropdownMenuProps } from './interface';

const MenuItem = Menu.Item;

/**
 * 渲染含下拉功能的操作按钮
 * @param {array} list
 * @param {number} num  展示在外面的数量
 */
function renderDrop(list: string | any[], num: number) {
  const outsideArr = list.slice(0, num);
  const resetList = list.slice(num);
  // 取出前两项
  const commonMenu = renderMenu(outsideArr);

  const dropMenu = (
    <Dropdown overlay={renderDropMenu(resetList)}>
      <a>
        <MoreOutlined />
      </a>
    </Dropdown>
  );

  return (
    <>
      {commonMenu}
      <Divider type="vertical" />
      {dropMenu}
    </>
  );
}

/**
 * 下拉 菜单
 * @param {array} list
 */
function renderDropMenu(list: any) {
  return <Menu>{renderMenu(list, MenuItem, null)}</Menu>;
}

/**
 * 渲染不含下拉功能的操作按钮
 * @param {array} list
 */
function renderMenu(
  list: any,
  Element?: ReactNode,
  hasDiver?: undefined | null,
) {
  const WrapEle: any = Element || React.Fragment;
  const div = hasDiver === null ? '' : <Divider type="vertical" />;
  const { length } = list;

  return (
    list &&
    list.map((value: any, index: number) => {
      // 判断当前是否为最后一项
      const isLast = index + 1 === length;

      return (
        <WrapEle key={`${value.name}-${index}`}>
          <a onClick={value.event}>{value.name}</a>
          {!isLast && div}
        </WrapEle>
      );
    })
  );
}

function DropdownMenu(props: DropdownMenuProps) {
  const { dataList, num } = props;
  const list = dataList.filter(Boolean);
  const dataLen = list.length;

  const count = num + 1;

  return (
    <div>{dataLen > count ? renderDrop(list, num) : renderMenu(list)}</div>
  );
}

export default memo(DropdownMenu);
