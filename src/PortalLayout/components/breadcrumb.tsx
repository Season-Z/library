import React, { useState, useEffect } from 'react';
import YpEvent from '../../YpEvent';
import { useLocation } from 'react-router-dom';
const TopBreadcrumb = (props: any) => {
  const [menuList, setMenu] = useState([] as any);
  const [pathname, setPathName] = useState(useLocation().pathname);
  useEffect(() => {
    YpEvent.on('menuList', data => {
      // const pathname = '/Allocation/Allocation';
      const dataValue = data[pathname] || [];
      setMenu(dataValue);
    });
    YpEvent.on('menuCli', data => {
      // const pathname = '/Report/Stock/InventoryDetailReport';
      const pathname = data.item.route; //data.item.route || '';
      setPathName(pathname);
      const dataValue = data.menuObj[pathname] || [];
      setMenu(dataValue);
    });
  }, []);
  return (
    <div className="flexBread">
      <div className="dqwz">当前位置：</div>
      {menuList.length > 0 ? (
        <div
          id={props.topBreadcrumbId || 'topBreadcrumbId'}
          className="topBreadcrumb"
        >
          {pathname &&
            menuList.length > 0 &&
            menuList.map((item: any, index: number) => {
              return (
                <div className="brItem" key={item.route}>
                  {item.name}
                  {index + 1 === parseInt(menuList.length) ? null : (
                    <span className="hxportal">/</span>
                  )}
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
};
export default TopBreadcrumb;
