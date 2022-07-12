import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import YpRequest from '../../YpRequest';
import YpEvent from '../../YpEvent';
import { useHistory, useLocation } from 'react-router-dom'; // useLocation
import { getLocalData } from '../../YpRequest/utils';
import {
  createFromIconfontCN,
  DatabaseOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';

const { SubMenu } = Menu;
const { Sider } = Layout;
interface IC {
  [propName: string]: any;
}
const LeftMenu = (props: any) => {
  const history = useHistory();
  const [menuList, setMenuList] = useState([] as any);
  const [menuObj, setMenuObj] = useState({} as any);
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState(
    useLocation().pathname,
  );
  const [state, setState] = useState({
    collapsed: false,
  });
  // iconfont.cn
  const IconFont = createFromIconfontCN({
    // scriptUrl: '//at.alicdn.com/t/font_1492696_4ai9rbngxhe.js'
    scriptUrl: 'http://at.alicdn.com/t/font_1492696_4ai9rbngxhe.js',
  });

  const collapsedFunc = () => {
    setState({ collapsed: !state.collapsed });
  };
  const arrMenuFunc = (arr: any, item = null) => {
    // const ary = arr; //.reverse()[0];
    // let menuObj: any = ary.reduce(keyByUsernameReducer, {});
    // 简单点，直接写死遍历3层吧
    let menuObj: any = {};
    // console.time();
    arr.forEach((el: any, index: number) => {
      if (el.children.length > 0) {
        el.children.forEach((ele: any, idx: number) => {
          if (ele.children.length > 0) {
            ele.children.forEach((pl: any, idx2: number) => {
              menuObj[pl.route] = [el, ele, pl];
            });
          } else {
            menuObj[ele.route] = [el, ele];
          }
        });
      } else {
        menuObj[el.route] = [el];
      }
    });
    // console.log('menuObj>>', menuObj);
    // console.timeEnd();
    setMenuObj(menuObj);
    YpEvent.emit('menuList', menuObj);
  };
  // 获取系统列表
  const listSubjectMenu = async () => {
    try {
      const dataVal = {
        appCode: props.menuCode,
        subjectId: getLocalData('subjectId'),
      };
      const res: IC = await YpRequest('auth.subject.listSubjectMenu', dataVal);
      if (res.success) {
        let menuData = [];
        if (props.localMenu) {
          menuData = props.localMenu;
        } else {
          menuData = res.result.data;
        }
        setMenuList(menuData);
        arrMenuFunc(menuData);
      } else {
      }
    } catch (error) {
      console.log(' ...error', error);
      return null;
    }
  };
  const getMenuList = (array: any) => {
    return array.map((item: any) => {
      if (item.children.length > 0) {
        return (
          <SubMenu
            key={item.route}
            icon={
              item.icon ? <IconFont type={item.icon} /> : <DatabaseOutlined />
            }
            title={item.name}
          >
            {getMenuList(item.children)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item
            icon={
              item.icon ? <IconFont type={item.icon} /> : <DatabaseOutlined />
            }
            onClick={() => menuItemClick(item)}
            key={item.route}
          >
            {item.name}
          </Menu.Item>
        );
      }
    });
  };
  const menuItemClick = (item: any) => {
    // console.log('props', props);
    // console.log('menuItemClick', item);
    // history.push(item.route);
    setDefaultSelectedKeys(item.route);
    YpEvent.emit('menuCli', { item, menuObj });
    history.push(item.route);
    props.menuItemClick && props.menuItemClick(item);
  };
  useEffect(() => {
    listSubjectMenu();
  }, []);
  return (
    <div className="outSlideWrap">
      <div
        className="iconRight"
        style={{ left: state.collapsed ? '80px' : '200px' }}
        onClick={() => {
          collapsedFunc();
        }}
      >
        {state.collapsed ? (
          <RightOutlined style={{ color: '#fff' }} className="poIcon" />
        ) : (
          <LeftOutlined style={{ color: '#fff' }} className="poIcon" />
        )}
      </div>
      <Sider
        collapsed={state.collapsed}
        style={{ width: '200px' }}
        className="sildePart"
      >
        {menuList.length > 0 ? (
          <Menu
            theme="dark"
            defaultSelectedKeys={[defaultSelectedKeys]}
            mode="inline"
          >
            {getMenuList(menuList)}
          </Menu>
        ) : null}
      </Sider>
    </div>
  );
};
export default LeftMenu;
