// 放使用的组件，组件的用法
import PortalLayout from '../index';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Button, message } from 'antd';
import $cookie from 'js-cookie';
const menuCode = 'YPSX_ORDER';
function Demo(props: any) {
  const getData = async () => {};
  useEffect(() => {
    getData();
  }, []);
  return (
    <Router>
      <PortalLayout menuCode={menuCode} topMenuCode="YPSX_MMS">
        <Route
          path="/Portal"
          component={() => {
            return (
              <h1>
                base-{$cookie.get('cityId')}-{$cookie.get('operationGroupId')}-
                {$cookie.get('operationGroupId2')}
              </h1>
            );
          }}
        />
        <Route
          path="/home"
          component={() => {
            return <h1>home</h1>;
          }}
        />
        <Route
          path="/banner/list"
          component={() => {
            return <h1>/banner/list</h1>;
          }}
        />
        <Route
          path="/group/list"
          component={() => {
            return <h1>/group/list</h1>;
          }}
        />
      </PortalLayout>
    </Router>
  );
}

export default Demo;
