import React, { useState, useEffect } from 'react';
import { PortalProps, KindMap } from './interface';
import { Layout } from 'antd';
import TopHeader from './components/header';
import LeftMenu from './components/menu';
import TopBreadcrumb from './components/breadcrumb';
import TopGroup from './components/group';
import YpEvent from '../YpEvent';
import { getLocalData, getUrl, jumpUrl } from '../YpRequest/utils';
const { Content } = Layout; // Header, , Sider , Sider, Header, Footer ,Header,
const prefixCls = 'portal-layout';
const kinds: KindMap = {
  info: '#5352ED',
  positive: '#2ED573',
  negative: '#FF4757',
  warning: '#FFA502',
};
const PortalLayout: React.FC<PortalProps> = ({
  children,
  topMenuCode,
  menuItemClick,
  includeQuanguo = false,
  portalId = 'portalLayoutId',
  menuCode,
  portalLayoutId = 'layoutWrapId',
  showCityCode = true,
  showOperationGroup = false,
  localMenu,
  ...rest
}) => {
  const [value, setValue] = useState('');
  const [groupValue, setGroupValue] = useState('');
  useEffect(() => {
    YpEvent.on('auth_error', data => {
      const env = getLocalData('env') || 'prod';
      let url = 'https://system.ypshengxian.com/';
      if (env && env !== 'prod') {
        url = `http://${env}-system.ypsx-internal.com/`;
      }
      if (getUrl().includes('localhost')) {
      } else {
        jumpUrl(url);
      }
    });
  }, []);
  return (
    <div className={prefixCls} id={portalId} {...rest}>
      <Layout
        style={{ height: '100vh', overflow: 'hidden' }}
        className="web-portal-layout"
        id={portalLayoutId}
      >
        <TopHeader topMenuCode={topMenuCode}></TopHeader>
        <Layout>
          <LeftMenu
            localMenu={localMenu}
            menuCode={menuCode}
            menuItemClick={menuItemClick}
          />
          <Layout style={{ padding: '0 10px 10px' }}>
            <div
              className="flexsb"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <TopBreadcrumb />
              <TopGroup
                valueChange={(value: string) => {
                  setValue(value);
                }}
                groupChange={(value: string) => {
                  setGroupValue(value);
                }}
                showCityCode={showCityCode}
                showOperationGroup={showOperationGroup}
                includeQuanguo={includeQuanguo}
              />
            </div>
            {showOperationGroup ? (
              <div
                className="contentWrap"
                style={{
                  height: '100%',
                  overflow: 'auto',
                  background: '#fff',
                  borderRadius: 5,
                }}
                key={groupValue}
              >
                {groupValue ? (
                  <Content className="site-layout-background">
                    {children}
                  </Content>
                ) : null}
              </div>
            ) : (
              <div
                className="contentWrap"
                style={{ height: '100%', background: '#fff', borderRadius: 5 }}
                key={value}
              >
                {value ? (
                  <Content className="site-layout-background">
                    {children}
                  </Content>
                ) : null}
              </div>
            )}
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

PortalLayout.propTypes = {
  // kind: t.oneOf(['info', 'positive', 'negative', 'warning']),
};

export default PortalLayout;
