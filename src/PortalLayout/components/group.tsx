import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import YpRequest from '../../YpRequest';
import YpEvent from '../../YpEvent';
import { setLocalData, getLocalData } from '../../YpRequest/utils';
import { withRouter } from 'react-router-dom';
const { Option } = Select;
interface IC {
  [propName: string]: any;
}
const TopGroup = (props: any) => {
  const [list, setList] = useState([] as any);
  const [groupList, setGroupList] = useState([] as any);
  const [value, setValue] = useState('');
  const [groupValue, setGroupValue] = useState('');
  const [menuData, setMenuData] = useState({} as any);
  const [matching, setMatching] = useState(() => {
    return true;
  });
  useEffect(() => {
    let matching = true;
    if (Object.keys(menuData).length === 0) {
      matching = true;
    } else {
      if (!menuData[props.history.location.pathname]) {
        matching = false;
      } else {
        matching = true;
      }
    }
    setMatching(matching);
  }, [props.history.location.pathname]);
  // 城市列表
  const getCityList = async () => {
    try {
      const dataVal = {};
      const res: IC = await YpRequest('auth.subject.listSubjectCity', dataVal);
      if (res.success) {
        const cityCode = res.result.data ? res.result.data[0].cityCode : '';
        const cityName = res.result.data ? res.result.data[0].cityName : '';
        setList(res.result.data);
        if (getLocalData('cityId')) {
          // 有就赋值
          const cityId = getLocalData('cityId') || '';
          setValue(cityId);
          props.valueChange(cityId);
        } else {
          // 没有就设置值
          setLocalData('cityId', cityCode);
          setLocalData('cityName', cityName);
          props.valueChange(cityCode);
          setValue(cityCode);
        }
      } else {
      }
    } catch (error) {
      console.log(' ...error', error);
    }
  };
  // 运营组列表
  const getGroupListFunc = async () => {
    try {
      const dataVal = { tenantId: getLocalData('tenantId') || 2 };
      const res: IC = await YpRequest(
        'mms.merchant.queryOperationGroupList',
        dataVal,
      );
      if (res.success) {
        let list = res.result;
        if (props.includeQuanguo) {
          list = [
            { operationGroupId: '999999999', operationGroupName: '全国运营组' },
            ...list,
          ];
        }
        setGroupList(list);
        const keyName = `operationGroupId${getLocalData('tenantId')}`;
        let groupValue = '';
        if (getLocalData(keyName)) {
          groupValue = getLocalData(keyName) || '';
        } else {
          if (getLocalData('operationGroupId')) {
            groupValue = getLocalData('operationGroupId') || '';
          }
        }
        if (!groupValue) {
          groupValue = res.result[0].operationGroupId || '';
          setLocalData(keyName, groupValue);
          setLocalData('operationGroupId', groupValue);
        }
        setGroupValue(groupValue);
        props.groupChange(groupValue);
      } else {
      }
    } catch (error) {
      console.log(' ...error', error);
    }
  };
  const onChange = (value: any) => {
    setValue(value);
    const cityItem = list.find((item: any) => {
      return item.cityCode === value;
    });
    setLocalData('cityId', value);
    setLocalData('cityName', cityItem.cityName);
    props.valueChange(value);
  };
  const onChangeGroup = (value: any) => {
    setGroupValue(value);
    props.groupChange(value);
    const keyName = `operationGroupId${getLocalData('tenantId')}`;
    setLocalData(keyName, value);
    setLocalData('operationGroupId', value);
  };
  useEffect(() => {
    YpEvent.on('menuList', data => {
      // const pathname = '/Allocation/Allocation';
      // console.log("'menuList', (data) ", data);
      setMenuData(data);
    });
    getCityList();
    getGroupListFunc();
  }, []);
  return (
    <>
      {/* {list.length > 0 ? ( */}
      <div
        id="topGroupPart"
        className="flexBread"
        style={{ display: props.showCityCode ? 'flex' : 'none' }}
      >
        <div className="dqwz">切换城市：</div>
        <Select
          showSearch
          style={{ width: 200 }}
          // open={false}
          disabled={matching ? false : true}
          placeholder="请选择城市"
          optionFilterProp="children"
          onChange={onChange}
          virtual={false} // 如果true会有问题，显示不完整
          // onFocus={onFocus}
          // onBlur={onBlur}
          // onSearch={onSearch}
          value={value}
          filterOption={(input, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {list.map((item: any) => (
            <Option key={item.cityCode} value={item.cityCode}>
              {item.cityName}
            </Option>
          ))}
        </Select>
      </div>
      {/* // ) : null} */}
      <div
        id="topGroupPart2"
        className="flexBread"
        style={{ display: props.showOperationGroup ? 'flex' : 'none' }}
      >
        <div className="dqwz">切换运营组：</div>
        <Select
          showSearch
          style={{ width: 200 }}
          // open={false}
          disabled={matching ? false : true}
          placeholder="请选择运营组"
          optionFilterProp="children"
          onChange={onChangeGroup}
          virtual={false} // 如果true会有问题，显示不完整
          // onFocus={onFocus}
          // onBlur={onBlur}
          // onSearch={onSearch}
          value={groupValue}
          filterOption={(input, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {groupList.map((item: any) => (
            <Option key={item.operationGroupId} value={item.operationGroupId}>
              {item.operationGroupName}
            </Option>
          ))}
        </Select>
      </div>
    </>
  );
};
export default withRouter(TopGroup);
