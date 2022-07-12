/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from 'react';
import $cookie from 'js-cookie';
import { Button, Modal, Tabs } from 'antd';
import YpRequest from '../../YpRequest';
import { setLocalData, getLocalData, jumpUrl } from '../../YpRequest/utils';

const version = '1.1.3';

interface IC {
  [propName: string]: any;
}
const TopHeader = (props: any) => {
  const [systemList, setSystemList] = useState([]);
  const [userName, setUserName] = useState('');
  const [count, setCount] = useState(0);
  const [env, setEnv] = useState(() => {
    let env = '';
    const localEnv = getLocalData('env') || 'prod';
    if (localEnv) {
      env = localEnv;
    } else {
      env = getLocalData('env') || 'prod';
    }
    return env;
  });
  const [state, setState] = useState({
    showBottom: false,
    appcodetop: props.topMenuCode || props.codeMenu,
    tenantName: '',
    tenantList: [],
  });
  const openBottomTenantList = () => {
    setState({ ...state, showBottom: !state.showBottom });
  };
  // 获取租户列表
  const getTenantList = async (phone: string) => {
    try {
      const dataVal = { phone, subjectType: 1 };
      const res: IC = await YpRequest(
        'auth.subject.listSubjectTenant',
        dataVal,
      );
      if (res.success) {
        const tenantList = res.result.data;
        let tenantId = '';
        const localTenantId = getLocalData('tenantId') || '';
        if (localTenantId) {
          tenantId = localTenantId;
        } else {
          tenantId = getLocalData('tenantId') || '2';
        }
        const tenantItem = tenantList.filter(
          (item: any) => item.tenantId === parseInt(tenantId),
        );

        setState({
          ...state,
          tenantList,
          tenantName: tenantItem[0].tenantName,
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  // 切换租户
  const tenantItemCli = async (item: any) => {
    try {
      const dataVal = { subjectId: item.subjectId, tenantId: item.tenantId };
      const res: IC = await YpRequest('auth.subject.switchSubject', dataVal);
      if (res.success && res.result.data) {
        setLocalData('subjectId', item.subjectId);
        setLocalData('tenantId', item.tenantId);
        let baseURL = 'https://scm-portal.ypshengxian.com/';
        if (env && env !== 'prod') {
          baseURL = `http://${env}-scm-portal.ypsx-internal.com/`;
        }

        jumpUrl(baseURL);
      }
    } catch (error) {}
  };
  // 拿到用户名
  const queryDefaultSubject = async () => {
    try {
      const dataVal = {
        phone: getLocalData('mobile') || '',
        tenantId: getLocalData('tenantId') || 2,
      };
      const res: IC = await YpRequest(
        'auth.subject.getSubjectByPhone',
        dataVal,
      );
      // console.log('res', res);
      if (res.success) {
        setUserName(res.result.data.relName || getLocalData('mobile'));
      }
    } catch (error) {
      console.log(' ...error', error);
    }
  };
  // 退出登录
  const onLogout = () => {
    Modal.confirm({
      content: '确认退出？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let baseURL = '.ypshengxian.com';
        let loginUrl = 'https://system.ypshengxian.com';
        if (env && env !== 'prod') {
          baseURL = '.ypsx-internal.com';
          loginUrl = `http://${env}-system.ypsx-internal.com/`;
        }
        $cookie.remove('token', {
          domain: baseURL,
          path: '/',
        });
        jumpUrl(loginUrl);
      },
    });
  };
  // 获取系统列表
  const listSubjectMenu = async () => {
    try {
      const dataVal = { appCode: 'YPSX_PORTAL' };
      const res: IC = await YpRequest('auth.subject.listSubjectMenu', dataVal);
      if (res.success) {
        setSystemList(res.result.data);
      }
    } catch (error) {
      console.log(' ...error', error);
    }
  };
  // 切换子系统
  const onSwtichCenter = (item: any) => {
    setState({ ...state, appcodetop: item });
    const pickItem = systemList.filter(sys => (sys as any).route === item);
    const objItem = pickItem[0];
    queryMenu(objItem);
  };
  // 查询点击子系统的菜单列表
  const queryMenu = async (item: any) => {
    try {
      const dataVal = { appCode: item.route };
      const res: IC = await YpRequest('auth.subject.listSubjectMenu', dataVal);
      if (res.success) {
        const urlJump = replaceLink(JSON.parse(item.metadata), 'link');
        // const itemObjLink = JSON.parse(item.metadata).link;
        const jumpList = res.result.data;
        const url = `${urlJump.link}${jumpList[0].route}`;
        jumpUrl(url);
      }
    } catch (error) {
      console.log(' ...error', error);
    }
  };
  const replaceLink = (item: any, linkName: any) => {
    if (env === 'dev') {
      if (item[linkName]) {
        item[linkName] = item[linkName].replace(/http:\/\/test/, 'http://dev');
      }
    } else if (env === 'test') {
      if (item[linkName]) {
        item[linkName] = item[linkName].replace(/http:\/\/dev/, 'http://test');
      }
      // eslint-disable-next-line no-empty
    } else if (env === 'sit') {
    } else if (env === 'pre') {
      // http://pre-finance.ypsx-internal.com  pre环境
      if (item[linkName] && /https:\/\//.test(item[linkName])) {
        let name = item[linkName]
          .replace(/.ypshengxian.com/, '')
          .replace(/https:\/\//, '');
        item[linkName] = `http://pre-${name}.ypsx-internal.com`;
      }
    } else if (env === 'prod') {
      // https://finance.ypshengxian.com 线上环境
      if (
        item[linkName] &&
        /(http:\/\/pre-)/.test(item[linkName]) &&
        /(.ypsx-internal.com)$/.test(item[linkName])
      ) {
        let name = item[linkName]
          .replace(/.ypsx-internal.com/, '')
          .replace(/http:\/\/pre-/, '');
        item[linkName] = `https://${name}.ypshengxian.com`;
      }
    }
    return item;
  };
  useEffect(() => {
    let phone = '';
    if (props.mobile) {
      phone = props.mobile;
    } else {
      const localMobile = getLocalData('mobile') || '';
      if (localMobile) {
        phone = localMobile;
      } else {
        phone = $cookie.get('mobile') || '';
      }
    }
    getTenantList(phone);
    queryDefaultSubject();
    listSubjectMenu();
  }, []);
  return (
    <>
      {state.tenantList.length > 0 ? (
        <div id="topHeaderId" className="topHeader">
          <div className="leftPart">
            <img
              onClick={() => {
                setCount(count => count + 1);
              }}
              className="logo"
              src="https://ss1.ypshengxian.com/yp-components/yp.png"
            />
            <div className="tenantName">{state.tenantName}</div>
            {count > 2 ? (
              <span style={{ color: 'red', fontSize: 12, fontWeight: 'bold' }}>
                V{version}
              </span>
            ) : null}
            <div
              aria-label="图标: up-circle"
              className={
                state.showBottom
                  ? 'anticon anticon-down-circle icon'
                  : 'anticon anticon-up-circle icon'
              }
              onClick={() => {
                openBottomTenantList();
              }}
            >
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="up-circle"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm178 555h-46.9c-10.2 0-19.9-4.9-25.9-13.2L512 460.4 406.8 605.8c-6 8.3-15.6 13.2-25.9 13.2H334c-6.5 0-10.3-7.4-6.5-12.7l178-246c3.2-4.4 9.7-4.4 12.9 0l178 246c3.9 5.3.1 12.7-6.4 12.7z"></path>
              </svg>
            </div>
          </div>
          <div className="midPart yp-center" style={{ overflow: 'hidden' }}>
            <Tabs
              type="card"
              className="yp-center-tabs"
              activeKey={`${state.appcodetop}`}
              onChange={onSwtichCenter}
              size="large"
              style={{ height: 78 }}
              // tabBarExtraContent={{ left: <h1>left</h1>, right: <h1>right</h1> }}
            >
              {systemList.map(center => (
                <Tabs.TabPane
                  key={`${(center as any).route}`}
                  tab={(center as any).name}
                ></Tabs.TabPane>
              ))}
            </Tabs>
          </div>
          <div className="rightPart">
            <div className="label-user">用户</div>
            <div className="userName">{userName}</div>
            <Button type="link" style={{ color: '#fff' }} onClick={onLogout}>
              [退出]
            </Button>
          </div>
          <div
            className="bottomTenant"
            style={{ display: state.showBottom ? 'flex' : 'none' }}
          >
            {state.tenantList.map(item => {
              return (
                <div
                  onClick={() => {
                    tenantItemCli(item);
                  }}
                  key={(item as any).tenantId}
                  className="tenantItem"
                >
                  {(item as any).tenantName}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
};
export default TopHeader;
