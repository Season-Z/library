/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-parameter-properties */
/* eslint-disable @typescript-eslint/member-ordering */
import { Type, iParams } from './interface';
import axios from 'axios';
import { notification } from 'antd';
import { guid, getLocalData } from './utils';
import ypEvent from '../YpEvent';
import MiddleWare from '../MiddleWare';

const axiosObejct = axios.create({
  timeout: 5000,
  responseType: 'json',
  withCredentials: false,
  validateStatus: function(status) {
    return status >= 100 && status < 600;
  },
});
axiosObejct.interceptors.request.use(config => {
  config.headers = {
    'app-id': 'zhongtai',
    'app-platform': 'web',
    ...(config.headers ? config.headers : {}),
  };
  return config;
});
axiosObejct.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error); // reject这个错误信息 让下流catch到 /
  },
);
function createParams(params: iParams) {
  let tenantId = '';
  // getLocalData.get('tenantId') || '2'
  const localTenantId = getLocalData('tenantId') || '';
  if (localTenantId) {
    tenantId = localTenantId;
  } else {
    tenantId = getLocalData('tenantId') || '2';
  }
  let token = '';
  const localToken = getLocalData('token') || '';
  if (localToken) {
    token = localToken;
  } else {
    token = getLocalData('token') || '';
  }
  let requestParams = {
    api: params.apiUrl,
    version: params.version || '1.0',
    timestamp: new Date().getTime(),
    token,
    nonce: guid(),
    params: {
      tenantId: parseInt(tenantId),
      ...params.data,
    },
    ...params.restData,
  };
  return requestParams;
}
function getBaseUrl(apiName: string, params: any): string {
  let env = '';
  if (params.apiEnv) {
    env = params.apiEnv;
  } else {
    const localEnv = getLocalData('env') || '';
    if (localEnv) {
      env = localEnv;
    } else {
      env = getLocalData('env') || 'prod';
    }
  }
  let baseURL = 'https://apigw.ypshengxian.com/request';
  if (env && env !== 'prod') {
    baseURL = `https://apigw-${env}.ypshengxian.com/request`;
  }
  return baseURL + '?apiName=' + apiName;
}
class YpRequest {
  // 未来考虑多终端接入，小程序，react-native
  constructor(public type: Type = 'web') {}
  init() {
    console.log(this.type);
  }
  static async post(apiName: string, data: object = {}, restData: object = {}) {
    if (MiddleWare.request) {
      return MiddleWare.request(...arguments);
    }

    const paramsObj = createParams({ apiUrl: apiName, data, restData });
    let result: any = {};
    try {
      let res: any = await new Promise(resolve => {
        axiosObejct({
          method: 'POST',
          url: getBaseUrl(apiName as string, paramsObj),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
          data: paramsObj,
        })
          .then(res => {
            let { data } = res;
            if (data.success) {
              // 网关
              if (data.result && data.result.success) {
                // 业务
                if (data.result.hasOwnProperty('result')) {
                  resolve({
                    success: true,
                    result: data.result.result,
                    code: 200,
                    message: '请求成功',
                  });
                } else {
                  resolve({
                    success: true,
                    result: { ...data.result },
                    code: 200,
                    message: '请求成功',
                  });
                }
              } else {
                resolve({
                  success: false,
                  result: {},
                  code: data.result.code || data.result.error.code,
                  message: data.result.message || data.result.error.message,
                });
              }
            } else {
              resolve({
                success: false,
                code: data.error.code || data.code,
                message: data.error.message || data.message,
                result: {},
              });
            }
          })
          .catch(error => {
            console.log('error', error);
            let message = '系统异常';
            let code = -1000;
            if (error.message.includes('timeout')) {
              message = '接口请求超时';
              code = -9999;
            }
            result = { success: false, code, message, result: {} };
            resolve(result);
          });
      });
      result = res;
    } catch (error) {
      result = { success: false, result: {}, code: -1001, message: '系统异常' };
    }
    if (!result.success) {
      if (
        result.code === -32001 ||
        result.code === -32002 ||
        result.code === -32003
      ) {
        ypEvent.emit('auth_error', '登录失效');
      }
      notification.error({
        message: result.code,
        description: `${result.message}`,
      });
    }
    return result;
  }
}

export default YpRequest.post;
