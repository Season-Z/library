import { ResponstResult } from '../YpRequest';

class MiddleWare {
  request: null | ((...arg: any) => Promise<ResponstResult>);
  constructor() {
    this.request = null;
  }
  useRequest(reqFunc: (...arg: any) => Promise<ResponstResult>) {
    this.request = reqFunc;
  }
}

export default new MiddleWare();
